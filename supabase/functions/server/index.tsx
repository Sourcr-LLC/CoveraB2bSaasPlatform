import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { extractInsuranceDataFromDocument } from "./extract_insurance.tsx";
import { extractContractDataFromDocument } from "./extract_contract.tsx";
import { handleTestEmail } from "./test_email.tsx";
import { seedDemoData } from "./seed_demo.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Stripe-Mode"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return { user: null, error: 'No authorization header' };
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  return { user, error };
}

// Helper function to log activity
async function logActivity(userId: string, vendorId: string, action: string, detail: string, status: 'positive' | 'neutral' | 'warning' = 'neutral') {
  try {
    const activityId = `${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    const activity = {
      id: activityId,
      vendorId,
      action,
      detail,
      status,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`activity:${userId}:${vendorId}:${activityId}`, activity);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// Helper function to calculate days until expiry
function calculateDaysUntilExpiry(insuranceExpiry: string | undefined): number | null {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return null;
  }
  
  const expiryDate = new Date(insuranceExpiry);
  if (isNaN(expiryDate.getTime())) {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Helper function to calculate vendor status based on insurance expiry
function calculateVendorStatus(insuranceExpiry: string | undefined): string {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return 'non-compliant'; // No insurance or invalid date = non-compliant
  }
  
  const expiryDate = new Date(insuranceExpiry);
  
  // Check if date is valid
  if (isNaN(expiryDate.getTime())) {
    return 'non-compliant'; // Invalid date = non-compliant
  }
  
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'non-compliant'; // Expired
  } else if (daysUntilExpiry <= 30) {
    return 'at-risk'; // Expiring within 30 days
  } else {
    return 'compliant'; // Valid and not expiring soon
  }
}

// Helper function to get Stripe keys based on mode
function getStripeKeys(mode: string | null) {
  const isTestMode = mode === 'test';
  
  const secretKey = isTestMode 
    ? Deno.env.get('STRIPE_SECRET_KEY_TEST') 
    : Deno.env.get('STRIPE_SECRET_KEY');
  
  const publishableKey = isTestMode
    ? Deno.env.get('STRIPE_PUBLISHABLE_KEY_TEST')
    : Deno.env.get('STRIPE_PUBLISHABLE_KEY');
  
  const priceId = isTestMode 
    ? Deno.env.get('STRIPE_PRICE_ID_CORE_TEST') 
    : Deno.env.get('STRIPE_PRICE_ID_CORE');
  
  console.log(`Using Stripe ${isTestMode ? 'TEST' : 'PRODUCTION'} mode`);
  
  return { secretKey, publishableKey, priceId, isTestMode };
}

// Helper function to detect which Stripe mode is actually configured
function detectStripeMode(): 'test' | 'production' | null {
  const testKey = Deno.env.get('STRIPE_SECRET_KEY_TEST');
  const liveKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  // If both are configured, prefer test mode for safety
  if (testKey) {
    console.log('🔍 Detected TEST mode Stripe keys');
    return 'test';
  }
  if (liveKey) {
    console.log('🔍 Detected PRODUCTION mode Stripe keys');
    return 'production';
  }
  
  console.log('⚠️ No Stripe keys configured');
  return null;
}

// Helper function to get or create Stripe customer
async function getOrCreateStripeCustomer(secretKey: string, email: string, userId: string, stripeMode: string) {
  // Check if customer already exists in our database for this mode
  const existingSubscription = await kv.get(`subscription:${userId}:${stripeMode}`);
  if (existingSubscription?.customerId) {
    return existingSubscription.customerId;
  }

  // Check pending subscription too
  const pendingSubscription = await kv.get(`pending_subscription:${userId}:${stripeMode}`);
  if (pendingSubscription?.customerId) {
    return pendingSubscription.customerId;
  }

  // Create new customer
  const response = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'email': email,
      'metadata[userId]': userId,
      'metadata[mode]': stripeMode,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create customer');
  }

  const customer = await response.json();
  return customer.id;
}

// Health check endpoint
app.get("/make-server-be7827e3/health", (c) => {
  return c.json({ status: "ok" });
});

// Test email endpoint - ADDED HERE FOR VISIBILITY
app.post("/make-server-be7827e3/test-email", async (c) => {
  return handleTestEmail(c, verifyUser, kv);
});

// Seed demo data endpoint
app.post("/make-server-be7827e3/seed-demo-data", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendors = await seedDemoData(user.id);
    
    // Log overall activity
    await logActivity(user.id, 'system', 'demo_seed', `Generated ${vendors.length} demo vendors`, 'positive');

    return c.json({ 
      success: true, 
      message: `Successfully created ${vendors.length} demo vendors`,
      count: vendors.length 
    });
  } catch (error) {
    console.error('Seed demo data error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Clear demo data endpoint
app.post("/make-server-be7827e3/clear-demo-data", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all vendors
    const vendors = await kv.getByPrefix(`vendor:${user.id}:`);
    
    // Filter for demo vendors
    const demoVendors = vendors.filter((v: any) => 
      v.isDemo === true || 
      (v.notes && typeof v.notes === 'string' && v.notes.startsWith('Demo vendor')) ||
      (v.email && typeof v.email === 'string' && v.email.endsWith('@example.com')) // Also clear vendors with example.com email
    );
    
    if (demoVendors.length === 0) {
      return c.json({ 
        success: true, 
        message: 'No demo data found to clear',
        count: 0
      });
    }

    // Delete them
    const keysToDelete = demoVendors.map((v: any) => `vendor:${user.id}:${v.id}`);
    await kv.mdel(keysToDelete);
    
    // Log activity
    await logActivity(user.id, 'system', 'demo_clear', `Cleared ${demoVendors.length} demo vendors`, 'neutral');

    return c.json({ 
      success: true, 
      message: `Successfully removed ${demoVendors.length} demo vendors`,
      count: demoVendors.length 
    });
  } catch (error) {
    console.error('Clear demo data error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Demo request endpoint - sends demo request to admin email (no auth required for landing page)
app.post("/make-server-be7827e3/demo-request", async (c) => {
  try {
    const { name, email, company, phone, vendors, message } = await c.req.json();
    
    if (!name || !email || !company) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return c.json({ error: 'Email service not configured' }, 500);
    }

    console.log(`📧 Demo request from ${name} (${email}) at ${company}`);
    
    // Send notification email to admin
    const adminEmail = 'or@getcovera.co'; // Change this to your actual email
    
    let emailResponse;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Covera Demo Requests <noreply@covera.co>',
          to: [adminEmail],
          reply_to: email,
          subject: `New Demo Request from ${company}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background: #F9FAFB; }
                  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                  .header { text-align: center; margin-bottom: 32px; }
                  .logo { font-size: 28px; font-weight: 600; color: #3A4F6A; }
                  .content { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px; }
                  h1 { font-size: 20px; font-weight: 600; margin: 0 0 24px 0; }
                  .info-row { padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
                  .label { font-size: 14px; font-weight: 500; color: #6B7280; }
                  .value { font-size: 14px; color: #1F2937; font-weight: 500; margin-top: 4px; }
                  .badge { background: #DBEAFE; color: #1E40AF; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">Covera</div>
                    <div style="margin-top: 8px;"><span class="badge">NEW DEMO REQUEST</span></div>
                  </div>
                  <div class="content">
                    <h1>🎯 New Demo Request</h1>
                    <p style="color: #6B7280; font-size: 14px;">A potential customer has requested a demo.</p>
                    
                    <div class="info-row">
                      <div class="label">Contact Name</div>
                      <div class="value">${name}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    <div class="info-row">
                      <div class="label">Company</div>
                      <div class="value">${company}</div>
                    </div>
                    ${phone ? `<div class="info-row"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
                    ${vendors ? `<div class="info-row"><div class="label">Vendors Managed</div><div class="value">${vendors}</div></div>` : ''}
                    ${message ? `<div class="info-row"><div class="label">Message</div><div class="value">${message}</div></div>` : ''}
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
      });

      if (emailResponse.status === 429) {
        console.log(`Rate limit hit (429), retrying in ${attempt + 1}s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        attempt++;
        continue;
      }

      break;
    }

    if (!emailResponse || !emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Resend API error:', errorData);
      return c.json({ error: `Failed to send demo request email: ${errorData.message || 'Unknown error'}` }, 500);
    }

    const emailData = await emailResponse.json();
    console.log(`✅ Demo request email sent! ID: ${emailData.id}`);
    
    // Store demo request in KV for tracking
    try {
      const requestId = `demo_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
      await kv.set(`demo_request:${requestId}`, {
        id: requestId,
        name,
        email,
        company,
        phone: phone || null,
        vendors: vendors || null,
        message: message || null,
        createdAt: new Date().toISOString(),
      });
      console.log(`💾 Demo request stored with ID: ${requestId}`);
    } catch (kvError) {
      // Don't fail the entire request if KV storage fails
      console.error('KV storage error (non-fatal):', kvError);
    }
    
    return c.json({ success: true });
    
  } catch (error) {
    console.error('Demo request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ error: errorMessage }, 500);
  }
});

// Email proxy endpoint - calls Resend API from server
app.post("/make-server-be7827e3/send-email-proxy", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { to, subject, html } = await c.req.json();
    
    if (!to || !subject || !html) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      return c.json({ error: 'RESEND_API_KEY not configured' }, 500);
    }

    console.log(`📧 Sending email to ${to}`);
    
    let emailResponse;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Covera <noreply@covera.co>',
          to,
          subject,
          html,
        }),
      });

      if (emailResponse.status === 429) {
        console.log(`Rate limit hit (429), retrying in ${attempt + 1}s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        attempt++;
        continue;
      }
      
      break;
    }

    if (!emailResponse || !emailResponse.ok) {
      const errorData = await emailResponse?.json().catch(() => ({}));
      console.error('Resend API error:', errorData);
      return c.json({ error: 'Failed to send email', details: errorData }, 500);
    }

    const emailData = await emailResponse.json();
    console.log(`✅ Email sent! ID: ${emailData.id}`);
    
    return c.json({ success: true, emailId: emailData.id });
    
  } catch (error) {
    console.error('Send email error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== BACKEND INTEGRATION ====================

// ==================== AUTH ROUTES ====================

// Sign up request - sends verification code
app.post("/make-server-be7827e3/auth/signup-request", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return c.json({ error: 'Internal server error' }, 500);
    }
    
    const existingUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return c.json({ error: 'User with this email already exists' }, 400);
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 600000; // 10 minutes

    // Store verification code in KV
    await kv.set(`signup_verification:${email.toLowerCase()}`, {
      email: email.toLowerCase(),
      name,
      code: verificationCode,
      expiresAt,
      createdAt: Date.now(),
    });

    // LOG CODE FOR TESTING/DEBUGGING
    console.log(`🔐 VERIFICATION CODE for ${email}: ${verificationCode}`);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      // In dev/test, allow proceeding even without email config
      // return c.json({ error: 'Email service not configured' }, 500);
      return c.json({ success: true, warning: 'Email service not configured, check logs for code' });
    }

    // Send email
    try {
      let emailResponse;
      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Covera <noreply@covera.co>',
            to: [email],
            subject: 'Verify your email for Covera',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 32px; font-weight: 600; color: #3A4F6A; letter-spacing: -0.02em; }
                    .content { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 40px; }
                    h1 { font-size: 24px; font-weight: 600; color: #1F2937; margin: 0 0 16px 0; }
                    p { color: #6B7280; margin: 0 0 24px 0; font-size: 16px; }
                    .code-container { text-align: center; margin: 32px 0; }
                    .code { display: inline-block; background: #F3F4F6; border: 2px solid #3A4F6A; color: #3A4F6A; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px 32px; border-radius: 12px; font-family: 'Courier New', monospace; }
                    .footer { text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 14px; }
                    .security-note { background: #F3F4F6; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 14px; color: #6B7280; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <div class="logo">Covera</div>
                    </div>
                    <div class="content">
                      <h1>Verify your email</h1>
                      <p>Hi ${name || 'there'},</p>
                      <p>Thanks for signing up for Covera. Please use the following code to verify your email address:</p>
                      <div class="code-container">
                        <div class="code">${verificationCode}</div>
                      </div>
                      <p style="text-align: center; color: #6B7280; font-size: 14px;">Enter this code to complete your registration</p>
                      <div class="security-note">
                        <strong>🔒 Security note:</strong> This code will expire in 10 minutes.
                      </div>
                    </div>
                    <div class="footer">
                      <p>Enterprise vendor compliance tracking</p>
                      <p>© ${new Date().getFullYear()} Covera. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        if (emailResponse.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          attempt++;
          continue;
        }
        break;
      }

      if (!emailResponse || !emailResponse.ok) {
        const errorData = await emailResponse?.json().catch(() => ({}));
        console.error('Resend API error:', errorData);
        // Don't block flow, but log error
        // return c.json({ error: 'Failed to send verification email' }, 500);
      }
    } catch (emailError) {
      console.error('Failed to send email (exception):', emailError);
      // Proceed despite email error
    }

    return c.json({ success: true });

  } catch (error) {
    console.error('Signup request error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Sign up verify - completes registration
app.post("/make-server-be7827e3/auth/signup-verify", async (c) => {
  try {
    const { email, code, password, name, organizationName } = await c.req.json();

    if (!email || !code || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const verificationData = await kv.get(`signup_verification:${email.toLowerCase()}`);

    if (!verificationData) {
      return c.json({ error: 'Verification code not found or expired. Please try signing up again.' }, 400);
    }

    if (verificationData.code !== code) {
      return c.json({ error: 'Invalid verification code' }, 400);
    }

    if (Date.now() > verificationData.expiresAt) {
      return c.json({ error: 'Verification code expired' }, 400);
    }

    // Create user using Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      email,
      name,
      organizationName: organizationName || '',
      plan: 'free',
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
    });

    // Cleanup verification code
    await kv.del(`signup_verification:${email.toLowerCase()}`);

    return c.json({ user: data.user });

  } catch (error) {
    console.error('Signup verify error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Sign up route (LEGACY - kept for backward compatibility but effectively replaced)
app.post("/make-server-be7827e3/auth/signup", async (c) => {
  try {
    const { email, password, name, organizationName } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create user using Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      email,
      name,
      organizationName: organizationName || '',
      plan: 'free',
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get profile route
app.get("/make-server-be7827e3/auth/profile", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update profile route
app.put("/make-server-be7827e3/auth/profile", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const profile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Validate session route - simple endpoint to check if a token is valid
app.get("/make-server-be7827e3/auth/validate", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized', valid: false }, 401);
    }

    return c.json({ valid: true, userId: user.id });
  } catch (error) {
    console.error('Validate session error:', error);
    return c.json({ error: 'Unauthorized', valid: false }, 401);
  }
});

// Upload logo route
app.post("/make-server-be7827e3/auth/upload-logo", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Parse form data
    const formData = await c.req.formData();
    const file = formData.get('logo') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 2MB' }, 400);
    }

    // Create bucket if it doesn't exist
    const bucketName = 'make-be7827e3-logos';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 2097152, // 2MB
      });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (!signedUrlData?.signedUrl) {
      return c.json({ error: 'Failed to generate signed URL' }, 500);
    }

    // Update user profile with logo URL
    const profile = await kv.get(`user:${user.id}`) || {};
    const updatedProfile = {
      ...profile,
      logoUrl: signedUrlData.signedUrl,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ logoUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error('Upload logo error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== PASSWORD RESET ROUTES ====================

// Request password reset - sends email with reset link
app.post("/make-server-be7827e3/auth/forgot-password", async (c) => {
  console.log('📧 Password reset request received');
  try {
    const { email } = await c.req.json();
    console.log('Email from request:', email);
    
    if (!email) {
      console.error('No email provided in request');
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if user exists
    console.log('Looking up user with email:', email);
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return c.json({ error: 'Failed to process request' }, 500);
    }
    
    const user = users?.find(u => u.email === email);

    if (!user) {
      console.log('User not found for email:', email);
      // For security, don't reveal if email exists
      return c.json({ success: true });
    }
    
    console.log('User found, generating verification code...');

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 600000; // 10 minutes

    // Store verification code in KV
    await kv.set(`password_reset:${email}`, {
      userId: user.id,
      email: user.email,
      code: verificationCode,
      expiresAt,
      createdAt: Date.now(),
    });

    // Get user profile for name
    const profile = await kv.get(`user:${user.id}`);
    const userName = profile?.name || 'there';

    console.log('Verification code generated:', verificationCode);
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return c.json({ error: 'Email service not configured' }, 500);
    }
    console.log('Resend API key found, preparing to send email...');
    
    console.log('Sending email to:', email, 'with userName:', userName);
    
    let emailResponse;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Covera <noreply@covera.co>',
          to: [email],
          subject: 'Your Covera password reset code',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                  .header { text-align: center; margin-bottom: 40px; }
                  .logo { font-size: 32px; font-weight: 600; color: #3A4F6A; letter-spacing: -0.02em; }
                  .content { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 40px; }
                  h1 { font-size: 24px; font-weight: 600; color: #1F2937; margin: 0 0 16px 0; }
                  p { color: #6B7280; margin: 0 0 24px 0; font-size: 16px; }
                  .code-container { text-align: center; margin: 32px 0; }
                  .code { display: inline-block; background: #F3F4F6; border: 2px solid #3A4F6A; color: #3A4F6A; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px 32px; border-radius: 12px; font-family: 'Courier New', monospace; }
                  .footer { text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 14px; }
                  .security-note { background: #F3F4F6; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 14px; color: #6B7280; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">Covera</div>
                  </div>
                  <div class="content">
                    <h1>Password Reset Code</h1>
                    <p>Hi ${userName},</p>
                    <p>We received a request to reset your Covera password. Use this verification code to reset your password:</p>
                    <div class="code-container">
                      <div class="code">${verificationCode}</div>
                    </div>
                    <p style="text-align: center; color: #6B7280; font-size: 14px;">Enter this code in the Covera app to continue</p>
                    <div class="security-note">
                      <strong>🔒 Security note:</strong> This code will expire in 10 minutes. If you didn't request this password reset, you can safely ignore this email.
                    </div>
                  </div>
                  <div class="footer">
                    <p>Enterprise vendor compliance tracking</p>
                    <p>© ${new Date().getFullYear()} Covera. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
      });

      if (emailResponse.status === 429) {
        console.log(`Rate limit hit (429), retrying in ${attempt + 1}s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        attempt++;
        continue;
      }

      break;
    }

    if (!emailResponse || !emailResponse.ok) {
      const errorText = await emailResponse?.text().catch(() => 'Unknown error');
      console.error('Resend API error:', errorText);
      console.error('Resend response status:', emailResponse.status);
      return c.json({ error: `Failed to send reset email: ${errorText}` }, 500);
    }

    const emailResult = await emailResponse.json();
    console.log('Password reset email sent successfully:', emailResult);
    console.log('Email sent to:', email);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Verify code and reset password
app.post("/make-server-be7827e3/auth/verify-reset-code", async (c) => {
  try {
    const { email, code, password } = await c.req.json();
    
    if (!email || !code || !password) {
      return c.json({ error: 'Email, code, and password are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // Get reset code data
    const resetData = await kv.get(`password_reset:${email}`);
    
    if (!resetData) {
      return c.json({ error: 'Invalid or expired verification code' }, 400);
    }

    // Check if code is expired
    if (Date.now() > resetData.expiresAt) {
      await kv.del(`password_reset:${email}`);
      return c.json({ error: 'Verification code has expired' }, 400);
    }

    // Verify code matches
    if (resetData.code !== code) {
      return c.json({ error: 'Invalid verification code' }, 400);
    }

    // Update user password
    const { error } = await supabase.auth.admin.updateUserById(
      resetData.userId,
      { password }
    );

    if (error) {
      console.error('Password update error:', error);
      return c.json({ error: 'Failed to update password' }, 500);
    }

    // Delete the used code
    await kv.del(`password_reset:${email}`);

    console.log('Password reset successful for user:', resetData.userId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Helper function to create notification
async function createNotification(userId: string, notification: {
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  vendorId?: string;
  vendorName?: string;
}) {
  const notificationId = `${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
  const notificationData = {
    id: notificationId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: new Date().toISOString(),
    read: false,
    vendorId: notification.vendorId,
    vendorName: notification.vendorName,
  };
  
  await kv.set(`notification:${userId}:${notificationId}`, notificationData);
  return notificationData;
}

// Get all notifications for user
app.get("/make-server-be7827e3/notifications", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationsData = await kv.getByPrefix(`notification:${user.id}:`);
    const notifications = (notificationsData || [])
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50); // Limit to 50 most recent

    return c.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark notification as read
app.put("/make-server-be7827e3/notifications/:id/read", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    const notification = await kv.get(`notification:${user.id}:${notificationId}`);
    
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    const updatedNotification = {
      ...notification,
      read: true,
    };

    await kv.set(`notification:${user.id}:${notificationId}`, updatedNotification);

    return c.json({ success: true });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark all notifications as read
app.put("/make-server-be7827e3/notifications/mark-all-read", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationsData = await kv.getByPrefix(`notification:${user.id}:`);
    
    for (const notification of notificationsData || []) {
      const updatedNotification = {
        ...notification,
        read: true,
      };
      await kv.set(`notification:${user.id}:${notification.id}`, updatedNotification);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete notification
app.delete("/make-server-be7827e3/notifications/:id", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    await kv.del(`notification:${user.id}:${notificationId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== VENDOR ROUTES ====================

// Get all vendors
app.get("/make-server-be7827e3/vendors", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorsData = await kv.getByPrefix(`vendor:${user.id}:`);
    const vendors = vendorsData || [];

    return c.json({ vendors });
  } catch (error) {
    console.error('Get vendors error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Vendor Portal Endpoints

// Validate upload token and get vendor data
app.get("/make-server-be7827e3/vendor-portal/:token", async (c) => {
  try {
    const token = c.req.param('token');
    const tokenData = await kv.get(`upload_token:${token}`);
    
    if (!tokenData) {
      return c.json({ error: 'Invalid or expired token' }, 404);
    }
    
    // Validate token expiry (optional, say 7 days)
    const createdAt = new Date(tokenData.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays > 7) {
      return c.json({ error: 'Token expired' }, 401);
    }
    
    const { userId, vendorId } = tokenData;
    const vendor = await kv.get(`vendor:${userId}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }
    
    // Return only necessary data for the portal (public safe)
    return c.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        vendorType: vendor.vendorType,
        insuranceExpiry: vendor.insuranceExpiry,
        insurancePolicies: vendor.insurancePolicies,
        status: vendor.status,
        missingDocs: vendor.missingDocs,
        documents: vendor.documents // To show what they've already uploaded
      },
      organizationName: 'Covera Client' // You might want to fetch the user's org name
    });
  } catch (error) {
    console.error('Portal access error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update vendor info from portal
app.post("/make-server-be7827e3/vendor-portal/:token/update", async (c) => {
  try {
    const token = c.req.param('token');
    const tokenData = await kv.get(`upload_token:${token}`);
    
    if (!tokenData) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    
    const { userId, vendorId } = tokenData;
    const vendor = await kv.get(`vendor:${userId}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }
    
    const updates = await c.req.json();
    
    // Only allow updating specific fields
    const allowedFields = ['name', 'email', 'phone', 'address', 'contactName'];
    let hasUpdates = false;
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        vendor[field] = updates[field];
        hasUpdates = true;
      }
    }
    
    if (hasUpdates) {
      vendor.updatedAt = new Date().toISOString();
      await kv.set(`vendor:${userId}:${vendorId}`, vendor);
      await logActivity(userId, vendorId, 'portal_update', 'Vendor updated their information via portal', 'neutral');
    }
    
    return c.json({ success: true, vendor });
  } catch (error) {
    console.error('Portal update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload COI from portal
app.post("/make-server-be7827e3/vendor-portal/:token/upload-coi", async (c) => {
  try {
    const token = c.req.param('token');
    const tokenData = await kv.get(`upload_token:${token}`);
    
    if (!tokenData) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    
    const { userId, vendorId } = tokenData;
    const vendor = await kv.get(`vendor:${userId}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Reuse the same logic as the main upload-coi route, but authenticated via token
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only PDF, PNG, and JPG are allowed.' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    console.log(`📄 Portal COI upload for vendor ${vendorId}: ${file.name}`);

    const bucketName = 'make-92f9f116-vendor-documents';
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${vendorId}/${Date.now()}_portal_${crypto.randomUUID()}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    const document = {
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Image',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedAt: new Date().toISOString(),
      url: urlData.signedUrl,
      path: fileName,
      source: 'portal'
    };

    // AI Extraction
    let extractedData = null;
    try {
      console.log('🤖 Extracting insurance data (Portal)...');
      extractedData = await extractInsuranceDataFromDocument(fileBuffer, file.type);
    } catch (extractError) {
      console.error('Extraction failed:', extractError);
    }

    // Update vendor
    const existingDocuments = vendor.documents || [];
    vendor.documents = [...existingDocuments, document];

    if (extractedData) {
      if (extractedData.expirationDate) {
        vendor.insuranceExpiry = extractedData.expirationDate;
        vendor.nextExpiry = extractedData.expirationDate;
      }
      
      const extractedPolicies = extractedData.policies || [];
      const existingPolicies = vendor.insurancePolicies || [];
      const updatedPolicies = [...existingPolicies];
      
      for (const newPolicy of extractedPolicies) {
        const existingIndex = updatedPolicies.findIndex(
          p => p.type.toLowerCase() === newPolicy.type.toLowerCase()
        );
        
        if (existingIndex >= 0) {
          updatedPolicies[existingIndex] = {
            ...updatedPolicies[existingIndex],
            ...newPolicy,
            status: calculateVendorStatus(newPolicy.expiryDate)
          };
        } else {
          updatedPolicies.push({
            ...newPolicy,
            status: calculateVendorStatus(newPolicy.expiryDate)
          });
        }
      }
      vendor.insurancePolicies = updatedPolicies;
      
      const allExpiryDates = updatedPolicies
        .map(p => p.expiryDate)
        .filter(d => d && d !== 'Invalid Date' && d.trim() !== '');
      
      if (allExpiryDates.length > 0) {
        const earliestExpiry = allExpiryDates.reduce((earliest, current) => {
          const currentDate = new Date(current);
          const earliestDate = new Date(earliest);
          return currentDate < earliestDate ? current : earliest;
        });
        vendor.status = calculateVendorStatus(earliestExpiry);
        vendor.nextExpiry = earliestExpiry;
      }
    }

    vendor.updatedAt = new Date().toISOString();
    await kv.set(`vendor:${userId}:${vendorId}`, vendor);
    
    await logActivity(userId, vendorId, 'portal_upload', `Vendor uploaded COI via portal`, 'positive');

    return c.json({ 
      success: true, 
      message: 'Document uploaded successfully',
      extractedData,
      updatedStatus: vendor.status
    });

  } catch (error) {
    console.error('Portal upload error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload W9 from portal
app.post("/make-server-be7827e3/vendor-portal/:token/upload-w9", async (c) => {
  try {
    const token = c.req.param('token');
    const tokenData = await kv.get(`upload_token:${token}`);
    
    if (!tokenData) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    
    const { userId, vendorId } = tokenData;
    const vendor = await kv.get(`vendor:${userId}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Only allow PDF for W9 typically, but image ok too
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type.' }, 400);
    }

    const bucketName = 'make-92f9f116-vendor-documents';
    // Bucket creation check omitted for brevity, assuming exists or COI check created it

    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${vendorId}/${Date.now()}_w9_${crypto.randomUUID()}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, { contentType: file.type });

    if (uploadError) return c.json({ error: 'Failed to upload W9' }, 500);

    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000);

    const document = {
      name: file.name,
      type: 'W9',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedAt: new Date().toISOString(),
      url: urlData?.signedUrl,
      path: fileName,
      source: 'portal'
    };

    vendor.documents = [...(vendor.documents || []), document];
    vendor.w9Uploaded = true; // Flag for W9 status
    
    await kv.set(`vendor:${userId}:${vendorId}`, vendor);
    await logActivity(userId, vendorId, 'portal_upload_w9', `Vendor uploaded W9 via portal`, 'positive');

    return c.json({ success: true, message: 'W9 uploaded successfully' });
  } catch (error) {
    console.error('Portal W9 upload error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single vendor
app.get("/make-server-be7827e3/vendors/:id", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const vendor = await kv.get(`vendor:${user.id}:${vendorId}`);

    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    return c.json({ vendor });
  } catch (error) {
    console.error('Get vendor error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create vendor
app.post("/make-server-be7827e3/vendors", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check vendor limit based on plan
    const profile = await kv.get(`user:${user.id}`);
    const plan = profile?.plan || 'free';
    
    // Get existing vendors count
    const existingVendors = await kv.getByPrefix(`vendor:${user.id}:`);
    const vendorCount = existingVendors?.length || 0;
    
    // Define limits: Core/Free = 150, Enterprise = Unlimited
    const limit = (plan === 'enterprise' || plan === 'unlimited') ? Infinity : 150;
    
    if (vendorCount >= limit) {
      return c.json({ 
        error: `Vendor limit reached (${vendorCount}/${limit}). Upgrade to Enterprise for unlimited vendors.` 
      }, 403);
    }

    const vendorData = await c.req.json();
    const vendorId = `vendor_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    const status = calculateVendorStatus(vendorData.insuranceExpiry);

    const vendor = {
      id: vendorId,
      ...vendorData,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`vendor:${user.id}:${vendorId}`, vendor);
    await logActivity(user.id, vendorId, 'created', `Vendor "${vendorData.name}" was created`, 'positive');

    // Create notification for new vendor
    await createNotification(user.id, {
      type: 'success',
      title: 'New Vendor Added',
      message: `${vendorData.name} has been successfully added to your vendor list.`,
      vendorId,
      vendorName: vendorData.name,
    });

    return c.json(vendor);
  } catch (error) {
    console.error('Create vendor error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update vendor
app.put("/make-server-be7827e3/vendors/:id", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingVendor = await kv.get(`vendor:${user.id}:${vendorId}`);
    
    if (!existingVendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    const status = calculateVendorStatus(updates.insuranceExpiry || existingVendor.insuranceExpiry);

    const vendor = {
      ...existingVendor,
      ...updates,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`vendor:${user.id}:${vendorId}`, vendor);
    await logActivity(user.id, vendorId, 'updated', `Vendor details were updated`, 'neutral');

    // Create notification if status changed to at-risk or non-compliant
    const oldStatus = existingVendor.status;
    const newStatus = vendor.status;
    
    if (newStatus === 'at-risk' && oldStatus !== 'at-risk') {
      await createNotification(user.id, {
        type: 'warning',
        title: 'Vendor At Risk',
        message: `${vendor.name}'s insurance will expire within 30 days.`,
        vendorId,
        vendorName: vendor.name,
      });
    } else if (newStatus === 'non-compliant' && oldStatus !== 'non-compliant') {
      await createNotification(user.id, {
        type: 'alert',
        title: 'Vendor Non-Compliant',
        message: `${vendor.name}'s insurance has expired or is missing. Immediate action required.`,
        vendorId,
        vendorName: vendor.name,
      });
    }

    return c.json(vendor);
  } catch (error) {
    console.error('Update vendor error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete vendor
app.delete("/make-server-be7827e3/vendors/:id", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    await kv.del(`vendor:${user.id}:${vendorId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete vendor error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get vendor activities
app.get("/make-server-be7827e3/vendors/:id/activities", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const activities = await kv.getByPrefix(`activity:${user.id}:${vendorId}:`);

    return c.json({ activities: activities || [] });
  } catch (error) {
    console.error('Get activities error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Generate upload link
app.post("/make-server-be7827e3/vendors/:id/upload-link", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const uploadToken = crypto.randomUUID();
    
    // Store token temporarily (you could add expiration logic)
    await kv.set(`upload_token:${uploadToken}`, {
      vendorId,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });

    // Use origin from body if provided (from frontend), otherwise fall back to header or production domain
    const { origin } = await c.req.json().catch(() => ({ origin: null }));
    
    let baseUrl = origin || c.req.header('origin') || 'https://covera.co';

    // If we are in the Figma preview environment, force the production domain
    // This ensures generated links look professional and match the intended domain
    if (baseUrl && baseUrl.includes('figmaiframepreview.figma.site')) {
      baseUrl = 'https://covera.co';
    }

    const uploadLink = `${baseUrl}/upload/${uploadToken}`;
    
    await logActivity(user.id, vendorId, 'upload_link', 'Upload link generated', 'neutral');

    return c.json({ uploadLink });
  } catch (error) {
    console.error('Generate upload link error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all reminders
app.get("/make-server-be7827e3/reminders", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reminders = await kv.getByPrefix(`reminder:${user.id}:`);
    
    // Sort by sentAt descending (most recent first)
    const sortedReminders = (reminders || []).sort((a: any, b: any) => {
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
    });

    return c.json({ reminders: sortedReminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Send reminder
app.post("/make-server-be7827e3/vendors/:id/send-reminder", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const vendor = await kv.get(`vendor:${user.id}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    // Get user profile for organization name
    const userProfile = await kv.get(`user:${user.id}`) || {};
    const organizationName = userProfile.organizationName || userProfile.name || 'Your organization';

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let activityMessage = 'Reminder logged';
    
    if (resendApiKey) {
      try {
        // Domain verified - send emails to actual vendor contacts
        const recipientEmail = vendor.email;
        
        console.log(`📧 Sending reminder email to ${recipientEmail}`);
        
        let emailResponse;
        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
          emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Covera <noreply@covera.co>',
              to: recipientEmail,
              subject: `${organizationName} - Insurance Certificate Required`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #3A4F6A 0%, #2c3e50 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Covera</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Vendor Compliance Management</p>
                  </div>
                  
                  <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                    <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Insurance Certificate Required</h2>
                    
                    <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                      Hello,
                    </p>
                    
                    <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                      This is a reminder from <strong>${organizationName}</strong> that we need an updated Certificate of Insurance (COI) for your company, <strong>${vendor.name}</strong>.
                    </p>
                    
                    ${vendor.insuranceExpiry ? `
                      <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 16px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #c53030; margin: 0; font-weight: 500;">
                          ⚠️ Current insurance expires on ${new Date(vendor.insuranceExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    ` : `
                      <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 16px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #c53030; margin: 0; font-weight: 500;">
                          ⚠️ We don't have your insurance certificate on file
                        </p>
                      </div>
                    `}
                    
                    <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0;">
                      Please upload your Certificate of Insurance at your earliest convenience to maintain compliance and avoid any disruptions.
                    </p>
                    
                    <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                      If you have any questions or need assistance, please contact ${organizationName}.
                    </p>
                    
                    <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">
                      This is an automated reminder from Covera vendor compliance management system.
                    </p>
                  </div>
                </div>
              `,
            }),
          });

          if (emailResponse.status === 429) {
            console.log(`Rate limit hit (429), retrying in ${attempt + 1}s...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            attempt++;
            continue;
          }

          break;
        }

        if (!emailResponse || !emailResponse.ok) {
          const errorData = await emailResponse?.json().catch(() => ({}));
          console.error('Resend API error:', errorData);
          throw new Error('Failed to send email');
        }

        const emailData = await emailResponse.json();
        console.log(`✅ Reminder email sent successfully! Email ID: ${emailData.id}`);
        
        activityMessage = `Reminder email sent to ${vendor.email}`;
        
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        activityMessage = 'Reminder logged (email delivery failed - check Resend configuration)';
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured - email not sent');
      activityMessage = 'Reminder logged (email not configured)';
    }

    await logActivity(user.id, vendorId, 'reminder_sent', activityMessage, 'neutral');

    // Also store the reminder separately for the Alerts page
    const reminderId = `${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    const reminderData = {
      id: reminderId,
      vendorId: vendor.id,
      vendorName: vendor.name,
      type: 'reminder_sent',
      status: 'delivered',
      opened: false,
      sentAt: new Date().toISOString(),
      message: activityMessage,
      daysUntilExpiry: vendor.insuranceExpiry ? calculateDaysUntilExpiry(vendor.insuranceExpiry) : null
    };
    await kv.set(`reminder:${user.id}:${reminderId}`, reminderData);

    return c.json({ success: true, message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Send reminder error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload COI for vendor
app.post("/make-server-be7827e3/vendors/:id/upload-coi", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const vendor = await kv.get(`vendor:${user.id}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    // Get the uploaded file from form data
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only PDF, PNG, and JPG are allowed.' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    console.log(`📄 Processing COI upload for vendor ${vendorId}: ${file.name} (${file.type})`);

    // Create bucket name
    const bucketName = 'make-92f9f116-vendor-documents';
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${vendorId}/${Date.now()}_${crypto.randomUUID()}.${fileExtension}`;
    
    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Generate signed URL for the file (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    // Store document info in vendor record
    const document = {
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Image',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedAt: new Date().toISOString(),
      url: urlData.signedUrl,
      path: fileName,
    };

    // Extract insurance data from PDF/Image using OpenAI
    let extractedData = null;
    try {
      console.log('🤖 Extracting insurance data from document using AI...');
      extractedData = await extractInsuranceDataFromDocument(fileBuffer, file.type);
      console.log('✅ Extracted insurance data:', JSON.stringify(extractedData, null, 2));
    } catch (extractError) {
      console.error('Failed to extract insurance data:', extractError);
      // Continue without extracted data - document will still be uploaded
    }

    // Update vendor with new document
    const existingDocuments = vendor.documents || [];
    vendor.documents = [...existingDocuments, document];

    // If we successfully extracted insurance data, update vendor fields
    if (extractedData) {
      // Update insurance expiry date if found
      if (extractedData.expirationDate) {
        vendor.insuranceExpiry = extractedData.expirationDate;
        vendor.nextExpiry = extractedData.expirationDate;
      }

      // Update or add insurance policies
      const extractedPolicies = extractedData.policies || [];
      const existingPolicies = vendor.insurancePolicies || [];
      
      // Merge policies - replace existing ones of the same type
      const updatedPolicies = [...existingPolicies];
      
      for (const newPolicy of extractedPolicies) {
        const existingIndex = updatedPolicies.findIndex(
          p => p.type.toLowerCase() === newPolicy.type.toLowerCase()
        );
        
        if (existingIndex >= 0) {
          // Update existing policy
          updatedPolicies[existingIndex] = {
            ...updatedPolicies[existingIndex],
            ...newPolicy,
            status: calculateVendorStatus(newPolicy.expiryDate)
          };
        } else {
          // Add new policy
          updatedPolicies.push({
            ...newPolicy,
            status: calculateVendorStatus(newPolicy.expiryDate)
          });
        }
      }
      
      vendor.insurancePolicies = updatedPolicies;

      // Recalculate vendor status based on earliest expiration
      const allExpiryDates = updatedPolicies
        .map(p => p.expiryDate)
        .filter(d => d && d !== 'Invalid Date' && d.trim() !== '');
      
      if (allExpiryDates.length > 0) {
        // Find the earliest expiration date
        const earliestExpiry = allExpiryDates.reduce((earliest, current) => {
          const currentDate = new Date(current);
          const earliestDate = new Date(earliest);
          return currentDate < earliestDate ? current : earliest;
        });
        
        vendor.status = calculateVendorStatus(earliestExpiry);
        vendor.nextExpiry = earliestExpiry;
      }

      console.log(`📊 Updated vendor with ${extractedPolicies.length} insurance policies, status: ${vendor.status}`);
    }

    vendor.updatedAt = new Date().toISOString();
    
    await kv.set(`vendor:${user.id}:${vendorId}`, vendor);

    // Log activity
    const activityDetail = extractedData 
      ? `COI "${file.name}" uploaded and processed - ${extractedData.policies?.length || 0} policies extracted`
      : `Certificate of Insurance "${file.name}" uploaded`;
    
    await logActivity(user.id, vendorId, 'document_uploaded', activityDetail, 'positive');

    return c.json({ 
      success: true, 
      message: 'Document uploaded and processed successfully',
      document,
      extractedData,
      updatedStatus: vendor.status
    });
  } catch (error) {
    console.error('Upload COI error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Note: extractInsuranceDataFromDocument is now imported from extract_insurance.tsx

// Delete COI document
app.delete("/make-server-be7827e3/vendors/:id/delete-coi", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('id');
    const { documentPath } = await c.req.json();
    
    if (!documentPath) {
      return c.json({ error: 'Document path is required' }, 400);
    }

    const vendor = await kv.get(`vendor:${user.id}:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    console.log(`🗑️ Deleting document: ${documentPath}`);

    // Delete from Supabase Storage
    const bucketName = 'make-92f9f116-vendor-documents';
    
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([documentPath]);

    if (deleteError) {
      console.error('Storage delete error:', deleteError);
      // Continue even if storage deletion fails - remove from vendor record anyway
    }

    // Remove document from vendor record
    const existingDocuments = vendor.documents || [];
    const deletedDoc = existingDocuments.find((doc: any) => doc.path === documentPath);
    vendor.documents = existingDocuments.filter((doc: any) => doc.path !== documentPath);
    
    // If this was the last/only COI document, clear the insurance policies
    const remainingCOIs = vendor.documents.filter((doc: any) => 
      doc.type === 'PDF' || doc.type === 'COI' || doc.name.toLowerCase().includes('certificate')
    );
    
    if (remainingCOIs.length === 0) {
      // No more COI documents - clear all extracted insurance policies
      vendor.insurancePolicies = [];
      vendor.insuranceExpiry = null;
      vendor.nextExpiry = null;
      vendor.status = 'non-compliant';
      console.log('✅ Cleared all insurance policies - no more COI documents');
    }
    
    vendor.updatedAt = new Date().toISOString();
    
    await kv.set(`vendor:${user.id}:${vendorId}`, vendor);

    // Log activity
    const activityDetail = remainingCOIs.length === 0 
      ? 'Document deleted and insurance policies cleared'
      : 'Document deleted';
    await logActivity(user.id, vendorId, 'document_deleted', activityDetail, 'neutral');

    return c.json({ 
      success: true, 
      message: 'Document deleted successfully',
      policiesCleared: remainingCOIs.length === 0
    });
  } catch (error) {
    console.error('Delete COI error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analyze COI document (for modal uploads)
app.post("/make-server-be7827e3/documents/analyze-coi", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only PDF, PNG, and JPG are allowed.' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    console.log(`🔍 Analyzing COI document: ${file.name} (${file.type})`);
    
    // Convert File to ArrayBuffer for analysis
    const fileBuffer = await file.arrayBuffer();
    
    // Extract insurance data from document using OpenAI
    let extractedData = null;
    try {
      console.log('🤖 Extracting insurance data from document using AI...');
      extractedData = await extractInsuranceDataFromDocument(fileBuffer, file.type);
      console.log('✅ Extracted insurance data:', JSON.stringify(extractedData, null, 2));
    } catch (extractError) {
      console.error('Failed to extract insurance data:', extractError);
      return c.json({ error: 'Failed to analyze document' }, 500);
    }

    return c.json({ 
      success: true, 
      extractedData
    });
  } catch (error) {
    console.error('Analyze COI error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analyze contract document (for modal uploads)
app.post("/make-server-be7827e3/documents/analyze-contract", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only PDF, PNG, and JPG are allowed.' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    console.log(`🔍 Analyzing contract document: ${file.name} (${file.type})`);
    
    // Convert File to ArrayBuffer for analysis
    const fileBuffer = await file.arrayBuffer();
    
    // Extract contract data from document using OpenAI
    let extractedData = null;
    try {
      console.log('🤖 Extracting contract data from document using AI...');
      extractedData = await extractContractDataFromDocument(fileBuffer, file.type);
      console.log('✅ Extracted contract data:', JSON.stringify(extractedData, null, 2));
    } catch (extractError) {
      console.error('Failed to extract contract data:', extractError);
      return c.json({ error: 'Failed to analyze document' }, 500);
    }

    return c.json({ 
      success: true, 
      extractedData
    });
  } catch (error) {
    console.error('Analyze contract error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== INSURANCE ROUTES ====================

// Get all insurance policies
app.get("/make-server-be7827e3/insurance", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const policies = await kv.getByPrefix(`insurance:${user.id}:`);

    return c.json({ policies: policies || [] });
  } catch (error) {
    console.error('Get insurance error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create insurance policy
app.post("/make-server-be7827e3/insurance", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const policyData = await c.req.json();
    const policyId = `policy_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;

    const policy = {
      id: policyId,
      ...policyData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`insurance:${user.id}:${policyId}`, policy);

    return c.json(policy);
  } catch (error) {
    console.error('Create insurance error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== CONTRACT ROUTES ====================

// Get all contracts
app.get("/make-server-be7827e3/contracts", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contracts = await kv.getByPrefix(`contract:${user.id}:`);

    // Regenerate signed URLs for contract documents if they exist
    const contractsWithUrls = await Promise.all((contracts || []).map(async (contract) => {
      if (contract.documentPath) {
        try {
          const bucketName = 'make-92f9f116-vendor-documents';
          const { data: urlData, error: urlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(contract.documentPath, 31536000); // 1 year in seconds

          if (!urlError && urlData?.signedUrl) {
            return {
              ...contract,
              documentUrl: urlData.signedUrl
            };
          }
        } catch (err) {
          console.error('Error generating signed URL for contract:', err);
        }
      }
      return contract;
    }));

    return c.json({ contracts: contractsWithUrls || [] });
  } catch (error) {
    console.error('Get contracts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create contract
app.post("/make-server-be7827e3/contracts", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contractData = await c.req.json();
    const contractId = `contract_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;

    const contract = {
      id: contractId,
      ...contractData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`contract:${user.id}:${contractId}`, contract);

    return c.json(contract);
  } catch (error) {
    console.error('Create contract error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload contract document with file
app.post("/make-server-be7827e3/contracts/upload", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const contractDataStr = formData.get('contractData') as string;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    if (!contractDataStr) {
      return c.json({ error: 'No contract data provided' }, 400);
    }

    const contractData = JSON.parse(contractDataStr);

    console.log(`📄 Processing contract upload: ${file.name} (${file.type})`);

    // Create bucket name
    const bucketName = 'make-92f9f116-vendor-documents';
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/contracts/${Date.now()}_${crypto.randomUUID()}.${fileExtension}`;
    
    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Generate signed URL for the file (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    // Create contract with document info
    const contractId = `contract_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;
    
    const contract = {
      id: contractId,
      ...contractData,
      documentName: file.name,
      documentType: file.type.includes('pdf') ? 'PDF' : 'Image',
      documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      documentUrl: urlData.signedUrl,
      documentPath: fileName,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`contract:${user.id}:${contractId}`, contract);

    console.log(`✅ Contract uploaded successfully: ${contractId}`);

    return c.json(contract);
  } catch (error) {
    console.error('Upload contract error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload document to existing contract
app.post("/make-server-be7827e3/contracts/:id/upload-document", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const contractId = c.req.param('id');
    const contract = await kv.get(`contract:${user.id}:${contractId}`);
    
    if (!contract) {
      return c.json({ error: 'Contract not found' }, 404);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    console.log(`📄 Uploading document to existing contract: ${contractId}`);

    // Create bucket name
    const bucketName = 'make-92f9f116-vendor-documents';
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/contracts/${Date.now()}_${crypto.randomUUID()}.${fileExtension}`;
    
    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Generate signed URL for the file (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    // Update contract with document info
    const updatedContract = {
      ...contract,
      documentName: file.name,
      documentType: file.type.includes('pdf') ? 'PDF' : 'Image',
      documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      documentUrl: urlData.signedUrl,
      documentPath: fileName,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`contract:${user.id}:${contractId}`, updatedContract);

    console.log(`✅ Document uploaded to contract: ${contractId}`);

    return c.json(updatedContract);
  } catch (error) {
    console.error('Upload document to contract error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== ALERT ROUTES ====================

// Get all alerts
app.get("/make-server-be7827e3/alerts", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alerts = await kv.getByPrefix(`alert:${user.id}:`);

    return c.json({ alerts: alerts || [] });
  } catch (error) {
    console.error('Get alerts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark alert as read
app.put("/make-server-be7827e3/alerts/:id/read", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alertId = c.req.param('id');
    const alert = await kv.get(`alert:${user.id}:${alertId}`);
    
    if (!alert) {
      return c.json({ error: 'Alert not found' }, 404);
    }

    alert.read = true;
    alert.readAt = new Date().toISOString();
    
    await kv.set(`alert:${user.id}:${alertId}`, alert);

    return c.json(alert);
  } catch (error) {
    console.error('Mark alert as read error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== STRIPE SUBSCRIPTION ROUTES ====================

// Get Stripe publishable key (for frontend Stripe Elements)
app.get("/make-server-be7827e3/stripe/config", async (c) => {
  try {
    // No authentication required for public key
    const stripeMode = c.req.header('X-Stripe-Mode') || 'production';
    console.log(`Fetching Stripe config for mode: ${stripeMode}`);
    
    const { publishableKey } = getStripeKeys(stripeMode);
    
    if (!publishableKey) {
      console.error(`STRIPE_PUBLISHABLE_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe publishable key not configured' }, 500);
    }
    
    console.log(`Returning publishable key: ${publishableKey.substring(0, 20)}...`);
    return c.json({ publishableKey });
  } catch (error) {
    console.error('Get Stripe config error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create Payment Intent for embedded Stripe Elements
app.post("/make-server-be7827e3/stripe/create-payment-intent", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { plan } = await c.req.json();
    
    if (!plan) {
      return c.json({ error: 'Missing plan' }, 400);
    }

    // Get Stripe keys based on mode
    const stripeMode = c.req.header('X-Stripe-Mode') || 'production';
    const { secretKey, priceId: envPriceId } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Use environment price ID
    const finalPriceId = envPriceId;
    
    if (!finalPriceId) {
      console.error(`STRIPE_PRICE_ID not configured for ${stripeMode} mode`);
      return c.json({ error: 'Price ID not configured' }, 500);
    }

    // Get user profile
    const profile = await kv.get(`user:${user.id}`);
    const userEmail = user.email || profile?.email;
    
    // Check if we already have a customer ID for this mode
    // We only want to create a customer object in Stripe if the user actually completes the payment setup
    let customerId = null;
    
    // 1. Check active/cancelled subscription for this mode
    const existingSubscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    if (existingSubscription?.customerId) {
      customerId = existingSubscription.customerId;
    }
    // 2. Check profile if it matches the current mode (legacy support)
    else if (profile?.stripeCustomerId && profile?.stripeMode === stripeMode) {
      customerId = profile.stripeCustomerId;
    }

    // Only get/create customer if we found one, otherwise we wait until verification
    // const customerId = await getOrCreateStripeCustomer(secretKey, userEmail, user.id, stripeMode);

    // Step 1: Create a SetupIntent to collect the payment method
    const setupIntentParams: any = {
      'payment_method_types[]': 'card',
    };
    
    if (customerId) {
      setupIntentParams.customer = customerId;
    }

    const setupIntentResponse = await fetch('https://api.stripe.com/v1/setup_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(setupIntentParams),
    });

    if (!setupIntentResponse.ok) {
      const errorText = await setupIntentResponse.text();
      console.error('Stripe setup intent error:', errorText);
      return c.json({ error: 'Failed to create setup intent' }, 500);
    }

    const setupIntent = await setupIntentResponse.json();

    // Store pending subscription info (we'll create the actual subscription after payment method is confirmed)
    await kv.set(`pending_subscription:${user.id}:${stripeMode}`, {
      setupIntentId: setupIntent.id,
      customerId: customerId,
      priceId: finalPriceId,
      plan,
      createdAt: new Date().toISOString(),
      stripeMode,
    });

    return c.json({ 
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Verify payment intent and activate subscription
app.post("/make-server-be7827e3/stripe/verify-payment-intent", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const setupIntentId = body.setupIntentId || body.paymentIntentId;
    
    if (!setupIntentId) {
      return c.json({ error: 'Missing setupIntentId or paymentIntentId' }, 400);
    }

    console.log('Verifying setup intent:', setupIntentId);

    // Get Stripe keys based on mode
    const stripeMode = c.req.header('X-Stripe-Mode') || 'production';
    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Retrieve setup intent from Stripe (we're using setupIntent, not paymentIntent for trials)
    const setupIntentResponse = await fetch(
      `https://api.stripe.com/v1/setup_intents/${setupIntentId}`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      }
    );

    if (!setupIntentResponse.ok) {
      console.error('Error retrieving setup intent from Stripe:', await setupIntentResponse.text());
      return c.json({ error: 'Failed to verify payment method' }, 500);
    }

    const setupIntent = await setupIntentResponse.json();
    console.log('Setup intent status:', setupIntent.status);
    
    if (setupIntent.status === 'succeeded') {
      // Get pending subscription info
      const pendingSubscription = await kv.get(`pending_subscription:${user.id}:${stripeMode}`);
      
      if (!pendingSubscription) {
        return c.json({ error: 'Subscription not found' }, 404);
      }

      let customerId = pendingSubscription.customerId;

      // If we deferred customer creation (to avoid empty customers), create one now
      if (!customerId) {
        console.log('Creating customer for verified payment method...');
        const profile = await kv.get(`user:${user.id}`);
        const userEmail = user.email || profile?.email;
        
        // This will create a new customer since one wasn't found in KV earlier
        try {
          customerId = await getOrCreateStripeCustomer(secretKey, userEmail, user.id, stripeMode);
          console.log('Created new Stripe customer:', customerId);
        } catch (err) {
          console.error('Failed to create Stripe customer:', err);
          return c.json({ error: 'Failed to create customer record' }, 500);
        }
        
        if (customerId && setupIntent.payment_method) {
          console.log(`Attaching payment method ${setupIntent.payment_method} to customer ${customerId}...`);
          
          // Attach the payment method to the new customer
          const attachResponse = await fetch(`https://api.stripe.com/v1/payment_methods/${setupIntent.payment_method}/attach`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'customer': customerId,
            }),
          });
          
          if (!attachResponse.ok) {
            const attachError = await attachResponse.text();
            console.error('Failed to attach payment method:', attachError);
            return c.json({ error: `Failed to attach payment method: ${attachError}` }, 500);
          }
          console.log('Payment method attached successfully');
          
          // Set as default payment method for the customer's future invoices
          const updateCustomerResponse = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'invoice_settings[default_payment_method]': setupIntent.payment_method,
            }),
          });

          if (!updateCustomerResponse.ok) {
             const updateError = await updateCustomerResponse.text();
             console.error('Failed to set default payment method:', updateError);
             // Proceed anyway as we explicitly set default_payment_method in subscription creation
          } else {
             console.log('Default payment method set successfully');
          }
        } else {
          console.error('Missing customerId or payment_method for attachment');
          if (!setupIntent.payment_method) {
             return c.json({ error: 'No payment method found in SetupIntent' }, 400);
          }
        }
      }

      // Now create the actual subscription with the confirmed payment method and 7-day trial
      const subscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'customer': customerId,
          'items[0][price]': pendingSubscription.priceId,
          'default_payment_method': setupIntent.payment_method,
          'trial_period_days': '7',
        }),
      });

      if (!subscriptionResponse.ok) {
        const errorText = await subscriptionResponse.text();
        console.error('Stripe subscription error:', errorText);
        return c.json({ error: 'Failed to create subscription' }, 500);
      }

      const subscription = await subscriptionResponse.json();

      // Store mode-specific subscription info
      await kv.set(`subscription:${user.id}:${stripeMode}`, {
        plan: pendingSubscription.plan,
        customerId: customerId,
        subscriptionId: subscription.id,
        status: subscription.status, // Will be "trialing" during trial period
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        updatedAt: new Date().toISOString(),
        stripeMode,
      });

      // Update user profile with active subscription (for backward compatibility)
      const profile = await kv.get(`user:${user.id}`) || {};
      profile.plan = pendingSubscription.plan;
      profile.stripeCustomerId = customerId;
      profile.stripeSubscriptionId = subscription.id;
      profile.subscriptionStatus = subscription.status === 'trialing' ? 'active' : subscription.status; // Treat trialing as active
      profile.subscriptionUpdatedAt = new Date().toISOString();
      profile.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      profile.trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;
      profile.stripeMode = stripeMode;
      
      await kv.set(`user:${user.id}`, profile);
      
      // Clean up pending subscription
      await kv.del(`pending_subscription:${user.id}:${stripeMode}`);
      
      console.log(`✅ Subscription with 7-day trial activated for user ${user.id}, plan: ${pendingSubscription.plan}, mode: ${stripeMode}, trial ends: ${profile.trialEnd}`);
      
      return c.json({
        success: true,
        plan: pendingSubscription.plan,
        status: 'active',
        subscriptionStatus: subscription.status,
        trialEnd: profile.trialEnd
      });
    } else {
      return c.json({
        success: false,
        status: setupIntent.status
      });
    }
  } catch (error) {
    console.error('Verify payment intent error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create Stripe checkout session
app.post("/make-server-be7827e3/stripe/create-checkout-session", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { plan } = await c.req.json();
    
    if (!plan) {
      return c.json({ error: 'Missing plan' }, 400);
    }

    // Get Stripe keys based on mode
    const stripeMode = c.req.header('X-Stripe-Mode') || 'production';
    const { secretKey, priceId: envPriceId } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Use environment price ID
    const finalPriceId = envPriceId;
    
    if (!finalPriceId) {
      console.error(`STRIPE_PRICE_ID not configured for ${stripeMode} mode`);
      return c.json({ error: 'Price ID not configured' }, 500);
    }

    // Get user profile
    const profile = await kv.get(`user:${user.id}`);
    const userEmail = user.email || profile?.email;

    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'payment_method_types[]': 'card',
        'line_items[0][price]': finalPriceId,
        'line_items[0][quantity]': '1',
        'subscription_data[trial_period_days]': '7',
        'success_url': `${c.req.header('origin') || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${c.req.header('origin') || 'http://localhost:5173'}/#pricing`,
        'customer_email': userEmail,
        'client_reference_id': user.id,
        'metadata[userId]': user.id,
        'metadata[plan]': plan,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe checkout session creation error:', errorText);
      return c.json({ error: 'Failed to create checkout session' }, 500);
    }

    const session = await response.json();
    
    return c.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Verify checkout session and update subscription
app.post("/make-server-be7827e3/stripe/verify-session", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { sessionId } = await c.req.json();
    
    if (!sessionId) {
      return c.json({ error: 'Missing sessionId' }, 400);
    }

    // Get Stripe keys based on mode
    const stripeMode = c.req.header('X-Stripe-Mode') || 'production';
    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Retrieve the checkout session from Stripe
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe session retrieval error:', errorText);
      return c.json({ error: 'Failed to retrieve session' }, 500);
    }

    const session = await response.json();
    
    // Check if payment was successful
    if (session.payment_status === 'paid') {
      const plan = session.metadata?.plan || 'core';
      
      // Fetch the actual subscription to get correct trial/billing dates
      const subscriptionResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${session.subscription}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      let currentPeriodEnd = session.current_period_end;
      let subscriptionStatus = 'active';
      
      if (subscriptionResponse.ok) {
        const subscription = await subscriptionResponse.json();
        // Use the subscription's current_period_end (which includes trial period)
        currentPeriodEnd = subscription.current_period_end;
        subscriptionStatus = subscription.status;
        console.log(`Subscription details - status: ${subscription.status}, trial_end: ${subscription.trial_end}, current_period_end: ${subscription.current_period_end}`);
      }
      
      // Update user's subscription in KV store
      const profile = await kv.get(`user:${user.id}`) || {};
      profile.plan = plan;
      profile.stripeCustomerId = session.customer;
      profile.stripeSubscriptionId = session.subscription;
      profile.subscriptionStatus = subscriptionStatus;
      profile.subscriptionUpdatedAt = new Date().toISOString();
      profile.currentPeriodEnd = new Date(currentPeriodEnd * 1000).toISOString();
      
      await kv.set(`user:${user.id}`, profile);
      
      console.log(`Subscription activated for user ${user.id}, plan: ${plan}`);
      
      return c.json({
        success: true,
        plan,
        status: 'active'
      });
    } else {
      return c.json({
        success: false,
        status: session.payment_status
      });
    }
  } catch (error) {
    console.error('Verify session error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get subscription status
app.get("/make-server-be7827e3/stripe/subscription-status", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Special handling for Demo Account
    if (user.email === 'demo@covera.co') {
      console.log('🌟 Serving Demo Account subscription status');
      return c.json({
        plan: 'core',
        subscriptionStatus: 'active',
        stripeCustomerId: 'cus_demo123456',
        stripeSubscriptionId: 'sub_demo123456',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        subscriptionCancelAtPeriodEnd: false,
      });
    }

    const profile = await kv.get(`user:${user.id}`);
    const stripeMode = profile?.stripeMode || c.req.header('X-Stripe-Mode') || 'production';
    
    // Try to get mode-specific subscription first
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    
    // Return mode-specific data if available, otherwise fall back to profile
    if (subscription) {
      return c.json({
        plan: subscription.plan,
        subscriptionStatus: subscription.status === 'trialing' ? 'active' : subscription.status, // Treat trialing as active
        stripeCustomerId: subscription.customerId,
        stripeSubscriptionId: subscription.subscriptionId,
        currentPeriodEnd: subscription.currentPeriodEnd,
        subscriptionCancelAtPeriodEnd: subscription.cancelAtPeriodEnd || profile?.subscriptionCancelAtPeriodEnd || false,
      });
    }
    
    return c.json({
      plan: profile?.plan || 'free',
      subscriptionStatus: profile?.subscriptionStatus || 'inactive',
      stripeCustomerId: profile?.stripeCustomerId,
      stripeSubscriptionId: profile?.stripeSubscriptionId,
      currentPeriodEnd: profile?.currentPeriodEnd,
      subscriptionCancelAtPeriodEnd: profile?.subscriptionCancelAtPeriodEnd || false,
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get payment method
app.get("/make-server-be7827e3/stripe/payment-method", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Special handling for Demo Account
    if (user.email === 'demo@covera.co') {
      return c.json({
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2030,
      });
    }

    const profile = await kv.get(`user:${user.id}`);
    
    // Auto-detect which Stripe mode is actually configured
    const detectedMode = detectStripeMode();
    if (!detectedMode) {
      console.log('No Stripe keys configured - payment method unavailable');
      return c.json(null);
    }
    
    // Use the detected mode or fall back to header or saved mode
    const stripeMode = c.req.header('X-Stripe-Mode') || detectedMode;
    console.log(`🔍 Payment method lookup: detectedMode=${detectedMode}, using=${stripeMode}`);
    
    // Try to get customer ID from mode-specific subscription first
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    const customerId = subscription?.customerId || profile?.stripeCustomerId;
    
    if (!customerId) {
      console.log(`No customer ID found for mode: ${stripeMode}`);
      return c.json(null);
    }

    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    console.log(`🔑 Fetching payment methods for customer ${customerId} in ${stripeMode} mode`);

    // Fetch payment methods from Stripe
    const response = await fetch(
      `https://api.stripe.com/v1/customers/${customerId}/payment_methods?type=card&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching payment methods from Stripe:', errorText);
      return c.json(null);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return c.json(null);
    }

    const paymentMethod = data.data[0];
    
    return c.json({
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      exp_month: paymentMethod.card.exp_month,
      exp_year: paymentMethod.card.exp_year,
    });
  } catch (error) {
    console.error('Get payment method error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create SetupIntent for updating payment method
app.post("/make-server-be7827e3/stripe/update-payment-method", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    const detectedMode = detectStripeMode();
    if (!detectedMode) {
      console.log('No Stripe keys configured');
      return c.json({ error: 'Stripe not configured' }, 500);
    }
    
    const stripeMode = c.req.header('X-Stripe-Mode') || detectedMode;
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    const customerId = subscription?.customerId || profile?.stripeCustomerId;
    
    if (!customerId) {
      return c.json({ error: 'No customer found' }, 400);
    }

    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    const setupIntentResponse = await fetch('https://api.stripe.com/v1/setup_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
        'payment_method_types[]': 'card',
      }).toString(),
    });

    if (!setupIntentResponse.ok) {
      const errorText = await setupIntentResponse.text();
      console.error('Stripe setup intent error:', errorText);
      return c.json({ error: 'Failed to create setup intent' }, 500);
    }

    const setupIntent = await setupIntentResponse.json();

    return c.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Confirm payment method update
app.post("/make-server-be7827e3/stripe/confirm-payment-method-update", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { setupIntentId } = await c.req.json();

    if (!setupIntentId) {
      return c.json({ error: 'Setup intent ID is required' }, 400);
    }

    const profile = await kv.get(`user:${user.id}`);
    const detectedMode = detectStripeMode();
    if (!detectedMode) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }
    
    const stripeMode = c.req.header('X-Stripe-Mode') || detectedMode;
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    const customerId = subscription?.customerId || profile?.stripeCustomerId;

    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    const setupIntentResponse = await fetch(
      `https://api.stripe.com/v1/setup_intents/${setupIntentId}`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      }
    );

    if (!setupIntentResponse.ok) {
      console.error('Error retrieving setup intent:', await setupIntentResponse.text());
      return c.json({ error: 'Failed to verify payment method' }, 500);
    }

    const setupIntent = await setupIntentResponse.json();

    if (setupIntent.status !== 'succeeded') {
      return c.json({ error: 'Payment method verification failed' }, 400);
    }

    const paymentMethodId = setupIntent.payment_method;

    const updateCustomerResponse = await fetch(
      `https://api.stripe.com/v1/customers/${customerId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'invoice_settings[default_payment_method]': paymentMethodId,
        }).toString(),
      }
    );

    if (!updateCustomerResponse.ok) {
      console.error('Error updating customer payment method:', await updateCustomerResponse.text());
      return c.json({ error: 'Failed to update payment method' }, 500);
    }

    if (subscription?.subscriptionId) {
      await fetch(
        `https://api.stripe.com/v1/subscriptions/${subscription.subscriptionId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'default_payment_method': paymentMethodId,
          }).toString(),
        }
      );
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Confirm payment method update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get invoices
app.get("/make-server-be7827e3/stripe/invoices", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    // Auto-detect which Stripe mode is actually configured
    const detectedMode = detectStripeMode();
    if (!detectedMode) {
      console.log('No Stripe keys configured - invoices unavailable');
      return c.json([]);
    }
    
    // Use the detected mode or fall back to header or saved mode
    const stripeMode = c.req.header('X-Stripe-Mode') || detectedMode;
    console.log(`🔍 Invoices lookup: detectedMode=${detectedMode}, using=${stripeMode}`);
    
    // Try to get customer ID from mode-specific subscription first
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    const customerId = subscription?.customerId || profile?.stripeCustomerId;
    
    if (!customerId) {
      console.log(`No customer ID found for mode: ${stripeMode}`);
      return c.json([]);
    }

    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    console.log(`🧾 Fetching invoices for customer ${customerId} in ${stripeMode} mode`);

    // Fetch invoices from Stripe
    const response = await fetch(
      `https://api.stripe.com/v1/invoices?customer=${customerId}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching invoices from Stripe:', errorText);
      return c.json([]);
    }

    const data = await response.json();
    
    const invoices = data.data.map((invoice: any) => {
      const date = new Date(invoice.created * 1000);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: invoice.lines.data[0]?.description || 'Core Plan - Monthly',
        amount: `$${(invoice.amount_paid / 100).toFixed(2)}`,
        status: invoice.status === 'paid' ? 'Paid' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
        pdf: invoice.invoice_pdf,
      };
    });
    
    return c.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Cancel subscription
app.post("/make-server-be7827e3/stripe/cancel-subscription", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    const detectedMode = detectStripeMode();
    if (!detectedMode) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }
    
    const stripeMode = c.req.header('X-Stripe-Mode') || detectedMode;
    const subscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    const subscriptionId = subscription?.subscriptionId || profile?.stripeSubscriptionId;
    
    if (!subscriptionId) {
      return c.json({ error: 'No active subscription found' }, 400);
    }

    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    console.log(`Cancelling subscription ${subscriptionId}`);

    const cancelResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'cancel_at_period_end': 'true',
        }).toString(),
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error('Error cancelling subscription:', errorText);
      return c.json({ error: 'Failed to cancel subscription' }, 500);
    }

    const cancelledSubscription = await cancelResponse.json();

    if (subscription) {
      subscription.cancelAtPeriodEnd = true;
      subscription.cancelledAt = new Date().toISOString();
      await kv.set(`subscription:${user.id}:${stripeMode}`, subscription);
    }

    if (profile) {
      profile.subscriptionCancelAtPeriodEnd = true;
      await kv.set(`user:${user.id}`, profile);
    }

    return c.json({ 
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: new Date(cancelledSubscription.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// TESTING ONLY: Reset subscription to free (remove in production)
app.post("/make-server-92f9f116/stripe/reset-subscription", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`) || {};
    profile.plan = 'free';
    profile.subscriptionStatus = 'inactive';
    delete profile.stripeCustomerId;
    delete profile.stripeSubscriptionId;
    profile.subscriptionUpdatedAt = new Date().toISOString();
    
    await kv.set(`user:${user.id}`, profile);
    
    console.log(`Subscription reset to free for user ${user.id}`);
    
    return c.json({
      success: true,
      plan: 'free',
      subscriptionStatus: 'inactive'
    });
  } catch (error) {
    console.error('Reset subscription error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Refresh subscription from Stripe (sync current subscription data)
app.post("/make-server-be7827e3/stripe/refresh-subscription", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`) || {};
    const stripeMode = profile?.stripeMode || c.req.header('X-Stripe-Mode') || 'production';
    
    if (!profile.stripeSubscriptionId) {
      return c.json({ error: 'No subscription found' }, 404);
    }

    // Get Stripe keys
    const { secretKey } = getStripeKeys(stripeMode);
    
    if (!secretKey) {
      console.error(`STRIPE_SECRET_KEY not configured for ${stripeMode} mode`);
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Fetch the latest subscription data from Stripe
    const subscriptionResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${profile.stripeSubscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      console.error('Stripe subscription fetch error:', errorText);
      return c.json({ error: 'Failed to fetch subscription from Stripe' }, 500);
    }

    const subscription = await subscriptionResponse.json();
    
    // Update profile with latest data from Stripe
    profile.subscriptionStatus = subscription.status;
    profile.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    profile.subscriptionCancelAtPeriodEnd = subscription.cancel_at_period_end;
    profile.subscriptionUpdatedAt = new Date().toISOString();
    
    await kv.set(`user:${user.id}`, profile);
    
    // Also update mode-specific subscription if it exists
    const modeSubscription = await kv.get(`subscription:${user.id}:${stripeMode}`);
    if (modeSubscription) {
      modeSubscription.status = subscription.status;
      modeSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      modeSubscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      await kv.set(`subscription:${user.id}:${stripeMode}`, modeSubscription);
    }
    
    console.log(`Subscription refreshed for user ${user.id} - status: ${subscription.status}, current_period_end: ${new Date(subscription.current_period_end * 1000).toISOString()}`);
    
    return c.json({
      success: true,
      plan: profile.plan,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Refresh subscription error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Contact sales endpoint
app.post("/make-server-be7827e3/contact-sales", async (c) => {
  try {
    console.log('📧 Contact sales endpoint called');
    
    const requestBody = await c.req.json();
    console.log('Request body received:', { ...requestBody, message: requestBody.message ? '(message provided)' : '(no message)' });
    
    const { name, email, company, message } = requestBody;
    
    let userName = name;
    let userEmail = email;
    let organizationName = company;

    // If no direct input provided, check if user is authenticated
    if (!name || !email || !company) {
      console.log('Missing fields, checking authentication...');
      const { user, error } = await verifyUser(c.req.header('Authorization'));
      
      if (error || !user) {
        console.error('Authentication failed and fields missing:', { name, email, company });
        return c.json({ error: 'Please provide name, email, and company information' }, 400);
      }

      // Get user profile for name and email
      const profile = await kv.get(`user:${user.id}`) || {};
      userName = name || profile.name || profile.email || 'Unknown User';
      userEmail = email || profile.email || 'No email provided';
      organizationName = company || profile.organizationName || 'No organization';
    }

    console.log('Prepared contact info:', { userName, userEmail, organizationName });

    // Store inquiry in database
    const inquiryId = `contact-sales:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(inquiryId, {
      name: userName,
      email: userEmail,
      company: organizationName,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'new'
    });

    console.log('✅ Contact sales inquiry saved:', inquiryId);

    // Send email notification to sales team
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    // Try to send email, but don't fail if it doesn't work
    if (resendApiKey) {
      try {
        console.log('RESEND_API_KEY exists, attempting to send email...');

        // Send email to sales team
        let emailResponse;
        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
          emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Covera <noreply@getcovera.co>',
              to: ['or@getcovera.co'],
              subject: `Enterprise Inquiry from ${userName}`,
              html: `
                <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #3A4F6A 0%, #2C3E50 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">New Enterprise Inquiry</h1>
                  </div>
                  
                  <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                    <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 24px; font-size: 20px;">Contact Information</h2>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                      <div style="margin-bottom: 12px;">
                        <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</strong>
                        <div style="color: #1f2937; font-size: 16px; margin-top: 4px;">${userName}</div>
                      </div>
                      
                      <div style="margin-bottom: 12px;">
                        <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                        <div style="color: #1f2937; font-size: 16px; margin-top: 4px;">
                          <a href="mailto:${userEmail}" style="color: #3b82f6; text-decoration: none;">${userEmail}</a>
                        </div>
                      </div>
                      
                      <div>
                        <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Organization</strong>
                        <div style="color: #1f2937; font-size: 16px; margin-top: 4px;">${organizationName}</div>
                      </div>
                    </div>
                    
                    ${message ? `
                    <div>
                      <h3 style="color: #1f2937; margin-bottom: 12px; font-size: 16px;">Message</h3>
                      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; color: #4b5563; line-height: 1.6;">
                        ${message}
                      </div>
                    </div>
                    ` : ''}
                    
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        This inquiry was submitted from the Covera platform.
                      </p>
                    </div>
                  </div>
                </div>
              `,
            }),
          });

          if (emailResponse.status === 429) {
            console.log(`Rate limit hit (429), retrying in ${attempt + 1}s...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            attempt++;
            continue;
          }

          break;
        }

        console.log('Email API response status:', emailResponse ? emailResponse.status : 'No response');

        if (!emailResponse || !emailResponse.ok) {
          const errorData = await emailResponse?.json().catch(() => ({}));
          console.error('❌ Resend API error:', errorData);
          // Don't fail the request - inquiry is already saved
          console.log('Email failed but inquiry is saved in database');
        } else {
          const emailData = await emailResponse.json();
          console.log(`✅ Sales inquiry email sent from ${userName} (${userEmail})`);
          console.log('Email data:', emailData);
        }
      } catch (emailError) {
        console.error('Email sending error (non-fatal):', emailError);
        // Don't fail the request - inquiry is already saved
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured - inquiry saved but email not sent');
    }
    
    return c.json({ 
      success: true,
      message: 'Your inquiry has been received! Our sales team will contact you within 1 business day.'
    });
  } catch (error) {
    console.error('Contact sales error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== BACKEND INTEGRATION ====================

Deno.serve(app.fetch);
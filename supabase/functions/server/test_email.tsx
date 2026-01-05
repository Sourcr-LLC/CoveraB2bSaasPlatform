// Test email handler - separated for easy deployment
export async function handleTestEmail(c: any, verifyUser: any, kv: any) {
  console.log('📧 Test email endpoint called');
  
  try {
    const { user, error } = await verifyUser(c.req.header('Authorization'));
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { testEmail } = await c.req.json();
    
    if (!testEmail || !testEmail.includes('@')) {
      return c.json({ error: 'Valid test email address required' }, 400);
    }

    const userProfile = await kv.get(`user:${user.id}`) || {};
    const organizationName = userProfile.organizationName || userProfile.name || 'Your organization';

    // Sample vendor data for testing
    const sampleVendor = {
      name: 'Sample Vendor Co.',
      email: testEmail,
      insuranceExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      return c.json({ error: 'RESEND_API_KEY not configured' }, 500);
    }

    console.log(`📧 Sending TEST reminder email to ${testEmail}`);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Covera <noreply@getcovera.co>',
        to: testEmail,
        subject: `[TEST] ${organizationName} - Insurance Certificate Required`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3A4F6A 0%, #2c3e50 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Covera</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Vendor Compliance Management</p>
            </div>
            
            <div style="background: #fef3c7; padding: 12px 20px; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">🧪 TEST EMAIL - This is a preview of how reminder emails will look</p>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Insurance Certificate Required</h2>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                Hello,
              </p>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                This is a reminder from <strong>${organizationName}</strong> that we need an updated Certificate of Insurance (COI) for your company, <strong>${sampleVendor.name}</strong>.
              </p>
              
              <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #c53030; margin: 0; font-weight: 500;">
                  ⚠️ Current insurance expires on ${new Date(sampleVendor.insuranceExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
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

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Resend API error:', errorData);
      return c.json({ 
        error: 'Failed to send test email', 
        details: errorData 
      }, 500);
    }

    const emailData = await emailResponse.json();
    console.log(`✅ Test email sent successfully! Email ID: ${emailData.id}`);
    
    return c.json({ 
      success: true, 
      message: `Test email sent to ${testEmail}`,
      emailId: emailData.id
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
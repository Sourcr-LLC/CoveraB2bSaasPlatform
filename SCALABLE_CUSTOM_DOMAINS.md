# Scalable Custom Domains for Multi-Tenant SaaS

## The Problem

Your customers (organizations using Covera) want to use their own domains (e.g., `portal.acme.com`) for vendor portals. They don't have access to your Netlify deployment, so the solution must be **fully automated** and **scalable**.

## Architecture Overview

```
Customer Domain (portal.acme.com)
        ↓
   DNS CNAME → proxy.covera.co
        ↓
   Cloudflare Worker/Proxy
        ↓
   Lookup organization by domain
        ↓
   Proxy to main app with org context
        ↓
   covera.co (main app)
```

## Solution Options

### ✅ Option 1: Cloudflare Workers + Wildcard SSL (Recommended)

**Pros:**
- Automatic SSL for all custom domains
- Edge caching & performance
- Simple to implement
- Cost-effective ($5-25/month)

**Setup:**
1. Point `*.proxy.covera.co` to Cloudflare Workers
2. Deploy the worker in `/cloudflare-worker-proxy.js`
3. Customers point their domain to `proxy.covera.co` via CNAME
4. Worker inspects Host header and routes to correct organization

**Customer Instructions:**
```
Add CNAME record:
Name: portal (or your subdomain)
Value: proxy.covera.co
```

**Files Added:**
- `/cloudflare-worker-proxy.js` - Worker that handles routing
- Backend endpoint: `/public/domain-lookup/:domain` - Returns org info

---

### Option 2: Netlify's Multi-Domain Support

**Pros:**
- No additional service needed
- SSL handled automatically

**Cons:**
- Requires Netlify Pro plan ($19/month base + $7/domain)
- May not scale cost-effectively for 100+ customers

**Setup:**
Use Netlify's API to programmatically add domains:

```javascript
// Add domain via Netlify API
async function addDomainToNetlify(customDomain) {
  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${SITE_ID}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain_name: customDomain }),
    }
  );
  return response.json();
}
```

---

### Option 3: Reverse Proxy (Nginx/Caddy)

**Pros:**
- Full control
- Can handle complex routing

**Cons:**
- Need to manage server infrastructure
- Manual SSL certificate management (unless using Caddy)

---

### ✅ Option 4: Vercel Edge Middleware (Alternative to Cloudflare)

If you deploy to Vercel instead of Netlify:

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // If it's not the main domain, it's a custom domain
  if (!hostname.includes('covera.co')) {
    // Clone the request and add org context headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-custom-domain', hostname);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}
```

---

## Implementation (Cloudflare Workers)

### Step 1: Deploy Cloudflare Worker

1. **Sign up for Cloudflare Workers** (free tier: 100k requests/day)

2. **Deploy the worker:**
```bash
npm install -g wrangler
wrangler login
wrangler publish cloudflare-worker-proxy.js
```

3. **Add route:**
   - Go to Cloudflare Dashboard → Workers
   - Add route: `proxy.covera.co/*` → your worker
   - Or use custom domains: `*.proxy.covera.co/*`

### Step 2: Update Backend

The backend endpoint is already added:
- `GET /make-server-be7827e3/public/domain-lookup/:domain`
- Returns: `{ userId, organizationName, logoUrl, verified }`

### Step 3: Update Frontend

The VendorPortal already reads organization data from the token. No changes needed for basic functionality. If you want to show the custom domain's branding:

```typescript
// In VendorPortal.tsx, detect if we're on a custom domain
useEffect(() => {
  const hostname = window.location.hostname;
  if (hostname !== 'covera.co' && hostname !== 'www.covera.co') {
    // This is a custom domain - you could fetch additional branding
    // Or it's already included in the vendor data from the backend
  }
}, []);
```

### Step 4: Customer Onboarding

**When a customer configures their domain in Settings:**

1. Customer enters `portal.acme.com` in Settings
2. System shows DNS instructions:
   ```
   Type: CNAME
   Name: portal
   Value: proxy.covera.co
   TTL: 3600
   ```
3. Backend stores domain in KV:
   - `domain:${userId}` → `{ domain: "portal.acme.com", status: "pending" }`
   - `domain_owner:portal.acme.com` → `userId`

4. Customer clicks "Verify Domain"
5. Backend checks DNS and marks as verified

6. Done! `portal.acme.com/upload/{token}` now works

---

## DNS Verification

The backend already includes DNS verification using Cloudflare DNS-over-HTTPS:

```typescript
const dohResponse = await fetch(
  `https://cloudflare-dns.com/dns-query?name=${domain}&type=CNAME`,
  { headers: { 'Accept': 'application/dns-json' } }
);
```

This checks that the customer has correctly configured their CNAME record.

---

## SSL Certificate Handling

### With Cloudflare Workers:
- **Automatic!** Cloudflare provides SSL for all custom domains
- Uses Cloudflare's Universal SSL
- No configuration needed

### With Netlify:
- Netlify automatically provisions Let's Encrypt certificates
- Takes 1-2 minutes after domain is added
- Renewed automatically

---

## Cost Analysis

### Cloudflare Workers (Recommended)
- **Free tier:** 100,000 requests/day
- **Paid plan:** $5/month for 10M requests
- **SSL:** Included (free)
- **Per-customer cost:** $0

### Netlify
- **Free tier:** 1 custom domain
- **Pro plan:** $19/month + $7/additional domain
- **100 customers:** ~$719/month

### Self-hosted Proxy
- **Server:** $10-50/month (DigitalOcean, AWS)
- **SSL:** Free (Let's Encrypt)
- **Maintenance:** Time/complexity

**Winner:** Cloudflare Workers (by far!)

---

## Testing

### Local Testing
You can't test custom domains locally, but you can test the routing logic:

```bash
# Simulate custom domain with Host header
curl -H "Host: portal.acme.com" http://localhost:3000/upload/test-token
```

### Production Testing
1. Add a test domain like `test.yourdomain.com`
2. Point it to `proxy.covera.co`
3. Configure it in Covera Settings
4. Test upload flow

---

## Security Considerations

1. **Domain Verification Required**
   - Never serve content for unverified domains
   - Check `domain:${userId}` has `status: "verified"`

2. **Prevent Domain Hijacking**
   - Store `domain_owner:${domain}` → `userId`
   - Prevent multiple users from claiming same domain

3. **Rate Limiting**
   - Cloudflare provides DDoS protection
   - Consider rate limiting the domain lookup endpoint

4. **HTTPS Only**
   - Always redirect HTTP → HTTPS
   - Cloudflare handles this automatically

---

## Updated Customer Instructions

Update the Settings UI to show:

```markdown
### Step 1: Configure DNS
Add a CNAME record in your DNS provider:

Type: CNAME
Name: portal (or your subdomain)
Value: proxy.covera.co
TTL: 3600 (or default)

### Step 2: Verify
Wait 5-10 minutes for DNS propagation, then click "Verify Domain"

### Step 3: Done!
Your vendor portal will be accessible at portal.yourcompany.com
```

---

## Migration Path

### Current State
- Code generates custom domain links
- But they don't work (404 on Netlify)

### After Cloudflare Worker Deployment
1. Deploy worker to Cloudflare
2. Set up `proxy.covera.co` pointing to worker
3. Update Settings UI with new instructions (proxy.covera.co instead of alias.netlify.app)
4. All existing customer domains will work once they update their CNAME

---

## Summary

**The Fix:**
- Deploy Cloudflare Worker (`/cloudflare-worker-proxy.js`)
- Route `proxy.covera.co` to the worker
- Update DNS instructions in Settings to point to `proxy.covera.co`
- Backend endpoint `/public/domain-lookup/:domain` is ready

**Customer Experience:**
1. Enter domain in Covera Settings
2. Add CNAME: `portal` → `proxy.covera.co`
3. Click "Verify"
4. Domain works immediately!

**Cost:** $0-5/month (Cloudflare Workers free tier is generous)

**Scalability:** Handles millions of requests, unlimited custom domains

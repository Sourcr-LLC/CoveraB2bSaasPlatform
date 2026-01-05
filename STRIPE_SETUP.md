# Stripe Integration Setup Guide

## ✅ Complete - No Webhooks Required!

This integration uses a simple Stripe Checkout flow without webhooks. Users upgrade from the Settings page and subscription status is verified when they return.

## What You've Already Provided

✅ **STRIPE_SECRET_KEY** - Your Stripe secret key
✅ **STRIPE_PRICE_ID_CORE** - Your Core plan price ID

## How It Works

### 1. User Flow
1. User navigates to **Settings** page (when logged in)
2. Current plan shows as "Free" with "Inactive" status
3. User clicks **"Upgrade to Core Plan"**
4. Redirected to Stripe Checkout page (hosted by Stripe)
5. Completes payment securely on Stripe
6. Redirected back to Dashboard with `?session_id=XXX`
7. Dashboard verifies payment with Stripe API
8. Subscription activated and stored in database
9. Success message: "🎉 Welcome to Covera Core! Your subscription is now active."

### 2. Backend Routes Created

#### Create Checkout Session
```
POST /make-server-92f9f116/stripe/create-checkout-session
```
- Requires authentication
- Creates Stripe checkout session with Price ID
- Returns Stripe Checkout URL

#### Verify Payment Session
```
POST /make-server-92f9f116/stripe/verify-session
```
- Requires authentication
- Verifies payment was successful
- Updates user subscription in KV store
- Returns subscription status

#### Get Subscription Status
```
GET /make-server-92f9f116/stripe/subscription-status
```
- Requires authentication
- Returns current plan and status

### 3. Data Storage

User subscription data is stored in KV store (`user:{userId}`):
```json
{
  "plan": "core",
  "stripeCustomerId": "cus_xxxxx",
  "stripeSubscriptionId": "sub_xxxxx",
  "subscriptionStatus": "active",
  "subscriptionUpdatedAt": "2025-12-24T..."
}
```

### 4. Testing with Test Mode

Use Stripe test card numbers:
- ✅ **Success**: `4242 4242 4242 4242`
- ❌ **Decline**: `4000 0000 0000 0002`
- Any future expiry date
- Any 3-digit CVC

### 5. Updating Price ID

If you need to change the Price ID (e.g., different price):

1. Update in `/src/app/components/Settings.tsx`:
```tsx
const STRIPE_PRICE_ID = 'price_YOUR_NEW_PRICE_ID';
```

Or set the environment variable `STRIPE_PRICE_ID_CORE` and use:
```tsx
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID_CORE;
```

## Production Checklist

Before going live:

- [ ] Replace test `STRIPE_SECRET_KEY` with live key (`sk_live_...`)
- [ ] Create products in Stripe Dashboard (live mode)
- [ ] Update Price ID to live price ID (`price_live_...`)
- [ ] Test payment flow end-to-end
- [ ] Configure Stripe Billing Portal settings (optional - for self-service)

## Benefits of This Approach

✅ **No webhook configuration** - simpler setup
✅ **Immediate verification** - payment confirmed on return
✅ **Secure** - Stripe handles all card details (PCI compliant)
✅ **Easy testing** - works immediately with test mode
✅ **Production ready** - same code works in live mode

## Files Modified

- `/supabase/functions/server/index.tsx` - Backend routes
- `/src/app/components/Settings.tsx` - Subscription management UI
- `/src/app/components/Dashboard.tsx` - Payment success verification

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs for Stripe API errors
3. Verify Price ID is correct
4. Ensure STRIPE_SECRET_KEY matches environment (test/live)

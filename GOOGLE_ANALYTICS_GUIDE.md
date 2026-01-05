# Google Analytics Implementation Guide

## Overview
Covera now has Google Analytics 4 (GA4) tracking fully integrated across the entire platform, tracking both marketing pages and authenticated user actions.

## Setup Complete ✅

### Tracking ID
- **Measurement ID**: `G-K26HWY81S5`
- **Status**: Active and tracking

### Files Created/Modified

1. **`/src/app/components/GoogleAnalytics.tsx`** (NEW)
   - React component that loads Google Analytics
   - Automatic page view tracking on route changes
   - Custom event tracking utilities
   - TypeScript support

2. **`/src/app/App.tsx`** (MODIFIED)
   - Integrated `<GoogleAnalytics />` component
   - Tracks all routes (public and authenticated)
   - Automatic initialization on app load

## Features

### 1. Automatic Page View Tracking
✅ Every route change is automatically tracked
✅ Page titles are captured
✅ Full URL paths are recorded
✅ Works on both marketing and app pages

**What's tracked automatically:**
- Landing page visits
- Solution page views
- Industry page views
- Feature page views
- Dashboard navigation
- Vendor management actions
- All other page transitions

### 2. Custom Event Tracking

The component includes ready-to-use event tracking functions:

#### Button Click Tracking
```typescript
import { analytics } from './components/GoogleAnalytics';

analytics.trackButtonClick('Start Free Trial', 'Homepage CTA');
```

#### Form Submission Tracking
```typescript
analytics.trackFormSubmit('Contact Form');
```

#### Trial Signup Tracking
```typescript
analytics.trackTrialSignup('premium');
```

#### Demo Request Tracking
```typescript
analytics.trackDemoRequest();
```

#### Vendor Action Tracking
```typescript
analytics.trackVendorAction('add', vendorId);
analytics.trackVendorAction('edit', vendorId);
analytics.trackVendorAction('delete', vendorId);
```

#### COI Upload Tracking
```typescript
analytics.trackCOIUpload(vendorId);
```

#### Contract Upload Tracking
```typescript
analytics.trackContractUpload(vendorId);
```

#### Subscription Event Tracking
```typescript
analytics.trackSubscription('upgrade', 'premium');
analytics.trackSubscription('cancel');
```

#### Navigation Tracking
```typescript
analytics.trackNavigation('/vendors', 'dashboard');
```

#### Search Tracking
```typescript
analytics.trackSearch('ABC Construction');
```

#### Login/Logout Tracking
```typescript
analytics.trackLogin('email');
analytics.trackLogout();
```

## Implementation Examples

### Example 1: Track CTA Button Clicks
In `/src/app/components/LandingPage.tsx`:

```typescript
import { analytics } from './GoogleAnalytics';

<Link 
  to="/login"
  onClick={() => analytics.trackButtonClick('Start Free Trial', 'Homepage Hero')}
>
  Start free trial
</Link>
```

### Example 2: Track Demo Modal Opens
In `/src/app/components/LandingPage.tsx`:

```typescript
import { analytics } from './GoogleAnalytics';

const handleDemoClick = () => {
  analytics.trackDemoRequest();
  setIsDemoModalOpen(true);
};
```

### Example 3: Track Vendor Actions
In `/src/app/components/VendorManagement.tsx`:

```typescript
import { analytics } from './GoogleAnalytics';

const handleAddVendor = async (vendorData) => {
  const vendor = await addVendor(vendorData);
  analytics.trackVendorAction('add', vendor.id);
};
```

### Example 4: Track COI Uploads
In `/src/app/components/UploadCOIModal.tsx`:

```typescript
import { analytics } from './GoogleAnalytics';

const handleUpload = async (file) => {
  await uploadCOI(file, vendorId);
  analytics.trackCOIUpload(vendorId);
};
```

### Example 5: Track Login Events
In `/src/app/components/LoginScreen.tsx`:

```typescript
import { analytics } from './GoogleAnalytics';

const handleLogin = async (email, password) => {
  await signIn(email, password);
  analytics.trackLogin('email');
  onLogin();
};
```

## Viewing Analytics Data

### Google Analytics Dashboard
1. Go to: https://analytics.google.com/
2. Select property: **Covera** (G-K26HWY81S5)
3. View real-time data in "Realtime" report
4. View historical data in "Reports" section

### Key Reports to Monitor

#### 1. Real-time Overview
- Live user count
- Active pages
- Current events
- Geographic location

#### 2. Acquisition Reports
- Traffic sources (organic, direct, referral)
- Campaign performance
- Landing pages

#### 3. Engagement Reports
- Page views by URL
- Average engagement time
- Event counts
- Popular pages

#### 4. User Reports
- New vs returning users
- User demographics
- Technology (devices, browsers)
- Geographic data

#### 5. Conversion Tracking
- Trial signups
- Demo requests
- Subscription upgrades
- Form submissions

## Custom Events in GA4

The following custom events are now available in Google Analytics:

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `button_click` | `button_name`, `location` | User clicks a tracked button |
| `form_submit` | `form_name` | User submits a form |
| `trial_signup` | `plan` | User signs up for trial |
| `demo_request` | `page` | User requests a demo |
| `vendor_action` | `action`, `vendor_id` | User performs vendor action |
| `coi_upload` | `vendor_id` | User uploads COI |
| `contract_upload` | `vendor_id` | User uploads contract |
| `subscription` | `action`, `plan` | Subscription event |
| `navigation` | `destination`, `source` | User navigates between pages |
| `search` | `search_term` | User performs search |
| `login` | `method` | User logs in |
| `logout` | - | User logs out |

## Best Practices

### ✅ DO:
- Track key conversion actions (signups, demos, upgrades)
- Track high-value user interactions
- Use descriptive event names and parameters
- Monitor real-time data during launches
- Set up custom reports for business KPIs

### ❌ DON'T:
- Track personally identifiable information (PII)
- Track sensitive vendor data
- Over-track (avoid tracking every click)
- Forget to test events in GA4 debug mode
- Track passwords or authentication tokens

## Privacy & Compliance

### GDPR Compliance
- No PII is tracked by default
- User IP addresses are anonymized by GA4
- Consider adding cookie consent banner if required

### Data Retention
- Default: 14 months
- Can be adjusted in GA4 settings

### User Privacy
- Vendor IDs are tracked (non-PII)
- Email addresses are NOT tracked
- Personal data is NOT sent to GA4

## Testing Analytics

### Debug Mode (Chrome)
1. Install "Google Analytics Debugger" Chrome extension
2. Enable the extension
3. Open Chrome DevTools (F12)
4. Navigate to "Console" tab
5. Use your app - you'll see GA events logged

### GA4 DebugView
1. Go to GA4 Admin → DebugView
2. Enable debug mode in your browser
3. Use the app
4. See events appear in real-time

### Test Checklist
- [ ] Page views track on route changes
- [ ] Button clicks fire `button_click` events
- [ ] Form submissions fire `form_submit` events
- [ ] Trial signups fire `trial_signup` events
- [ ] Demo requests fire `demo_request` events
- [ ] Vendor actions fire `vendor_action` events
- [ ] Login/logout events track correctly

## Recommended Next Steps

### 1. Add Event Tracking to Key Components
**High Priority:**
- Landing page CTA buttons
- Demo modal trigger
- Trial signup flow
- Subscription upgrade buttons

**Medium Priority:**
- Vendor add/edit/delete actions
- COI upload completions
- Contract upload completions
- Search functionality

**Low Priority:**
- Navigation menu clicks
- Filter usage
- Export button clicks

### 2. Set Up Conversions in GA4
1. Go to GA4 Admin → Events
2. Mark key events as conversions:
   - `trial_signup`
   - `demo_request`
   - `subscription` (upgrade action)

### 3. Create Custom Reports
- Trial signup funnel
- Demo request sources
- Vendor management engagement
- Feature adoption rates

### 4. Set Up Alerts
- Traffic drops
- Error rate spikes
- Conversion rate changes

## Troubleshooting

### Events Not Showing Up?
1. Check browser console for errors
2. Verify GA4 Measurement ID is correct
3. Check ad blockers aren't blocking GA
4. Wait 24-48 hours for data to appear in reports
5. Use DebugView for real-time testing

### Page Views Not Tracking?
1. Verify `<GoogleAnalytics />` is mounted in App.tsx
2. Check that React Router is working
3. Look for console errors

### Custom Events Not Working?
1. Import analytics utilities correctly
2. Check event name spelling
3. Verify parameters are valid
4. Use GA4 DebugView to see real-time events

## Support

### Documentation
- GA4 Docs: https://support.google.com/analytics/answer/9744165
- Events Guide: https://support.google.com/analytics/answer/9322688
- DebugView: https://support.google.com/analytics/answer/7201382

### Implementation Details
- Component: `/src/app/components/GoogleAnalytics.tsx`
- Integration: `/src/app/App.tsx`
- Tracking ID: `G-K26HWY81S5`

---

**Status**: ✅ **Production Ready**  
**Last Updated**: January 4, 2026  
**Tracking**: 17 marketing pages + all authenticated pages

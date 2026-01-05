# Google Analytics - Quick Reference

## Import Statement
```typescript
import { analytics } from './GoogleAnalytics';
```

## Most Common Tracking Functions

### 1. Track Button Clicks
```typescript
analytics.trackButtonClick('Button Name', 'Location on Page');
```
**Example:**
```typescript
<Link 
  to="/login"
  onClick={() => analytics.trackButtonClick('Start Free Trial', 'Hero Section')}
>
  Start free trial
</Link>
```

### 2. Track Demo Requests
```typescript
analytics.trackDemoRequest();
```
**Example:**
```typescript
const handleDemoClick = () => {
  analytics.trackDemoRequest();
  setIsDemoModalOpen(true);
};
```

### 3. Track Trial Signups
```typescript
analytics.trackTrialSignup('plan_name');
```
**Example:**
```typescript
await authApi.signUp(email, password, name, org);
analytics.trackTrialSignup('standard');
```

### 4. Track Login Events
```typescript
analytics.trackLogin('method');
```
**Example:**
```typescript
await authApi.signIn(email, password);
analytics.trackLogin('email');
```

### 5. Track Form Submissions
```typescript
analytics.trackFormSubmit('Form Name');
```
**Example:**
```typescript
const handleContactSubmit = async () => {
  analytics.trackFormSubmit('Contact Sales Form');
  await submitForm();
};
```

### 6. Track Vendor Actions
```typescript
analytics.trackVendorAction('action_type', vendorId);
```
**Examples:**
```typescript
// When adding a vendor
analytics.trackVendorAction('add', newVendor.id);

// When editing a vendor
analytics.trackVendorAction('edit', vendor.id);

// When deleting a vendor
analytics.trackVendorAction('delete', vendor.id);
```

### 7. Track COI Uploads
```typescript
analytics.trackCOIUpload(vendorId);
```
**Example:**
```typescript
const handleCOIUpload = async (file) => {
  await uploadCOI(file, vendorId);
  analytics.trackCOIUpload(vendorId);
  toast.success('COI uploaded successfully');
};
```

### 8. Track Contract Uploads
```typescript
analytics.trackContractUpload(vendorId);
```
**Example:**
```typescript
await uploadContract(file, vendorId);
analytics.trackContractUpload(vendorId);
```

### 9. Track Subscription Events
```typescript
analytics.trackSubscription('action', 'plan');
```
**Examples:**
```typescript
// On upgrade
analytics.trackSubscription('upgrade', 'premium');

// On downgrade
analytics.trackSubscription('downgrade', 'basic');

// On cancel
analytics.trackSubscription('cancel');
```

### 10. Track Search
```typescript
analytics.trackSearch('search_term');
```
**Example:**
```typescript
const handleSearch = (term: string) => {
  analytics.trackSearch(term);
  performSearch(term);
};
```

### 11. Track Navigation
```typescript
analytics.trackNavigation('destination', 'source');
```
**Example:**
```typescript
<Link 
  to="/vendors"
  onClick={() => analytics.trackNavigation('/vendors', 'dashboard')}
>
  View Vendors
</Link>
```

### 12. Track Logout
```typescript
analytics.trackLogout();
```
**Example:**
```typescript
const handleLogout = async () => {
  analytics.trackLogout();
  await authApi.signOut();
  navigate('/login');
};
```

## Already Implemented ✅

### LandingPage.tsx
- ✅ Hero "Start Free Trial" button
- ✅ Hero "Schedule Demo" button

### LoginScreen.tsx
- ✅ Trial signup tracking
- ✅ Login tracking

## Priority Implementation Checklist

### High Priority
- [ ] Demo modal form submission
- [ ] All "Start Free Trial" CTA buttons
- [ ] Contact sales form submission
- [ ] Stripe subscription upgrade

### Medium Priority
- [ ] Add vendor action
- [ ] Edit vendor action
- [ ] Delete vendor action
- [ ] COI upload completion
- [ ] Contract upload completion

### Low Priority
- [ ] Vendor search
- [ ] Filter usage
- [ ] Export actions
- [ ] Settings changes
- [ ] Navigation clicks

## Testing Your Tracking

### 1. Check Browser Console
Open Chrome DevTools (F12) → Console tab → Look for GA events

### 2. Use GA4 DebugView
1. Go to GA4 property
2. Navigate to Admin → DebugView
3. Click buttons in your app
4. See events appear in real-time

### 3. Real-time Reports
1. Go to GA4 → Reports → Realtime
2. Use the app
3. See events appear within seconds

## Common Patterns

### Pattern 1: Button with Navigation
```typescript
<Link 
  to="/destination"
  onClick={() => analytics.trackButtonClick('Button Name', 'Section')}
>
  Click Me
</Link>
```

### Pattern 2: Button with Modal
```typescript
<button 
  onClick={() => {
    analytics.trackButtonClick('Open Modal', 'Section');
    setIsModalOpen(true);
  }}
>
  Open Modal
</button>
```

### Pattern 3: Form Submission
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  analytics.trackFormSubmit('Form Name');
  await submitForm();
};
```

### Pattern 4: Async Action with Tracking
```typescript
const handleAction = async () => {
  try {
    const result = await performAction();
    analytics.trackVendorAction('action_name', result.id);
    toast.success('Success!');
  } catch (error) {
    console.error(error);
  }
};
```

## Tips

✅ **DO:**
- Track meaningful user actions
- Use descriptive event names
- Test events in DebugView
- Track conversion points

❌ **DON'T:**
- Track PII (emails, names, etc.)
- Over-track (every mouse move)
- Forget to test
- Track sensitive data

## Need Help?

- Full Guide: `/GOOGLE_ANALYTICS_GUIDE.md`
- Component: `/src/app/components/GoogleAnalytics.tsx`
- GA4 Dashboard: https://analytics.google.com/
- Measurement ID: `G-K26HWY81S5`

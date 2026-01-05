# How to Clear Your Stuck Authentication State

You're experiencing a redirect loop because your session is expired but the app keeps trying to load. Here's how to fix it:

## Quick Fix - Clear Browser Storage

### Option 1: Chrome/Edge DevTools (Recommended)
1. Open the app in your browser
2. Press `F12` to open DevTools
3. Go to the **Application** tab (or **Storage** tab in Firefox)
4. In the left sidebar, find **Local Storage**
5. Click on your domain (e.g., `https://your-app.com`)
6. Find and delete the key: `sb-gpnvockmgvysulsxxtyi-auth-token`
7. Refresh the page (`Ctrl+R` or `Cmd+R`)

### Option 2: Console Command (Fastest)
1. Open the app in your browser
2. Press `F12` to open DevTools
3. Go to the **Console** tab
4. Paste this command and press Enter:
   ```javascript
   localStorage.removeItem('sb-gpnvockmgvysulsxxtyi-auth-token'); location.reload();
   ```

### Option 3: Clear All Site Data
1. Open the app
2. Press `F12` → **Application** tab
3. Click **Clear site data** button at the top
4. Refresh the page

## What This Does

This removes the expired Supabase authentication token from your browser's local storage, which will:
- Stop the redirect loop
- Allow you to see the login page
- Let you log in with fresh credentials

## After Clearing

Once you've cleared the storage:
1. You should see the login page
2. Log in with your credentials
3. The app should work normally
4. The new session expiration handling will prevent this in the future

## Why This Happened

Your authentication session expired, but the old code didn't handle session expiration properly. The fixes I just made will prevent this from happening again by:
- Detecting expired sessions automatically
- Redirecting to login only once (no loops)
- Gracefully handling failed sign-out attempts
- Better error logging

---

**After you clear your storage and the fix is deployed, this problem should never happen again!**

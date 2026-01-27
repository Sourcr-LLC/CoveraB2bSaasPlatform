# Deploy Performance Optimizations - Quick Guide

## 🚀 Pre-Deployment Checklist

### 1. Build Test
```bash
npm run build
```

**Expected Success Indicators:**
- ✅ Build completes without errors
- ✅ See multiple chunk files in output:
  ```
  dist/assets/react-vendor-[hash].js
  dist/assets/charts-[hash].js
  dist/assets/pdf-[hash].js
  dist/assets/supabase-[hash].js
  dist/assets/ui-radix-[hash].js
  dist/assets/proxy-[hash].js
  dist/assets/index-[hash].js
  dist/assets/index-[hash].css
  ```
- ✅ Compressed size report shows chunk breakdown
- ✅ No chunks exceed 150KB (except charts/pdf which are acceptable)

### 2. Local Preview
```bash
# If using vite preview
npx vite preview

# Or serve the dist folder
npx serve dist
```

**Test These Routes:**
- ✅ `/` - Landing page loads
- ✅ `/login` - Login screen
- ✅ `/dashboard` - Dashboard with charts
- ✅ `/reports` - PDF export works
- ✅ `/pricing` - Stripe loads correctly

### 3. Browser Console Check
Open DevTools Console (F12) and verify:
- ✅ No red errors
- ✅ No console.log statements (should be stripped)
- ✅ Resources load successfully

---

## 📤 Deploy to Production

### Option A: Netlify (Current)
```bash
# Automatic deployment via Git push
git add .
git commit -m "feat: advanced performance optimizations - code splitting, critical CSS, cache headers"
git push origin main
```

**Netlify will:**
1. Auto-detect changes
2. Run `npm run build`
3. Deploy from `dist/` folder
4. Apply headers from `netlify.toml`

### Option B: Manual Deployment
```bash
# Build production assets
npm run build

# Deploy dist/ folder to your hosting platform
# (Vercel, Cloudflare Pages, AWS S3, etc.)
```

---

## ✅ Post-Deployment Verification

### 1. Check Cache Headers (Critical!)
Open DevTools → Network tab → Reload page

**Verify these headers on static assets:**
```
Request: https://covera.co/assets/index-ABC123.js
Response Headers:
  Cache-Control: public, max-age=31536000, immutable ✅
```

**Verify on HTML:**
```
Request: https://covera.co/
Response Headers:
  Cache-Control: public, max-age=0, must-revalidate ✅
```

### 2. Run Lighthouse Audit
1. Open DevTools → Lighthouse tab
2. Select "Desktop" mode
3. Check "Performance" only
4. Click "Analyze page load"

**Expected Improvements:**
- ✅ "Reduce unused JavaScript" score improved
- ✅ "Render-blocking CSS" warning reduced/eliminated
- ✅ Performance score 85-95+

### 3. Check PageSpeed Insights
Visit: https://pagespeed.web.dev/

**Enter URL:** `https://covera.co`

**Look for improvements in:**
- ✅ Unused JavaScript (should drop from 549KB to ~250-300KB)
- ✅ Render-blocking resources (CSS should be inline)
- ✅ Network dependency chain (should be faster)

### 4. Test Core Functionality
Manually test:
- ✅ Landing page animations work
- ✅ Dashboard charts render correctly
- ✅ PDF export downloads file
- ✅ Stripe payment modal opens
- ✅ All navigation works

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `Failed to parse source map`
**Fix:** Source maps disabled - this is expected, not an error

**Error:** `Chunk size warning`
**Fix:** Already configured to 600KB limit - warnings are informational

### Charts Don't Load
**Issue:** Recharts chunk failed to load
**Check:** Network tab for 404 on `charts-[hash].js`
**Fix:** Rebuild and redeploy

### PDF Export Broken
**Issue:** jsPDF dynamic import fails
**Check:** Console for import errors
**Fix:** Verify `/assets/pdf-[hash].js` exists in dist

### Stripe Not Working
**Issue:** Stripe SDK chunk missing
**Check:** Network tab for `stripe-[hash].js`
**Fix:** Rebuild with `npm run build`

### CSS Looks Broken
**Issue:** Critical CSS not loading
**Check:** View page source - verify `<style>` tag in `<head>`
**Fix:** Verify index.html has inline critical CSS

---

## 📊 Performance Metrics to Monitor

### Immediate (Day 1)
- [ ] PageSpeed Insights score improved
- [ ] No 404 errors in production
- [ ] All features working
- [ ] Cache headers applied

### Short-term (Week 1)
- [ ] Analytics show faster page loads
- [ ] Bounce rate unchanged or improved
- [ ] No increase in error reports

### Long-term (Month 1)
- [ ] Bandwidth usage decreased
- [ ] Server costs reduced (fewer requests)
- [ ] User engagement metrics stable or improved

---

## 🔄 Rollback Plan (If Needed)

### Quick Rollback
```bash
git revert HEAD
git push origin main
```

### Files to Revert:
- `/index.html` - Remove inline critical CSS
- `/vite.config.ts` - Restore previous chunk config
- `/public/_headers` - Delete if causing issues

---

## 📞 Support

### If Something Breaks:
1. Check browser console for errors
2. Verify all chunk files exist in `/dist/assets/`
3. Test in incognito mode (eliminates cache issues)
4. Clear Netlify cache and rebuild
5. Rollback if critical functionality broken

---

**Status:** Ready to Deploy ✅  
**Estimated Deploy Time:** 2-5 minutes (Netlify auto-deploy)  
**Risk Level:** Low (all changes are build/deployment optimizations)

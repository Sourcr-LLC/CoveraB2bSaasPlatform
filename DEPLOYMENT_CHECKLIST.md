# Deployment Checklist - Mobile Performance Updates

## ⚠️ Known Issue: _headers File

The `/public/_headers` file keeps getting converted to a directory by Figma AI during development. This is a known environment issue.

**Solution:** Use one of these methods:
1. Manually add `_headers` file to `/dist` folder after build
2. Use hosting provider config (netlify.toml, vercel.json, etc.)
3. See `/HEADERS_SETUP_GUIDE.md` for detailed instructions

**Don't worry:** All other optimizations work fine. Cache headers are just a bonus optimization.

---

## Pre-Deployment Steps

### 1. Clean Install Dependencies ✓
```bash
# Remove old node_modules
rm -rf node_modules package-lock.json

# Fresh install with updated package.json
npm install
```

### 2. Test Locally ✓
```bash
# Development build
npm run dev

# Production build test
npm run build
npm run preview
```

### 3. Verify Changes ✓
- [ ] Landing page loads without errors
- [ ] Schedule Demo modal appears above navigation
- [ ] Testimonials carousel works on mobile
- [ ] All blog pages load correctly
- [ ] Industry pages load correctly
- [ ] Dashboard functions normally
- [ ] No console errors in browser

## Deployment Steps

### 1. Build for Production
```bash
npm run build
```

Expected output:
- ✅ Smaller bundle sizes
- ✅ Multiple chunk files (react-core, react-router, motion, etc.)
- ✅ No warnings about unused dependencies

### 2. Deploy to Hosting
Upload the `/dist` folder to your hosting provider

### 3. Clear CDN Cache
If using a CDN (Cloudflare, etc.):
- Clear all cache
- Purge everything
- Wait 5-10 minutes for propagation

### 4. Clear Browser Cache
Test in incognito/private mode to avoid cached files

## Post-Deployment Verification

### 1. PageSpeed Insights Test
Visit: https://pagespeed.web.dev/

Test URLs:
- [ ] https://getcovera.co (Homepage)
- [ ] https://getcovera.co/pricing
- [ ] https://getcovera.co/blog
- [ ] https://getcovera.co/industries-healthcare

Expected Mobile Scores:
- Performance: 75-85 (up from ~58)
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

### 2. Key Metrics to Check

**Before vs After:**

| Metric | Target | Notes |
|--------|--------|-------|
| **First Contentful Paint** | < 3.5s | Should be ~2.5-3.5s |
| **Speed Index** | < 5s | Should be ~3.5-4.5s |
| **Total Blocking Time** | < 800ms | Should be ~500-700ms |
| **Largest Contentful Paint** | < 4s | Should be ~3-4s |
| **Cumulative Layout Shift** | < 0.1 | Should be minimal |

### 3. Bundle Size Verification

Check in browser DevTools (Network tab):
- [ ] Main JS bundle < 250KB gzipped
- [ ] React core chunk < 150KB gzipped
- [ ] No MUI chunks loading
- [ ] No react-slick chunks loading
- [ ] Total JS < 700KB (uncompressed)

### 4. Functionality Testing

**Critical Paths:**
- [ ] Home page loads and looks correct
- [ ] Navigation menu works on mobile
- [ ] Schedule Demo modal opens correctly
- [ ] Testimonials carousel swipes on mobile
- [ ] Blog posts load quickly
- [ ] Industry pages load quickly
- [ ] Login/signup works
- [ ] Dashboard loads for authenticated users

### 5. Mobile Device Testing

Test on real devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Check page load speed
- [ ] Verify touch interactions
- [ ] Test modal behavior
- [ ] Verify carousel swipe

## Rollback Plan (If Needed)

### Option 1: Revert Git Commit
```bash
git revert HEAD
git push
```

### Option 2: Restore Dependencies
```bash
# Restore old package.json from git
git checkout HEAD~1 package.json

# Reinstall old dependencies
npm install

# Rebuild
npm run build
```

## Monitoring Setup

### 1. Set Up Alerts
- Monitor PageSpeed scores weekly
- Set up Lighthouse CI in your deployment pipeline
- Track Core Web Vitals in Google Analytics

### 2. Track Improvements
Document baseline vs new metrics:

**Baseline (Before):**
- Mobile Score: 58
- FCP: 4.6s
- Bundle Size: 1.2MB

**After Optimization:**
- Mobile Score: ___ (fill after deploy)
- FCP: ___ (fill after deploy)
- Bundle Size: ___ (fill after deploy)

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Build warnings about chunk size
**Solution:** This is normal for development. Production build will be optimized.

### Issue: Styles not loading
**Solution:** Clear browser cache and CDN cache

### Issue: Modal still not appearing correctly
**Solution:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Carousel not working
**Solution:** Check console for errors. Verify TestimonialCarousel component is being used.

## Success Criteria

✅ **Must Have:**
- [ ] PageSpeed Mobile score > 70
- [ ] No broken functionality
- [ ] All pages load correctly
- [ ] Bundle size reduced by > 30%

✅ **Nice to Have:**
- [ ] PageSpeed Mobile score > 80
- [ ] FCP < 3.0s
- [ ] Total bundle < 600KB
- [ ] All metrics in "green" zone

## Support Resources

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Lighthouse CI:** https://github.com/GoogleChrome/lighthouse-ci
- **Web Vitals:** https://web.dev/vitals/
- **Bundlephobia:** https://bundlephobia.com/ (check package sizes)

## Notes

- Performance improvements are cumulative
- Mobile users should see immediate speed improvements
- Repeat visitors benefit most from caching headers
- Continue monitoring metrics over time
- Consider further optimizations based on real usage data

---

**Last Updated:** January 6, 2026
**Next Review:** After deployment verification
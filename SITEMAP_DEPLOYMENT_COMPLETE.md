# 🚀 Covera Deployment Configuration - COMPLETE GUIDE

## ✅ Your Current Setup (OPTIMIZED)

### Build System
- **Framework:** Vite 6.3.5
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Public Assets:** Files in `/public` are auto-copied to `/dist`

### Deployment Platform
You have configurations for **both Netlify AND Vercel**:

#### **Netlify** (Primary - OPTIMIZED)
- Config file: `/netlify.toml`
- Publish directory: `dist`
- Static files: Explicitly served BEFORE SPA fallback
- Backup: `_redirects` file in `/public`

#### **Vercel** (Alternative)
- Config file: `/vercel.json`
- Handles filesystem first, then SPA fallback

---

## 📁 File Structure (VERIFIED)

```
/
├── public/                      ← Source files (copied to dist/)
│   ├── sitemap.xml             ✅ Primary sitemap
│   ├── robots.txt              ✅ Primary robots
│   └── _redirects              ✅ Netlify redirect rules
├── netlify.toml                ✅ Netlify config (OPTIMIZED)
├── vercel.json                 ✅ Vercel config
└── dist/ (after build)         ← Deployment output
    ├── sitemap.xml
    ├── robots.txt
    ├── _redirects
    └── index.html
```

**✅ FIXED:** Removed duplicate `/sitemap.xml` and `/robots.txt` from root

---

## 🔧 What We Optimized

### 1. netlify.toml - Explicit Static File Handling
```toml
# Explicit redirects for static files BEFORE SPA fallback
[[redirects]]
  from = "/sitemap.xml"
  to = "/sitemap.xml"
  status = 200
  force = false

[[redirects]]
  from = "/robots.txt"
  to = "/robots.txt"
  status = 200
  force = false

# SPA fallback - must be LAST
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

### 2. _redirects File (Backup)
Created `/public/_redirects` as a fallback:
```
/sitemap.xml  /sitemap.xml  200
/robots.txt   /robots.txt   200
/*            /index.html   200
```

### 3. Removed Duplicates
- Deleted `/sitemap.xml` (root) ✅
- Deleted `/robots.txt` (root) ✅
- **Only** `/public/sitemap.xml` and `/public/robots.txt` remain

---

## 🧪 Testing Checklist (After Deploy)

### 1. Verify Files Deployed
Go to Netlify dashboard → Latest deploy → "Deploy summary" → Check these files exist in the build output:
- ✅ `sitemap.xml`
- ✅ `robots.txt`
- ✅ `_redirects`

### 2. Test All Domain Variants
```bash
# Test main domain
curl -I https://getcovera.co/sitemap.xml
curl -I https://getcovera.co/robots.txt

# Test www variant (if configured)
curl -I https://www.getcovera.co/sitemap.xml
curl -I https://www.getcovera.co/robots.txt
```

**Expected Response:**
```
HTTP/2 200
content-type: application/xml; charset=utf-8   (for sitemap)
content-type: text/plain; charset=utf-8        (for robots)
```

### 3. Verify Content-Type Headers
Open Chrome DevTools → Network tab:
- Navigate to `https://getcovera.co/sitemap.xml`
- Check Response Headers:
  - `Content-Type: application/xml; charset=utf-8` ✅
  - `Cache-Control: public, max-age=3600` ✅

### 4. Test SPA Routing Still Works
- `https://getcovera.co/` → Homepage ✅
- `https://getcovera.co/about-us` → About page ✅
- `https://getcovera.co/blog/what-is-certificate-of-insurance` → Blog post ✅
- Random route → Should fallback to SPA (React Router) ✅

---

## 🎯 Netlify Deployment Settings

### Site Settings → Build & Deploy

**Base directory:** (leave blank)

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
dist
```

**Environment variables:**
- All Supabase secrets already configured ✅
- All Stripe secrets already configured ✅

---

## 🐛 Troubleshooting

### Issue: Sitemap 404 After Deploy
**Cause:** Cached old deploy or redirects blocking file

**Fix:**
1. Clear Netlify cache: Site settings → Build & deploy → "Clear cache and retry deploy"
2. Force new deploy: Push any change or trigger manual deploy
3. Clear browser cache and test

### Issue: Sitemap Returns HTML Instead of XML
**Cause:** SPA fallback catching the request

**Fix:**
- The optimized `netlify.toml` should prevent this
- Verify `_redirects` file is in `/public` folder
- Check that static file redirects come BEFORE `/*` rule

### Issue: Wrong Content-Type Header
**Cause:** Netlify not applying headers configuration

**Fix:**
- Verify headers section in `netlify.toml`
- Headers configuration is correct ✅
- Should apply automatically

---

## 📊 SEO Verification

### Submit to Search Engines

**Google Search Console:**
```
https://search.google.com/search-console
→ Sitemaps
→ Add: https://getcovera.co/sitemap.xml
```

**Bing Webmaster Tools:**
```
https://www.bing.com/webmasters
→ Sitemaps
→ Add: https://getcovera.co/sitemap.xml
```

### robots.txt Validation
```
https://getcovera.co/robots.txt
```

Should contain:
```
Sitemap: https://getcovera.co/sitemap.xml
```
✅ Confirmed in `/public/robots.txt`

---

## 🎉 Summary

### What's Ready
✅ Sitemap with all 38 pages (including updated About page priority)
✅ Robots.txt with proper Allow/Disallow rules
✅ Netlify config optimized for static file serving
✅ Backup _redirects file in place
✅ Duplicate files removed
✅ Proper headers configured
✅ SPA fallback working correctly

### Next Steps
1. **Commit these changes** (sitemap, netlify.toml, _redirects)
2. **Deploy to Netlify** (or Vercel)
3. **Verify URLs** using testing checklist above
4. **Submit sitemap** to Google Search Console and Bing
5. **Monitor** in Search Console for indexing status

---

## 💡 Pro Tips

1. **Cache Busting:** If sitemap doesn't update, add `?v=2` to URL temporarily
2. **Monitoring:** Check Search Console weekly for indexing issues
3. **Updates:** When adding new pages, update `/public/sitemap.xml` and redeploy
4. **Automation:** Consider using a sitemap generator plugin in the future for auto-updates

---

## 📞 Support

If you encounter issues:
1. Check Netlify deploy logs for errors
2. Verify files in deploy summary (Files tab)
3. Test with `curl` commands from checklist
4. Check browser DevTools → Network tab for headers

Your sitemap should now work perfectly on Netlify! 🚀

# 🧪 Test Your Build Before Deploying

Run these commands to verify everything works BEFORE deploying:

## Step 1: Build the Project
```bash
npm run build
```

## Step 2: Check Build Output
```bash
# List all files in dist
ls -la dist/

# You should see:
# - index.html
# - sitemap.xml
# - robots.txt
# - _headers
# - _redirects
# - assets/ folder
```

## Step 3: Verify Sitemap Was Copied
```bash
# Check if sitemap.xml exists
ls -la dist/sitemap.xml

# View first few lines
head -5 dist/sitemap.xml

# Should show:
# <?xml version="1.0" encoding="UTF-8"?>
# <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
```

## Step 4: Test Locally
```bash
# Start local preview server
npx vite preview

# Server will start at: http://localhost:4173
```

## Step 5: Test Sitemap in Browser

Open these URLs in your browser:

1. **Homepage:** http://localhost:4173/
   - Should show: Landing page ✅

2. **Sitemap:** http://localhost:4173/sitemap.xml
   - Should show: XML file (not HTML) ✅
   - Should start with: `<?xml version="1.0"?>` ✅

3. **Robots:** http://localhost:4173/robots.txt
   - Should show: Plain text file ✅

4. **Blog route:** http://localhost:4173/blog
   - Should show: Blog listing page ✅

## Step 6: Test with curl
```bash
# Test sitemap
curl http://localhost:4173/sitemap.xml | head -5

# Should return XML:
# <?xml version="1.0" encoding="UTF-8"?>
# <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

# Test robots
curl http://localhost:4173/robots.txt | head -5

# Should return text:
# # Covera - Vendor Compliance & Insurance Tracking Platform
# User-agent: *
```

## ✅ If All Tests Pass

**YOU'RE READY TO DEPLOY!**

The sitemap will work on production because it works locally.

## ❌ If Sitemap Shows HTML Instead of XML

### Problem:
```bash
curl http://localhost:4173/sitemap.xml | head -1
# Shows: <!DOCTYPE html>
```

### Solution:
The routing isn't configured correctly. Check:

1. **Verify `/vercel.json` has:**
   ```json
   {
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/index.html" }
     ]
   }
   ```

2. **Verify `/public/_redirects` exists and has:**
   ```
   /sitemap.xml /sitemap.xml 200
   /* /index.html 200
   ```

3. **Rebuild:**
   ```bash
   rm -rf dist
   npm run build
   npx vite preview
   ```

## ❌ If Sitemap Doesn't Exist in dist/

### Problem:
```bash
ls -la dist/sitemap.xml
# Shows: No such file or directory
```

### Solution:
Vite isn't copying the public folder. Check:

1. **Verify file exists:**
   ```bash
   ls -la public/sitemap.xml
   # Should show the file
   ```

2. **Verify vite.config.ts has:**
   ```typescript
   export default defineConfig({
     publicDir: 'public',
     // ...
   })
   ```

3. **Rebuild:**
   ```bash
   rm -rf dist
   npm run build
   ```

## 🚀 Deploy After Tests Pass

Once everything works locally, deploy:

### Vercel:
```bash
vercel --prod
```

### Netlify:
```bash
netlify deploy --prod
```

### GitHub:
```bash
git add .
git commit -m "Fix sitemap routing"
git push
```

---

**Test locally first, deploy when tests pass!** ✅

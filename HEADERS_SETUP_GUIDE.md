# Cache Headers Setup Guide

## ⚠️ Important Note About _headers File

The `/public/_headers` file keeps getting converted to a directory by Figma AI. This is a known issue with the development environment.

## Solution

### Option 1: Manual Setup After Deployment

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **In the `/dist` folder, create a file named `_headers`** (no extension)

3. **Add this content:**
   ```
   # Cache static assets
   /*.js
     Cache-Control: public, max-age=31536000, immutable

   /*.css
     Cache-Control: public, max-age=31536000, immutable

   /*.woff2
     Cache-Control: public, max-age=31536000, immutable

   /*.woff
     Cache-Control: public, max-age=31536000, immutable

   /*.png
     Cache-Control: public, max-age=31536000, immutable

   /*.jpg
     Cache-Control: public, max-age=31536000, immutable

   /*.svg
     Cache-Control: public, max-age=31536000, immutable

   /*.html
     Cache-Control: public, max-age=3600, must-revalidate

   /
     Cache-Control: public, max-age=0, must-revalidate
     
   /*
     X-Frame-Options: SAMEORIGIN
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

4. **Deploy the `/dist` folder with the `_headers` file**

### Option 2: Use Your Hosting Provider's Configuration

Different hosting providers have different ways to set cache headers:

#### Netlify
Create a `netlify.toml` file in your project root:

```toml
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Vercel
Create a `vercel.json` file in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).woff2",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Cloudflare Pages
Cloudflare Pages automatically respects the `_headers` file in your build output (`/dist` folder).

After building, manually add the `_headers` file to `/dist` before deploying.

#### Apache (.htaccess)
Create a `.htaccess` file in your public directory:

```apache
# Cache JavaScript and CSS for 1 year
<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Cache fonts for 1 year
<FilesMatch "\.(woff2|woff|ttf)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Cache images for 1 year
<FilesMatch "\.(jpg|jpeg|png|gif|svg|webp|ico)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Security headers
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

#### Nginx
Add to your nginx configuration:

```nginx
location ~* \.(js|css)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.(woff2|woff|ttf)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.(jpg|jpeg|png|gif|svg|webp|ico)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Option 3: Reference File

I've created `/public/cache-headers.txt` as a reference. You can:

1. Copy its contents
2. Create `_headers` file manually after build
3. Or use your hosting provider's configuration method

## Why This Matters

Proper cache headers:
- ✅ Reduce repeat visitor load times by 80%+
- ✅ Save bandwidth costs
- ✅ Improve PageSpeed scores
- ✅ Better user experience

## Cache Strategy Explained

| File Type | Cache Duration | Why |
|-----------|----------------|-----|
| JS/CSS | 1 year | Vite adds hashes to filenames, so they're unique per version |
| Fonts | 1 year | Fonts rarely change |
| Images | 1 year | Images are content-addressed |
| HTML | 1 hour | Allows quick updates while still caching |
| Root (/) | No cache | Always check for latest HTML |

## Verification

After deployment, check headers with:

```bash
curl -I https://getcovera.co/assets/index-abc123.js
```

You should see:
```
Cache-Control: public, max-age=31536000, immutable
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

## Alternative: CDN Configuration

If using a CDN (Cloudflare, AWS CloudFront, etc.), you can set cache rules there instead:

### Cloudflare Cache Rules:
1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to "Rules" > "Page Rules" or "Cache Rules"
4. Add cache rules for different file types

### AWS CloudFront:
1. Go to CloudFront console
2. Select your distribution
3. Edit "Behaviors"
4. Set cache policies for path patterns

## Summary

**Don't worry about the `_headers` file issue in development.** 

Just make sure to:
1. Add cache headers after build, OR
2. Use your hosting provider's configuration method, OR
3. Configure cache rules in your CDN

The performance optimizations in the code (lazy loading, removed dependencies, etc.) will work regardless of whether cache headers are set. Cache headers are just an additional optimization for repeat visitors.

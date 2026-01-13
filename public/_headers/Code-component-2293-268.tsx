# Netlify Cache Headers Configuration
# Save this file as "_headers" at the site root (or /public/_headers)

# -----------------------------
# Long-term cached, versioned assets
# -----------------------------

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/*.woff
  Cache-Control: public, max-age=31536000, immutable

/*.ttf
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.jpeg
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable


# -----------------------------
# Favicons (DO NOT make immutable)
# -----------------------------

/*.ico
  Cache-Control: public, max-age=0, must-revalidate


# -----------------------------
# HTML documents
# -----------------------------

/*.html
  Cache-Control: public, max-age=0, must-revalidate


# -----------------------------
# Root path – always revalidate
# -----------------------------

/
  Cache-Control: public, max-age=0, must-revalidate


# -----------------------------
# Security headers (all routes)
# -----------------------------

/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  X-XSS-Protection: 1; mode=block

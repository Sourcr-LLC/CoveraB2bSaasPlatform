# Covera - Netlify Redirects
# Serve static files first, then SPA fallback

# Static files - serve as-is
/sitemap.xml  /sitemap.xml  200
/robots.txt   /robots.txt   200

# SPA fallback for all other routes
/*            /index.html   200

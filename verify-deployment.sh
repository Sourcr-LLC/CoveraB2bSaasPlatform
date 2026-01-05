#!/bin/bash
# Covera - Sitemap & SEO Deployment Verification Script
# Run this after deploying to verify everything works

echo "🚀 Covera Deployment Verification"
echo "=================================="
echo ""

DOMAIN="https://getcovera.co"

echo "📋 Testing Static Files..."
echo ""

# Test sitemap.xml
echo "1️⃣  Testing sitemap.xml..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/sitemap.xml")
SITEMAP_TYPE=$(curl -s -I "$DOMAIN/sitemap.xml" | grep -i "content-type" | head -1)

if [ "$SITEMAP_STATUS" = "200" ]; then
    echo "   ✅ Status: $SITEMAP_STATUS"
    echo "   ✅ $SITEMAP_TYPE"
else
    echo "   ❌ Status: $SITEMAP_STATUS (Expected: 200)"
fi
echo ""

# Test robots.txt
echo "2️⃣  Testing robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/robots.txt")
ROBOTS_TYPE=$(curl -s -I "$DOMAIN/robots.txt" | grep -i "content-type" | head -1)

if [ "$ROBOTS_STATUS" = "200" ]; then
    echo "   ✅ Status: $ROBOTS_STATUS"
    echo "   ✅ $ROBOTS_TYPE"
else
    echo "   ❌ Status: $ROBOTS_STATUS (Expected: 200)"
fi
echo ""

# Test a few key pages
echo "📄 Testing Key Pages..."
echo ""

PAGES=(
    "/"
    "/about-us"
    "/pricing"
    "/blog"
    "/blog/what-is-certificate-of-insurance"
)

for page in "${PAGES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN$page")
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ $page (Status: $STATUS)"
    else
        echo "   ❌ $page (Status: $STATUS)"
    fi
done
echo ""

# Verify sitemap content
echo "🔍 Checking Sitemap Content..."
echo ""
SITEMAP_CONTENT=$(curl -s "$DOMAIN/sitemap.xml")
PAGE_COUNT=$(echo "$SITEMAP_CONTENT" | grep -c "<loc>")
echo "   📊 Total URLs in sitemap: $PAGE_COUNT"
echo ""

# Check if key pages are in sitemap
KEY_URLS=(
    "https://getcovera.co/about-us"
    "https://getcovera.co/pricing"
    "https://getcovera.co/blog"
)

echo "   Verifying key URLs..."
for url in "${KEY_URLS[@]}"; do
    if echo "$SITEMAP_CONTENT" | grep -q "$url"; then
        echo "   ✅ $url"
    else
        echo "   ❌ $url (MISSING)"
    fi
done
echo ""

# Check robots.txt points to sitemap
echo "🤖 Checking robots.txt Configuration..."
ROBOTS_CONTENT=$(curl -s "$DOMAIN/robots.txt")
if echo "$ROBOTS_CONTENT" | grep -q "Sitemap: https://getcovera.co/sitemap.xml"; then
    echo "   ✅ Sitemap URL found in robots.txt"
else
    echo "   ❌ Sitemap URL not found in robots.txt"
fi
echo ""

echo "=================================="
echo "✅ Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Submit sitemap to Google Search Console"
echo "   2. Submit sitemap to Bing Webmaster Tools"
echo "   3. Monitor indexing status over next 7 days"
echo ""

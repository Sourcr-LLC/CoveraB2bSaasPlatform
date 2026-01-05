import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://getcovera.co/</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Login -->
  <url>
    <loc>https://getcovera.co/login</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>https://getcovera.co/terms-of-service</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/privacy-policy</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/security</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <!-- Solutions Pages -->
  <url>
    <loc>https://getcovera.co/solutions-property-management</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/solutions-construction</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Features Pages -->
  <url>
    <loc>https://getcovera.co/features-coi-tracking</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Industry Pages -->
  <url>
    <loc>https://getcovera.co/industries-healthcare</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-logistics</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-franchise</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-facilities</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-government</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-education</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-retail</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-hospitality</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>https://getcovera.co/about-us</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    // Set content type to XML
    document.contentType = 'application/xml';
  }, []);

  return (
    <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://getcovera.co/</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Login -->
  <url>
    <loc>https://getcovera.co/login</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>https://getcovera.co/terms-of-service</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/privacy-policy</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/security</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <!-- Solutions Pages -->
  <url>
    <loc>https://getcovera.co/solutions-property-management</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/solutions-construction</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Features Pages -->
  <url>
    <loc>https://getcovera.co/features-coi-tracking</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Industry Pages -->
  <url>
    <loc>https://getcovera.co/industries-healthcare</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-logistics</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-franchise</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-facilities</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-government</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-education</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-retail</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://getcovera.co/industries-hospitality</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>https://getcovera.co/about-us</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`}
    </pre>
  );
}

import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    // Set content type to XML
    document.contentType = 'application/xml';
  }, []);

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://covera.co/</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Login -->
  <url>
    <loc>https://covera.co/login</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>https://covera.co/terms-of-service</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://covera.co/privacy-policy</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://covera.co/security</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  
  <!-- Pricing Page -->
  <url>
    <loc>https://covera.co/pricing</loc>
    <lastmod>2026-01-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Solutions Pages -->
  <url>
    <loc>https://covera.co/solutions-property-management</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/solutions-construction</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Features Pages -->
  <url>
    <loc>https://covera.co/features-coi-tracking</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Industry Pages -->
  <url>
    <loc>https://covera.co/industries-healthcare</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-logistics</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-franchise</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-facilities</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-government</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-education</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-retail</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://covera.co/industries-hospitality</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>https://covera.co/about-us</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Educational Content Pages -->
  <url>
    <loc>https://covera.co/how-to-track-vendor-compliance</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/what-happens-vendor-uninsured</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog -->
  <url>
    <loc>https://covera.co/blog</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog Posts -->
  <url>
    <loc>https://covera.co/blog/what-is-certificate-of-insurance</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/track-vendor-insurance-expiration-automatically</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/vendor-compliance-checklist</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/coi-tracking-spreadsheet-vs-software</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/expired-vendor-insurance-what-to-do</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/construction-vendor-insurance-requirements</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/additional-insured-vs-certificate-holder</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/vendor-insurance-tracking-mistakes</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/general-liability-coverage-limits</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/automate-coi-collection</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/vendor-insurance-compliance-small-business</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/vendor-service-agreements-vs-sows</loc>
    <lastmod>2026-01-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://covera.co/blog/tracking-vendor-deliverables-slas</loc>
    <lastmod>2026-01-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://covera.co/blog/vendor-contract-renewal-best-practices</loc>
    <lastmod>2026-01-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://covera.co/blog/property-managers-verify-vendor-insurance</loc>
    <lastmod>2026-01-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return (
    <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      {xmlContent}
    </pre>
  );
}

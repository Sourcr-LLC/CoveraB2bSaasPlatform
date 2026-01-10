import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: any;
}

export default function SEO({
  title = 'Covera - Vendor Compliance & Insurance Tracking Platform',
  description = 'Enterprise vendor compliance tracking software for property managers, construction firms, and franchises. Automate COI tracking, vendor management, and compliance monitoring in real-time.',
  keywords = 'vendor compliance tracking, certificate of insurance tracking, COI management, vendor management software, compliance tracking software, insurance certificate tracking, vendor compliance management, construction vendor compliance, property management vendor tracking, B2B compliance software',
  ogImage = 'https://gpnvockmgvysulsxxtyi.supabase.co/storage/v1/object/public/assets/covera-og-image.png',
  ogType = 'website',
  canonical,
  noindex = false,
  schema
}: SEOProps) {
  const location = useLocation();
  const baseUrl = 'https://covera.co';
  const currentUrl = canonical || `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', 'Covera');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'Covera', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:site', '@covera_co');
    updateMetaTag('twitter:creator', '@covera_co');

    // Additional SEO tags
    updateMetaTag('theme-color', '#fafaf9');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('apple-mobile-web-app-title', 'Covera');

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Add sitemap link
    let sitemapLink = document.querySelector('link[rel="sitemap"]');
    if (!sitemapLink) {
      sitemapLink = document.createElement('link');
      sitemapLink.setAttribute('rel', 'sitemap');
      sitemapLink.setAttribute('type', 'application/xml');
      sitemapLink.setAttribute('title', 'Sitemap');
      sitemapLink.setAttribute('href', `${baseUrl}/sitemap.xml`);
      document.head.appendChild(sitemapLink);
    }

    // Add/update structured data (JSON-LD)
    if (schema) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    // Add alternate links for mobile
    let alternateLink = document.querySelector('link[rel="alternate"]');
    if (!alternateLink) {
      alternateLink = document.createElement('link');
      alternateLink.setAttribute('rel', 'alternate');
      alternateLink.setAttribute('media', 'only screen and (max-width: 640px)');
      alternateLink.setAttribute('href', currentUrl);
      document.head.appendChild(alternateLink);
    }

    // Add preconnect links for performance
    const preconnectOrigins = [
      'https://gpnvockmgvysulsxxtyi.supabase.co',
      'https://js.stripe.com',
      'https://m.stripe.network'
    ];

    preconnectOrigins.forEach(origin => {
      let link = document.querySelector(`link[rel="preconnect"][href="${origin}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'preconnect');
        link.setAttribute('href', origin);
        link.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(link);
      }
      
      let dnsLink = document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`);
      if (!dnsLink) {
        dnsLink = document.createElement('link');
        dnsLink.setAttribute('rel', 'dns-prefetch');
        dnsLink.setAttribute('href', origin);
        document.head.appendChild(dnsLink);
      }
    });

  }, [title, description, keywords, ogImage, ogType, currentUrl, noindex, schema]);

  return null;
}

// Predefined SEO configurations for different pages
export const SEO_CONFIGS = {
  landing: {
    title: 'Covera - Vendor Compliance & COI Tracking Software | Enterprise Solution',
    description: 'Automate vendor compliance tracking and certificate of insurance (COI) management. Track 1000+ vendors, get instant alerts, and eliminate compliance gaps. Trusted by property managers, construction firms, and franchises.',
    keywords: 'vendor compliance tracking, COI tracking software, certificate of insurance management, vendor management platform, compliance automation, insurance tracking software, vendor compliance solution, construction compliance, property management compliance, franchise vendor management',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Covera",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "7-day free trial"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127"
        },
        "description": "Enterprise vendor compliance tracking software for managing certificates of insurance, vendor contracts, and compliance status in real-time"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Covera",
        "url": "https://covera.co",
        "logo": "https://gpnvockmgvysulsxxtyi.supabase.co/storage/v1/object/public/assets/covera-og-image.png",
        "description": "Enterprise vendor compliance and insurance tracking platform",
        "sameAs": [
          "https://twitter.com/getcovera",
          "https://linkedin.com/company/getcovera"
        ],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://covera.co/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Covera",
        "url": "https://covera.co",
        "description": "Vendor compliance and COI tracking software for enterprises",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://covera.co/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  },
  
  login: {
    title: 'Login - Covera Vendor Compliance Platform',
    description: 'Access your Covera account to manage vendor compliance, track certificates of insurance, and monitor your vendor portfolio in real-time.',
    keywords: 'covera login, vendor compliance login, coi tracking login, vendor management login',
    noindex: true
  },

  terms: {
    title: 'Terms of Service - Covera',
    description: 'Read Covera\'s Terms of Service. Our legal terms and conditions for using the vendor compliance and insurance tracking platform.',
    keywords: 'covera terms, terms of service, legal terms, vendor compliance terms',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service",
      "description": "Legal terms and conditions for using Covera vendor compliance platform"
    }
  },

  privacy: {
    title: 'Privacy Policy - Covera',
    description: 'Covera\'s Privacy Policy. Learn how we protect your data and maintain security for your vendor compliance information.',
    keywords: 'covera privacy, privacy policy, data protection, vendor data security',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy",
      "description": "Covera's commitment to protecting your data and privacy"
    }
  },

  security: {
    title: 'Security & Compliance - Covera',
    description: 'Enterprise-grade security for vendor compliance management. SOC 2 Type II certified with bank-level encryption and advanced security features.',
    keywords: 'vendor compliance security, soc 2 compliance, data encryption, enterprise security, compliance software security',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Security & Compliance",
      "description": "Enterprise-grade security features and compliance certifications"
    }
  },

  dashboard: {
    title: 'Dashboard - Covera',
    description: 'Manage your vendor compliance portfolio. Track certificates of insurance, monitor compliance status, and get real-time alerts.',
    keywords: 'vendor compliance dashboard, coi tracking, vendor management',
    noindex: true
  },

  vendors: {
    title: 'Vendor Management - Covera',
    description: 'Manage all your vendors in one place. Track compliance status, insurance certificates, and contracts.',
    keywords: 'vendor management, vendor tracking, compliance management',
    noindex: true
  },

  insurance: {
    title: 'Insurance Tracking - Covera',
    description: 'Track certificates of insurance (COI) for all vendors. Get automatic expiration alerts and compliance notifications.',
    keywords: 'insurance tracking, coi management, certificate of insurance',
    noindex: true
  },

  contracts: {
    title: 'Contract Management - Covera',
    description: 'Manage vendor contracts with automated tracking and renewal reminders.',
    keywords: 'contract management, vendor contracts, contract tracking',
    noindex: true
  },

  compliance: {
    title: 'Compliance Dashboard - Covera',
    description: 'Monitor compliance status across your entire vendor portfolio with real-time insights and analytics.',
    keywords: 'compliance dashboard, compliance monitoring, vendor compliance analytics',
    noindex: true
  },

  pricing: {
    title: 'Pricing - Simple, Transparent Vendor Compliance Software | Covera',
    description: 'One simple price for unlimited vendor compliance tracking. Start with a 7-day free trial. No setup fees, no contracts. Cancel anytime. Trusted by property managers, construction firms, and healthcare organizations.',
    keywords: 'vendor compliance software pricing, COI tracking software cost, certificate of insurance software pricing, vendor management pricing, compliance tracking cost',
    schema: {
      "@context": "https://schema.org",
      "@type": "PricingPage",
      "name": "Pricing",
      "description": "Transparent pricing for Covera's vendor compliance and insurance tracking platform",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://covera.co"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pricing",
            "item": "https://covera.co/pricing"
          }
        ]
      }
    }
  },

  aboutUs: {
    title: 'About Covera | Vendor Compliance Without the Chaos',
    description: 'Covera helps businesses stay compliant with vendor insurance without spreadsheets, manual follow ups, or compliance chaos. Operations-first platform for automated COI tracking.',
    keywords: 'about Covera, vendor compliance software, COI tracking platform, insurance compliance automation, vendor management company',
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Covera",
      "description": "Covera helps businesses stay compliant with vendor insurance without spreadsheets, manual follow ups, or compliance chaos",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://covera.co"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://covera.co/about"
          }
        ]
      }
    }
  },

  solutionsPropertyManagement: {
    title: 'Property Management Compliance Software | Vendor & COI Tracking - Covera',
    description: 'Streamline vendor compliance for property management companies. Track contractor insurance certificates, manage service providers, and automate COI renewals.',
    keywords: 'property management compliance software, property manager vendor tracking, contractor insurance tracking, property management COI software',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Property Management Compliance Solutions",
      "description": "Vendor compliance and COI tracking software built for property management companies"
    }
  },

  solutionsConstruction: {
    title: 'Construction Vendor Compliance Software | Subcontractor Insurance Tracking - Covera',
    description: 'Manage subcontractor compliance for construction projects. Track contractor insurance certificates, verify coverage requirements, and reduce project risk.',
    keywords: 'construction compliance software, subcontractor insurance tracking, construction COI management, contractor compliance software',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Construction Compliance Solutions",
      "description": "Subcontractor compliance and insurance tracking software for general contractors"
    }
  },

  featuresCOI: {
    title: 'Certificate of Insurance (COI) Tracking Software | Automated COI Management - Covera',
    description: 'Automate certificate of insurance tracking. Upload COIs, get expiration alerts, and maintain vendor compliance with enterprise COI management software.',
    keywords: 'COI tracking software, certificate of insurance tracking, automated COI management, insurance certificate software',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Certificate of Insurance Tracking",
      "description": "Automated COI tracking and management software"
    }
  },

  // Blog SEO Configs
  blogWhatIsCOI: {
    title: 'What Is a Certificate of Insurance (COI)? Complete Guide 2026',
    description: 'Learn everything about Certificates of Insurance (COI). Understand COI requirements, Additional Insured status, coverage limits, and how to verify vendor insurance certificates.',
    keywords: 'certificate of insurance, what is COI, certificate of insurance explained, COI requirements, additional insured, certificate holder, vendor insurance certificate',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "What Is a Certificate of Insurance (COI)?",
      "datePublished": "2026-01-04",
      "dateModified": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Covera",
        "logo": {
          "@type": "ImageObject",
          "url": "https://covera.co/logo.png"
        }
      },
      "description": "Complete guide to understanding Certificates of Insurance, including requirements, verification, and compliance tracking"
    }
  },

  blogTrackExpiration: {
    title: 'How to Track Vendor Insurance Expiration Automatically | 2026 Guide',
    description: 'Stop chasing vendors for expired insurance certificates. Learn how to automate vendor insurance tracking, set up expiration alerts, and maintain real-time compliance monitoring.',
    keywords: 'vendor insurance tracking, insurance expiration tracking, automated COI tracking, vendor compliance tracking, insurance renewal alerts, vendor insurance expiration',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Track Vendor Insurance Expiration Automatically",
      "datePublished": "2026-01-03",
      "dateModified": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Covera",
        "logo": {
          "@type": "ImageObject",
          "url": "https://covera.co/logo.png"
        }
      }
    }
  },

  blogComplianceChecklist: {
    title: 'Vendor Compliance Checklist 2026 (Free Template) | COI Verification',
    description: 'Free downloadable vendor compliance checklist. Step-by-step process for onboarding vendors, verifying COIs, checking coverage limits, and maintaining insurance compliance.',
    keywords: 'vendor compliance checklist, vendor onboarding checklist, COI verification checklist, vendor insurance checklist, compliance tracking template',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Vendor Compliance Checklist (Free Template)",
      "datePublished": "2025-12-30",
      "dateModified": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogSpreadsheetVsSoftware: {
    title: 'COI Tracking: Spreadsheet vs Software | Which Is Better in 2026?',
    description: 'Compare spreadsheet vs software for certificate of insurance tracking. Discover why 87% of companies switch from Excel to automated COI management platforms.',
    keywords: 'COI tracking spreadsheet, COI software vs Excel, certificate of insurance software, vendor tracking spreadsheet, compliance tracking software',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "COI Tracking: Spreadsheet vs Software",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogExpiredInsurance: {
    title: 'What To Do When Vendor Insurance Expires | Emergency Response Guide',
    description: 'Your vendor\'s insurance just expired. Learn the immediate steps to take, legal risks, contract implications, and how to prevent future coverage gaps.',
    keywords: 'expired vendor insurance, vendor insurance lapsed, expired COI, vendor insurance expired, insurance gap coverage',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "What To Do When Vendor Insurance Expires",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogConstructionInsurance: {
    title: 'Construction Vendor Insurance Requirements | Contractor COI Guide 2026',
    description: 'Complete guide to construction contractor insurance requirements. Learn required coverage types, minimum limits, Additional Insured requirements, and subcontractor compliance.',
    keywords: 'construction insurance requirements, contractor insurance requirements, subcontractor insurance, construction COI requirements, general contractor insurance',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Construction Vendor Insurance Requirements",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogAdditionalInsured: {
    title: 'Additional Insured vs Certificate Holder: Critical Differences 2026',
    description: 'Understand the critical difference between Additional Insured and Certificate Holder. One protects you legally, the other doesn\'t. Learn which you need and why.',
    keywords: 'additional insured vs certificate holder, additional insured explained, certificate holder definition, additional insured requirements',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Additional Insured vs Certificate Holder",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogTrackingMistakes: {
    title: '7 Vendor Insurance Tracking Mistakes That Lead to Lawsuits (Avoid These)',
    description: 'Avoid costly vendor insurance tracking mistakes. Learn the 7 critical errors that expose your business to liability and how to fix them immediately.',
    keywords: 'vendor insurance mistakes, COI tracking errors, vendor compliance mistakes, insurance verification errors, vendor management mistakes',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 Vendor Insurance Tracking Mistakes That Lead to Lawsuits",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogCoverageLimits: {
    title: 'General Liability Coverage Limits Explained | How Much Is Enough?',
    description: 'Understand general liability insurance coverage limits. Learn per occurrence vs aggregate limits, industry minimums, and how to set vendor insurance requirements.',
    keywords: 'general liability coverage limits, liability insurance limits, per occurrence vs aggregate, insurance coverage minimums',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "General Liability Coverage Limits Explained",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogAutomateCOI: {
    title: 'How to Automate COI Collection | Complete Guide to Automated COI Tracking',
    description: 'Automate your certificate of insurance collection process. Learn how to eliminate manual COI chasing, set up automated vendor requests, and maintain compliance effortlessly.',
    keywords: 'automate COI collection, automated COI tracking, automatic certificate of insurance, vendor insurance automation, COI collection software',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Automate COI Collection",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogSmallBusiness: {
    title: 'Vendor Insurance Compliance for Small Business | Complete Guide 2026',
    description: 'Small business guide to vendor insurance compliance. Learn affordable strategies for tracking vendor COIs, managing contractor insurance, and reducing liability risk.',
    keywords: 'small business vendor compliance, small business COI tracking, vendor insurance for small business, contractor compliance small business',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Vendor Insurance Compliance for Small Business",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blogPropertyManagers: {
    title: 'How Property Managers Verify Vendor Insurance | COI Tracking Guide 2026',
    description: 'Property manager\'s guide to verifying vendor insurance. Learn how to collect COIs from contractors, track maintenance vendor compliance, and protect properties from liability.',
    keywords: 'property manager vendor insurance, property management COI tracking, verify contractor insurance, property management vendor compliance',
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How Property Managers Verify Vendor Insurance",
      "datePublished": "2026-01-04",
      "author": {
        "@type": "Organization",
        "name": "Covera"
      }
    }
  },

  blog: {
    title: 'Vendor Compliance & COI Tracking Blog | Expert Guides & Resources - Covera',
    description: 'Expert guides on vendor compliance, COI tracking, insurance verification, and contractor management. Learn best practices for managing vendor insurance certificates and compliance.',
    keywords: 'vendor compliance blog, COI tracking guides, insurance verification tips, vendor management resources, certificate of insurance blog',
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Covera Blog",
      "description": "Expert resources on vendor compliance and certificate of insurance tracking"
    }
  }
};
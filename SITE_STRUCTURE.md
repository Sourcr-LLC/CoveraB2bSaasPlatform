# Covera - Site Structure & SEO Documentation

## Overview
This document outlines the complete site structure for Covera's vendor compliance and insurance tracking platform, including all public pages, their purpose, and SEO optimization details.

## Domain
**Primary Domain:** https://getcovera.co

## Public Pages (Indexed by Search Engines)

### Core Pages

#### 1. Homepage (`/`)
- **Route:** `/`
- **Component:** `LandingPage.tsx`
- **SEO Priority:** 1.0 (Highest)
- **Target Keywords:** vendor compliance tracking, COI tracking software, certificate of insurance management
- **Purpose:** Main landing page with product overview, features, testimonials, and CTA
- **Schema Markup:** SoftwareApplication with AggregateRating

#### 2. Login Page (`/login`)
- **Route:** `/login`
- **Component:** `LoginScreen.tsx`
- **SEO Priority:** 0.7
- **Target Keywords:** covera login, vendor compliance login
- **Purpose:** User authentication portal

### Solutions Pages (Industry-Specific Landing Pages)

#### 3. Property Management Solution (`/solutions-property-management`)
- **Route:** `/solutions-property-management`
- **Component:** `SolutionsPropertyManagement.tsx`
- **SEO Priority:** 0.9
- **Target Keywords:** property management compliance software, contractor insurance tracking, property management COI software
- **Purpose:** Industry-specific landing page for property management companies
- **Key Sections:**
  - Hero with value proposition
  - Challenges property managers face
  - How Covera helps property managers
  - Property types supported
  - CTA section
- **Schema Markup:** WebPage with BreadcrumbList

#### 4. Construction Solution (`/solutions-construction`)
- **Route:** `/solutions-construction`
- **Component:** `SolutionsConstruction.tsx`
- **SEO Priority:** 0.9
- **Target Keywords:** construction compliance software, subcontractor insurance tracking, construction COI management
- **Purpose:** Industry-specific landing page for construction firms and general contractors
- **Key Sections:**
  - Hero with construction-specific messaging
  - Project risks section
  - Features for construction teams
  - Project types supported
  - CTA section
- **Schema Markup:** WebPage

### Feature Pages

#### 5. COI Tracking Feature (`/features-coi-tracking`)
- **Route:** `/features-coi-tracking`
- **Component:** `FeaturesCOITracking.tsx`
- **SEO Priority:** 0.9
- **Target Keywords:** COI tracking software, certificate of insurance tracking, automated COI management
- **Purpose:** Deep dive into certificate of insurance tracking functionality
- **Key Sections:**
  - Hero highlighting COI automation
  - How it works (4-step process)
  - Key features list
  - Benefits with statistics
  - CTA section
- **Schema Markup:** WebPage

### Legal & Information Pages

#### 6. Terms of Service (`/terms-of-service`)
- **Route:** `/terms-of-service`
- **Component:** `TermsOfService.tsx`
- **SEO Priority:** 0.5
- **Purpose:** Legal terms and conditions
- **Schema Markup:** WebPage

#### 7. Privacy Policy (`/privacy-policy`)
- **Route:** `/privacy-policy`
- **Component:** `PrivacyPolicy.tsx`
- **SEO Priority:** 0.5
- **Purpose:** Data protection and privacy information
- **Schema Markup:** WebPage

#### 8. Security & Compliance (`/security`)
- **Route:** `/security`
- **Component:** `Security.tsx`
- **SEO Priority:** 0.7
- **Target Keywords:** vendor compliance security, SOC 2 compliance, enterprise security
- **Purpose:** Security certifications, data protection measures, and compliance information
- **Schema Markup:** WebPage

#### 9. Forgot Password (`/forgot-password`)
- **Route:** `/forgot-password`
- **Component:** `ForgotPassword.tsx`
- **SEO Priority:** 0.3
- **Purpose:** Password recovery flow

## Protected Pages (Not Indexed - Behind Authentication)

All protected pages use `noindex` meta tag and are blocked in robots.txt.

### Application Pages
- `/dashboard` - Main dashboard
- `/vendors` - Vendor management listing
- `/vendors/:id` - Individual vendor detail pages
- `/insurance` - Insurance tracking and COI timeline
- `/contracts` - Contract management
- `/compliance` - Compliance dashboard and analytics
- `/reports` - Reports and exports
- `/alerts` - Alerts and reminders center
- `/settings` - User settings
- `/billing` - Subscription and billing management
- `/add-vendor` - Add new vendor form

## SEO Technical Implementation

### Sitemap
- **Location:** `/public/sitemap.xml`
- **URL:** https://getcovera.co/sitemap.xml
- **Update Frequency:** Updated when new public pages are added
- **Last Modified:** 2026-01-02

### Robots.txt
- **Location:** `/public/robots.txt`
- **URL:** https://getcovera.co/robots.txt
- **Allows:** All public pages
- **Disallows:** All authenticated pages, API endpoints

### Meta Tags (Implemented via SEO Component)
Each page includes:
- Title tag (unique per page)
- Meta description
- Keywords
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Structured data (JSON-LD schema markup)
- Mobile meta tags

### Structured Data (Schema.org)
- **Homepage:** SoftwareApplication schema
- **Solutions Pages:** WebPage with BreadcrumbList
- **Feature Pages:** WebPage schema
- **Legal Pages:** WebPage schema

## Target Industries & Keywords

### Primary Industries
1. **Property Management**
   - Residential properties
   - Commercial buildings
   - Mixed-use developments
   
2. **Construction**
   - General contractors
   - Commercial construction
   - Subcontractor management

3. **Healthcare** (Future)
4. **Logistics** (Future)
5. **Franchises** (Future)

### Primary Keywords
- vendor compliance tracking
- certificate of insurance tracking
- COI management
- COI tracking software
- vendor management software
- compliance tracking software
- subcontractor insurance tracking
- property management compliance
- construction vendor compliance

### Long-tail Keywords
- automated certificate of insurance tracking
- property manager vendor compliance software
- construction subcontractor COI management
- vendor insurance certificate tracking software
- automated vendor compliance platform

## Internal Linking Strategy

### From Homepage to Solutions
- CTA buttons link to industry solution pages
- "Learn More" links point to feature pages

### From Solutions to Feature Pages
- Feature mentions link to detailed feature pages
- CTA buttons link back to signup/trial

### Cross-linking Between Solutions
- Similar industry pages reference each other
- "Also serving" sections

## Mobile Optimization
- Responsive design for all pages
- Mobile-specific meta tags
- Touch-friendly navigation
- No pinch-to-zoom (controlled via viewport meta tag)

## Performance Optimization
- Lazy loading for authenticated pages
- Code splitting by route
- Optimized images (via Unsplash CDN)
- Minimal loading states

## Future SEO Expansion Opportunities

### Additional Solutions Pages (Planned)
1. `/solutions-healthcare` - Healthcare vendor compliance
2. `/solutions-logistics` - Logistics vendor management
3. `/solutions-franchise` - Franchise compliance tracking

### Additional Feature Pages (Planned)
1. `/features-vendor-management` - Vendor database and organization
2. `/features-contract-tracking` - Contract lifecycle management
3. `/features-compliance-reporting` - Analytics and reporting
4. `/features-automated-alerts` - Alert and notification system

### Resource Pages (Planned)
1. `/blog` - Educational content on compliance
2. `/resources` - Whitepapers, guides, templates
3. `/case-studies` - Customer success stories
4. `/pricing` - Transparent pricing page

## Analytics & Tracking
- Google Analytics (to be implemented)
- Search Console integration (to be implemented)
- Conversion tracking for:
  - Demo requests
  - Trial signups
  - Contact sales
  - Page views on solutions pages

## Monitoring & Maintenance
- Monthly sitemap updates
- Quarterly content audits
- Regular broken link checks
- Performance monitoring
- Search ranking tracking

---

**Last Updated:** January 2, 2026
**Maintained By:** Development Team

import { Link } from 'react-router';
import { Store, CheckCircle, Shield, ArrowRight, ShoppingBag, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesRetail() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="page-root min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Retail Vendor Compliance Software | Multi-Location Store Contractor Management - Covera"
        description="Vendor compliance and insurance tracking for retail chains and multi-location stores. Manage contractor COIs across all locations, track store maintenance vendors, and ensure brand consistency."
        keywords="retail vendor compliance, multi-location retail management, store contractor tracking, retail COI management, retail chain vendor management, store maintenance compliance software"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Retail Compliance Solutions",
          "description": "Vendor compliance and insurance tracking software for retail chains and multi-location stores",
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
                "name": "Industries",
                "item": "https://covera.co/industries"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Retail",
                "item": "https://covera.co/industries/retail"
              }
            ]
          }
        }}
      />

      <LandingNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-hero section-padding pt-32 md:pt-40 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor compliance for retail chains <span className="text-[#3A4F6A]">& multi-location stores</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Streamline vendor management across all retail locations. Track contractor insurance, manage store maintenance vendors, and ensure compliance consistency from corporate to every storefront.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 500 }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/#demo"
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                style={{ border: '1px solid #f1f5f9', color: 'var(--foreground)', fontWeight: 500 }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsDemoModalOpen(true);
                }}
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="section section-padding py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          <div>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                Multi-Location Retail Challenges
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
                Retail chains face unique vendor management complexities
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Inconsistent Compliance',
                  description: 'Different stores using different vendors with varying compliance standards and documentation',
                  icon: AlertTriangle,
                  color: 'var(--status-non-compliant)'
                },
                {
                  title: 'Location Visibility',
                  description: 'Corporate teams unable to monitor vendor compliance status across dozens or hundreds of locations',
                  icon: MapPin,
                  color: 'var(--status-at-risk)'
                },
                {
                  title: 'Brand Risk',
                  description: 'Non-compliant contractors creating liability and brand reputation exposure at store level',
                  icon: Shield,
                  color: 'var(--status-at-risk)'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border p-8 hover:shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: '#f1f5f9'
                  }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--panel)' }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section section-padding py-20 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                Built for Retail Operations
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Multi-Location Management',
                  description: 'Organize vendors by location, region, or service type with complete visibility across your entire retail footprint'
                },
                {
                  title: 'Centralized Vendor Database',
                  description: 'Maintain approved vendor lists at corporate level while allowing location-specific assignments and compliance tracking'
                },
                {
                  title: 'Store-Level Access',
                  description: 'Enable store managers to verify vendor compliance while corporate teams maintain oversight and reporting'
                },
                {
                  title: 'Service Category Tracking',
                  description: 'Track compliance for HVAC, electrical, plumbing, janitorial, security, and all store maintenance vendors'
                },
                {
                  title: 'Rapid Store Openings',
                  description: 'Quickly onboard and verify vendors for new store openings with standardized compliance requirements'
                },
                {
                  title: 'Regional Reporting',
                  description: 'Generate compliance reports by location, region, district, or service category for complete operational oversight'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border p-8 hover:shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: '#f1f5f9'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--primary)' }} />
                    <div>
                      <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</h3>
                      <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Retail Types */}
        <section className="section section-padding py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
          <div>
            <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              For All Retail Operations
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                'Big Box Retailers',
                'Grocery Chains',
                'Department Stores',
                'Specialty Retail',
                'Shopping Malls',
                'Convenience Stores',
                'Automotive Retail',
                'Home Improvement',
                'Restaurants & QSR',
                'Apparel Chains',
                'Electronics Stores',
                'Pharmacy Chains'
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border p-6 flex items-center gap-3 hover:shadow-md transition-shadow duration-200"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section section-padding py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          <div>
            <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              Retail Chain Benefits
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: 'Complete Visibility',
                  description: 'Monitor vendor compliance across all locations from a single dashboard with real-time status updates'
                },
                {
                  icon: Shield,
                  title: 'Brand Protection',
                  description: 'Ensure consistent compliance standards across all stores to protect brand reputation and reduce liability'
                },
                {
                  icon: Clock,
                  title: 'Operational Efficiency',
                  description: 'Streamline vendor onboarding and compliance tracking to reduce administrative burden at store level'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border p-8 text-center hover:shadow-md transition-shadow duration-200"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--panel)' }}>
                    <item.icon className="w-7 h-7" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-cta section-padding py-20" style={{ backgroundColor: 'var(--background)' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6">
              Unify Vendor Compliance <span className="text-[#3A4F6A]">Across All Locations</span>
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
              Join retail chains managing vendor compliance with Covera
            </p>
            <Link 
              to="/login"
              className="px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-all hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              Start 7-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
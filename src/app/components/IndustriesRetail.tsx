import { Link } from 'react-router-dom';
import { Store, CheckCircle, Shield, ArrowRight, ShoppingBag, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import DemoModal from './DemoModal';

export default function IndustriesRetail() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Retail Vendor Compliance Software | Multi-Location Store Contractor Management - Covera"
        description="Vendor compliance and insurance tracking for retail chains and multi-location stores. Manage contractor COIs across all locations, track store maintenance vendors, and ensure brand consistency."
        keywords="retail vendor compliance, multi-location retail management, store contractor tracking, retail COI management, retail chain vendor management, store maintenance compliance software"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Retail Compliance Solutions",
          "description": "Vendor compliance and insurance tracking software for retail chains and multi-location stores"
        }}
      />

      <LandingNav />

      {/* Hero Section */}
      <section className="border-b pt-20 md:pt-24" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-6xl" style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
              Vendor compliance for retail chains & multi-location stores
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Streamline vendor management across all retail locations. Track contractor insurance, manage store maintenance vendors, and ensure compliance consistency from corporate to every storefront.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 500 }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/#demo"
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                style={{ border: '1px solid var(--border)', color: 'var(--foreground)', fontWeight: 500 }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsDemoModalOpen(true);
                }}
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-6">
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
                className="rounded-xl border p-8"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)'
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
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
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
                className="rounded-xl border p-8"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)'
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
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
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
                className="rounded-lg border p-6 flex items-center gap-3"
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
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-6">
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
                className="rounded-xl border p-8 text-center"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)'
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
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl mb-6" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Unify Vendor Compliance Across All Locations
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
            Join retail chains managing vendor compliance with Covera
          </p>
          <Link 
            to="/login"
            className="px-8 py-4 rounded-lg text-lg inline-flex items-center gap-2 transition-all"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            Start 7-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4">
            <div className="text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
              © 2026 Covera. All rights reserved.
            </div>
            <div className="flex items-center gap-6 md:gap-8 text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-of-service">Terms</Link>
              <Link to="/security">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
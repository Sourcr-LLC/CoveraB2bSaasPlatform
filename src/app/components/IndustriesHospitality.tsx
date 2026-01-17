import { Link } from 'react-router';
import { Hotel, CheckCircle, Shield, ArrowRight, TrendingUp, Users, Clock, AlertTriangle, Star } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesHospitality() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Hospitality Vendor Compliance Software | Hotel & Restaurant Contractor Management - Covera"
        description="Vendor compliance and insurance tracking for hotels, restaurants, and hospitality groups. Manage contractor COIs across all properties, track facility maintenance vendors, and ensure guest safety."
        keywords="hospitality vendor compliance, hotel contractor management, restaurant vendor tracking, hospitality COI management, hotel chain vendor management, hospitality compliance software"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Hospitality Compliance Solutions",
          "description": "Vendor compliance and insurance tracking software for hotels, restaurants, and hospitality operations",
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
                "name": "Hospitality",
                "item": "https://covera.co/industries/hospitality"
              }
            ]
          }
        }}
      />

      <LandingNav />

      {/* Hero Section */}
      <section className="border-b pt-20 md:pt-24" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor compliance for hotels, resorts <span className="text-[#3A4F6A]">& hospitality operations</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Protect guests and properties with comprehensive vendor compliance tracking. Manage contractor insurance across all locations, ensure facility safety, and maintain brand standards with automated COI management.
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
              Hospitality Industry Risks
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              Hotels and restaurants face unique vendor compliance challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Guest Safety',
                description: 'Contractors working in occupied areas without proper insurance or safety certification',
                icon: AlertTriangle,
                color: 'var(--status-non-compliant)'
              },
              {
                title: '24/7 Operations',
                description: 'Round-the-clock vendor access requiring constant compliance verification and documentation',
                icon: Clock,
                color: 'var(--status-at-risk)'
              },
              {
                title: 'Property Liability',
                description: 'High-value facilities and guest areas exposed to risk from non-compliant maintenance vendors',
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
              Built for Hospitality Operations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Property-Wide Vendor Tracking',
                description: 'Manage all contractors across hotels, restaurants, event spaces, and amenity areas from a single platform'
              },
              {
                title: 'Service Category Management',
                description: 'Track compliance for HVAC, plumbing, electrical, landscaping, pool service, kitchen equipment, and all facility vendors'
              },
              {
                title: 'Multi-Property Oversight',
                description: 'Monitor vendor compliance across hotel portfolios, restaurant groups, and resort properties with centralized reporting'
              },
              {
                title: 'Emergency Vendor Access',
                description: 'Quickly verify compliance for emergency service calls while maintaining security and safety protocols'
              },
              {
                title: 'Guest Area Protection',
                description: 'Ensure all vendors working in guest-facing areas meet insurance and safety requirements to protect brand reputation'
              },
              {
                title: 'Brand Standards Compliance',
                description: 'Maintain consistent vendor requirements across all properties to uphold hospitality brand standards'
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

      {/* Property Types */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            For All Hospitality Operations
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Hotel Chains',
              'Boutique Hotels',
              'Resorts & Spas',
              'Restaurant Groups',
              'Event Venues',
              'Conference Centers',
              'Casino Properties',
              'Vacation Rentals',
              'Country Clubs',
              'Catering Services',
              'Food & Beverage',
              'Cruise Operations'
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-lg border p-6 flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <Hotel className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
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
            Hospitality Industry Benefits
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Guest Experience',
                description: 'Maintain seamless operations and guest satisfaction with verified, compliant vendors'
              },
              {
                icon: Shield,
                title: 'Risk Reduction',
                description: 'Protect guests, staff, and property assets with comprehensive vendor compliance verification'
              },
              {
                icon: Clock,
                title: 'Operational Speed',
                description: 'Quickly verify vendor compliance for urgent repairs and maintenance without disrupting operations'
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
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6">
            Protect Your Guests <span className="text-[#3A4F6A]">and Properties</span>
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
            Join hospitality operations ensuring vendor compliance with Covera
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
      <Footer />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
import { Link } from 'react-router-dom';
import { Building2, CheckCircle, Shield, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import SEO, { SEO_CONFIGS } from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function SolutionsPropertyManagement() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Property Management Compliance Software | Vendor & COI Tracking - Covera"
        description="Streamline vendor compliance for property management companies. Track contractor insurance certificates, manage service providers, and automate COI renewals for residential and commercial properties."
        keywords="property management compliance software, property manager vendor tracking, contractor insurance tracking, property management COI software, vendor compliance property management, residential property compliance, commercial property vendor management"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Property Management Compliance Solutions",
          "description": "Vendor compliance and COI tracking software built for property management companies",
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
                "name": "Solutions",
                "item": "https://covera.co/solutions"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Property Management",
                "item": "https://covera.co/solutions/property-management"
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
            
            <h1 className="mb-6 text-4xl md:text-6xl" style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
              Vendor Compliance Management for <span style={{ color: 'var(--primary)' }}>Property Managers</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Track contractor insurance certificates, manage service provider compliance, and protect your properties with automated COI tracking. Built for residential and commercial property management teams.
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

      {/* Key Challenges Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              Challenges Property Managers Face
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              Managing hundreds of contractors and service providers across multiple properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Multiple Properties',
                description: 'Tracking vendors across residential complexes, commercial buildings, and mixed-use developments',
                icon: Building2
              },
              {
                title: 'Contractor Turnover',
                description: 'Managing frequent changes in HVAC, plumbing, landscaping, and maintenance contractors',
                icon: Users
              },
              {
                title: 'Manual COI Tracking',
                description: 'Chasing insurance certificates via email, missing renewal dates, and compliance gaps',
                icon: Clock
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
                  <item.icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</h3>
                <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              How Covera Helps Property Managers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Automated COI Tracking',
                description: 'Automatically track insurance certificates for all contractors - HVAC, plumbing, electrical, landscaping, and janitorial services',
                icon: Shield
              },
              {
                title: 'Property-Level Organization',
                description: 'Organize vendors by property, building, or portfolio with custom tags and categories',
                icon: Building2
              },
              {
                title: 'Renewal Reminders',
                description: 'Never miss an insurance renewal with automatic email reminders sent to contractors 30, 14, and 7 days before expiration',
                icon: Clock
              },
              {
                title: 'Compliance Reports',
                description: 'Generate compliance reports for ownership groups, investors, and insurance carriers in seconds',
                icon: TrendingUp
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
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--panel)' }}>
                    <item.icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  </div>
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

      {/* Use Cases Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Perfect for Every Property Type
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Residential Apartment Communities',
              'Commercial Office Buildings',
              'Mixed-Use Developments',
              'Retail Shopping Centers',
              'Industrial Properties',
              'Student Housing Complexes'
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-lg border p-6 flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--foreground)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl mb-6" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Start Managing Property Compliance Today
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
            Join property management companies using Covera to track 1000+ contractors
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
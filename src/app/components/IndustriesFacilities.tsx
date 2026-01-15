import { Link } from 'react-router-dom';
import { Building2, CheckCircle, Shield, ArrowRight, Wrench, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesFacilities() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Facilities Management Vendor Compliance Software | Service Provider COI Tracking - Covera"
        description="Centralize vendor insurance tracking for cleaning, maintenance, and service providers. Track janitorial, HVAC, landscaping, and contractor compliance across all managed facilities."
        keywords="facilities management compliance, facility vendor tracking, service provider compliance software, janitorial vendor insurance, facilities COI tracking, maintenance contractor compliance, facility operations software"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Facilities Management Vendor Compliance",
          "description": "Vendor compliance and COI tracking software built for facilities management companies and facility operations teams",
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
                "name": "Facilities Management",
                "item": "https://covera.co/industries/facilities"
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
              Vendor compliance for facilities <span className="text-[#3A4F6A]">management operations</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Track cleaning services, maintenance contractors, and service provider compliance across all managed facilities. Eliminate manual COI tracking and ensure continuous vendor coverage.
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

      {/* Key Challenges */}
      <section style={{ backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-12">
            <h2 className="mb-4 text-3xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Facilities management demands continuous compliance
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Facility managers coordinate janitorial services, HVAC contractors, landscaping crews, security providers, and specialized maintenance vendors. Each requires proper insurance coverage and compliance documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Users className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Multiple vendor types</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Track diverse service providers including janitorial, HVAC, landscaping, security, and maintenance contractors from one platform.
              </p>
            </div>

            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Building2 className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Multi-facility visibility</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Monitor compliance across all managed facilities with location-based filtering and facility-specific reporting.
              </p>
            </div>

            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Shield className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Client requirements</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Meet client-specific insurance requirements and provide compliance documentation for facility owners and property managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-12">
            <h2 className="mb-4 text-3xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Built for facilities operations teams
            </h2>
          </div>

          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="mb-3 text-2xl" style={{ fontWeight: 600 }}>
                  Automated service provider tracking
                </h3>
                <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Monitor all facility service providers automatically. Track janitorial services, maintenance contractors, HVAC vendors, landscaping crews, and specialized service providers.
                </p>
                <ul className="space-y-3">
                  {[
                    'Real-time compliance for all service types',
                    'Facility-level vendor organization',
                    'Automated expiration tracking',
                    'Multi-facility compliance dashboard'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                      <span style={{ color: 'var(--foreground)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                    <div>
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>CleanPro Janitorial</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Cleaning services</div>
                    </div>
                    <div className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-compliant)', fontWeight: 500 }}>
                      Compliant
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                    <div>
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>Climate Control HVAC</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>HVAC maintenance</div>
                    </div>
                    <div className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-expiring)', fontWeight: 500 }}>
                      Expiring Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 rounded-xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-5xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>35+</div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Facilities managed</div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-subtle)', fontWeight: 600 }}>
                      Client-ready reports
                    </div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      Export compliance documentation instantly
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="mb-3 text-2xl" style={{ fontWeight: 600 }}>
                  Client compliance reporting
                </h3>
                <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Provide facility owners and property managers with comprehensive compliance documentation. Generate client-ready reports instantly for any facility or vendor.
                </p>
                <ul className="space-y-3">
                  {[
                    'Facility-specific compliance reports',
                    'Client-ready documentation exports',
                    'Custom insurance requirement tracking',
                    'Automated compliance verification'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                      <span style={{ color: 'var(--foreground)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
            Ready to automate <span className="text-[#3A4F6A]">facilities compliance?</span>
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
            Join facilities teams that have eliminated manual vendor tracking and client reporting stress.
          </p>
          <Link 
            to="/login"
            className="px-8 py-4 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 500 }}
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
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
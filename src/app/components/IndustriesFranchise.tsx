import { Link } from 'react-router-dom';
import { Store, CheckCircle, Shield, ArrowRight, TrendingUp, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesFranchise() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Franchise Vendor Compliance Software | Multi-Location COI Tracking - Covera"
        description="Centralized compliance visibility across all franchise locations with vendor-level control. Track vendor insurance, manage contractor compliance, and ensure consistent standards across every franchise location."
        keywords="franchise compliance software, multi-location vendor tracking, franchise vendor management, franchise COI tracking, multi-unit compliance, franchise operations software, franchisor compliance tools"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Franchise & Multi-Location Vendor Compliance",
          "description": "Vendor compliance and COI tracking software built for franchises and multi-location businesses",
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
                "name": "Franchises & Multi-Location",
                "item": "https://covera.co/industries/franchise"
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
            
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-6xl" style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
              Centralized vendor compliance for franchise networks
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Manage vendor compliance across all franchise locations from one platform. Enforce corporate standards, track local vendors, and maintain visibility across your entire franchise network.
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
              Multi-location businesses need unified compliance
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Franchise networks manage corporate-approved vendors, location-specific contractors, and local service providers. Each location needs vendor management while corporate maintains oversight and enforces brand standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <MapPin className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Multi-location visibility</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Track vendor compliance across all franchise locations from a single dashboard with location-level filtering and reporting.
              </p>
            </div>

            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Shield className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Corporate standards</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Enforce consistent insurance requirements and compliance standards across every franchise location automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Users className="w-8 h-8 mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-lg" style={{ fontWeight: 600 }}>Franchisee autonomy</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Give franchisees control over local vendors while corporate maintains oversight and compliance visibility.
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
              Built for franchise operations
            </h2>
          </div>

          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="mb-3 text-2xl" style={{ fontWeight: 600 }}>
                  Centralized multi-location tracking
                </h3>
                <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Monitor compliance across all franchise locations. Track corporate-approved vendors and location-specific contractors from one unified platform.
                </p>
                <ul className="space-y-3">
                  {[
                    'Real-time compliance across all locations',
                    'Location-level vendor management',
                    'Corporate-approved vendor lists',
                    'Automated compliance enforcement'
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
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>Location: Downtown</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>12 vendors tracked</div>
                    </div>
                    <div className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-compliant)', fontWeight: 500 }}>
                      Compliant
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                    <div>
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>Location: Westside</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>8 vendors tracked</div>
                    </div>
                    <div className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-expiring)', fontWeight: 500 }}>
                      1 At Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 rounded-xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-5xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>50+</div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Franchise locations managed</div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-subtle)', fontWeight: 600 }}>
                      Consistent standards
                    </div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      Brand protection through compliance
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="mb-3 text-2xl" style={{ fontWeight: 600 }}>
                  Corporate oversight with local control
                </h3>
                <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Enable franchisees to manage their vendors while corporate maintains visibility, enforces standards, and generates network-wide compliance reports.
                </p>
                <ul className="space-y-3">
                  {[
                    'Role-based access for corporate and franchisees',
                    'Network-wide compliance reporting',
                    'Standardized insurance requirements',
                    'Location-specific vendor permissions'
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
          <h2 className="mb-4 text-3xl md:text-5xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Ready to unify franchise compliance?
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
            Join franchise networks that have centralized vendor tracking across all locations.
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
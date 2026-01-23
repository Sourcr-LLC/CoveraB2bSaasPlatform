import { Link } from 'react-router';
import { Truck, CheckCircle, Shield, ArrowRight, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesLogistics() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Logistics & Warehousing Vendor Compliance Software | Fleet COI Tracking - Covera"
        description="Monitor driver, carrier, and warehouse vendor insurance in real time across logistics operations. Track commercial auto insurance, cargo insurance, and contractor compliance for transportation and warehousing companies."
        keywords="logistics vendor compliance, warehouse compliance software, fleet insurance tracking, carrier COI management, transportation vendor tracking, logistics compliance software, warehouse vendor management, fleet compliance tracking"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Logistics & Warehousing Vendor Compliance",
          "description": "Vendor compliance and COI tracking software built for logistics companies, freight carriers, and warehouse operations",
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
                "name": "Logistics & Warehousing",
                "item": "https://covera.co/industries/logistics"
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
              Vendor compliance for logistics <span className="text-[#3A4F6A]">& warehousing operations</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Track driver insurance, carrier certificates, and warehouse vendor compliance in real time. Eliminate manual tracking and ensure continuous coverage across your logistics network.
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
        </div>
      </section>

      {/* Key Challenges */}
      <section style={{ backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Logistics operations demand continuous compliance
            </h2>
            <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Transportation companies, freight carriers, and warehouse operators work with drivers, independent contractors, maintenance vendors, and specialized service providers. Each requires proper commercial insurance and compliance documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Truck className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Fleet & carrier tracking</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Monitor commercial auto insurance, cargo insurance, and liability coverage for all drivers and carriers in your network.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Clock className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Real-time visibility</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Track compliance status across warehouses, distribution centers, and transportation hubs from a single dashboard.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Shield className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Risk mitigation</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Prevent uninsured operations with automated alerts and instant compliance verification for all vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Built for logistics operations teams
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h3 className="mb-3 text-xl md:text-2xl" style={{ fontWeight: 600 }}>
                  Automated fleet compliance
                </h3>
                <p className="mb-4 text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Monitor all carriers, drivers, and transportation vendors automatically. Track commercial auto insurance, cargo coverage, and liability certificates in real time.
                </p>
                <ul className="space-y-3">
                  {[
                    'Real-time driver and carrier compliance status',
                    'Commercial auto insurance tracking',
                    'Cargo and liability coverage monitoring',
                    'Multi-location warehouse visibility'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                      <span className="text-sm md:text-base" style={{ color: 'var(--foreground)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border p-6 md:p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                    <div>
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>FastFleet Carriers</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Commercial transportation</div>
                    </div>
                    <div className="px-2.5 md:px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-compliant)', fontWeight: 500 }}>
                      Compliant
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                    <div>
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>Express Logistics Inc</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Freight carrier</div>
                    </div>
                    <div className="px-2.5 md:px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-expiring)', fontWeight: 500 }}>
                      Expiring Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1 rounded-xl border p-6 md:p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl md:text-5xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>$180M+</div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Coverage tracked across fleet</div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-subtle)', fontWeight: 600 }}>
                      Zero compliance gaps
                    </div>
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      Automated alerts prevent uninsured operations
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="mb-3 text-xl md:text-2xl" style={{ fontWeight: 600 }}>
                  Continuous coverage verification
                </h3>
                <p className="mb-4 text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Prevent gaps in coverage with automated tracking, instant alerts, and real-time compliance verification across your entire logistics network.
                </p>
                <ul className="space-y-3">
                  {[
                    'Automated expiration alerts and reminders',
                    'Instant compliance status for all vendors',
                    'Commercial insurance requirement tracking',
                    'Audit-ready documentation and reports'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                      <span className="text-sm md:text-base" style={{ color: 'var(--foreground)' }}>{item}</span>
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
            Ready to automate <span className="text-[#3A4F6A]">fleet compliance?</span>
          </h2>
          <p className="text-sm md:text-lg mb-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
            Join logistics companies that have eliminated manual carrier tracking and coverage gaps.
          </p>
          <Link 
            to="/login"
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
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
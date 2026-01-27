import { Link } from 'react-router';
import { Hospital, CheckCircle, Shield, ArrowRight, TrendingUp, Users, FileCheck } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesHealthcare() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="page-root min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Healthcare Vendor Compliance Software | Medical Facility COI Tracking - Covera"
        description="Ensure vendor compliance across healthcare facilities and medical clinics. Track service provider insurance certificates, manage contractor compliance, and maintain audit-ready documentation for regulatory reviews."
        keywords="healthcare vendor compliance, medical facility compliance software, clinic vendor tracking, healthcare COI management, medical contractor insurance, hospital vendor compliance, healthcare facility management"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Healthcare & Medical Facility Vendor Compliance",
          "description": "Vendor compliance and COI tracking software built for healthcare organizations, medical clinics, and hospital facilities",
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
                "name": "Healthcare & Clinics",
                "item": "https://covera.co/industries/healthcare"
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
              Vendor compliance for healthcare facilities <span className="text-[#3A4F6A]">& medical clinics</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Maintain regulatory compliance and ensure vendor insurance coverage across all medical facilities with automated tracking, instant alerts, and audit-ready documentation.
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

        {/* Key Challenges */}
        <section className="section section-padding py-20" style={{ backgroundColor: 'var(--panel)' }}>
          <div className="w-full">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
                Healthcare compliance requirements demand precision
              </h2>
              <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Medical facilities work with cleaning services, medical equipment vendors, maintenance contractors, and specialized service providers. Each requires proper insurance coverage and compliance documentation for regulatory reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="p-5 md:p-6 rounded-2xl border hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: '#f1f5f9' }}>
                <Shield className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
                <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Regulatory compliance</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Meet HIPAA, OSHA, and state healthcare regulations with complete vendor documentation and audit trails.
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-2xl border hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: '#f1f5f9' }}>
                <Users className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
                <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Multiple facility locations</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Track vendor compliance across multiple clinics, outpatient centers, and healthcare facilities from one dashboard.
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-2xl border hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: '#f1f5f9' }}>
                <FileCheck className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
                <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Audit preparation</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Generate comprehensive compliance reports instantly for internal audits, regulatory reviews, and accreditation processes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="section section-padding py-20 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="w-full">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
                Built for healthcare operations teams
              </h2>
            </div>

            <div className="space-y-12 md:space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h3 className="mb-3 text-xl md:text-2xl" style={{ fontWeight: 600 }}>
                    Automated vendor tracking
                  </h3>
                  <p className="mb-4 text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    Monitor all medical facility vendors automatically. Track cleaning services, medical equipment providers, maintenance contractors, and specialized healthcare vendors.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Real-time compliance status for all vendors',
                      'Automated expiration tracking and alerts',
                      'Vendor-specific insurance requirements',
                      'Multi-location visibility across facilities'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                        <span className="text-sm md:text-base" style={{ color: 'var(--foreground)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border p-6 md:p-8" style={{ backgroundColor: 'var(--card)', borderColor: '#f1f5f9' }}>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between p-3 md:p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                      <div>
                        <div className="text-sm mb-1" style={{ fontWeight: 600 }}>CleanMed Services</div>
                        <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Facility cleaning</div>
                      </div>
                      <div className="px-2.5 md:px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-compliant)', fontWeight: 500 }}>
                        Compliant
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 md:p-4 rounded-lg" style={{ backgroundColor: 'var(--panel)' }}>
                      <div>
                        <div className="text-sm mb-1" style={{ fontWeight: 600 }}>MedEquip Solutions</div>
                        <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Medical equipment</div>
                      </div>
                      <div className="px-2.5 md:px-3 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-expiring)', fontWeight: 500 }}>
                        Expiring Soon
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1 rounded-2xl border p-6 md:p-8" style={{ backgroundColor: 'var(--card)', borderColor: '#f1f5f9' }}>
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-4xl md:text-5xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>98.7%</div>
                      <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Compliance rate maintained</div>
                    </div>
                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-subtle)', fontWeight: 600 }}>
                        Audit-ready reports
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        Export comprehensive documentation anytime
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="mb-3 text-xl md:text-2xl" style={{ fontWeight: 600 }}>
                    Regulatory compliance confidence
                  </h3>
                  <p className="mb-4 text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    Meet healthcare regulatory requirements with complete vendor documentation, automated compliance tracking, and instant audit-ready exports.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'HIPAA and OSHA compliance documentation',
                      'State healthcare regulation adherence',
                      'Accreditation-ready vendor reports',
                      'Complete audit trail for all vendors'
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
        <section className="section-cta section-padding border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
              Ready to automate healthcare <span className="text-[#3A4F6A]">vendor compliance?</span>
            </h2>
            <p className="text-sm md:text-lg mb-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Join healthcare facilities that have eliminated manual vendor tracking and audit stress.
            </p>
            <Link 
              to="/login"
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 500 }}
            >
              Start Free 7-Day Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}
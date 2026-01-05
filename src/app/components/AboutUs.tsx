import { Link } from 'react-router-dom';
import { Target, Users, Zap, Shield, ArrowRight, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import DemoModal from './DemoModal';

export default function AboutUs() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="About Covera | Vendor Compliance Without the Chaos"
        description="Covera helps businesses stay compliant with vendor insurance without spreadsheets, manual follow ups, or compliance chaos. Operations-first platform for automated COI tracking and vendor compliance management."
        keywords="about Covera, vendor compliance software, COI tracking platform, insurance compliance automation, vendor management company, compliance operations software"
        schema={{
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
                "item": "https://getcovera.co"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About Us",
                "item": "https://getcovera.co/about"
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
              About Covera
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Covera helps businesses stay compliant with vendor insurance without spreadsheets, manual follow ups, or compliance chaos.
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

      {/* Introduction */}
      <section style={{ backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-xl leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
              We built Covera for operations teams who manage third party vendors and need clear, reliable insurance compliance without becoming insurance experts.
            </p>
            <p className="text-base md:text-xl leading-relaxed" style={{ color: 'var(--foreground)' }}>
              Our platform automatically tracks Certificates of Insurance, flags risk in real time, and keeps teams audit ready with confidence.
            </p>
            <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg md:text-xl" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                Covera is operations first, not insurance first.
              </p>
              <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                We focus on clarity, automation, and accountability so teams can stop chasing documents and start focusing on running their business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Why We Exist
            </h2>
            <p className="text-xl md:text-2xl mb-6" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              Vendor insurance compliance is broken.
            </p>
            <p className="text-sm md:text-lg leading-relaxed mb-4" style={{ color: 'var(--foreground-muted)' }}>
              Too many businesses still rely on spreadsheets, inbox searches, and manual reviews to manage COIs. That leads to expired coverage, missed requirements, delayed projects, and unnecessary risk exposure.
            </p>
            <p className="text-sm md:text-lg leading-relaxed mb-4" style={{ color: 'var(--foreground-muted)' }}>
              Covera exists to remove that friction entirely.
            </p>
            <p className="text-base md:text-xl" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              We believe compliance should be simple, transparent, and built into daily operations—not a last minute scramble during audits or incidents.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section style={{ backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              What We Do
            </h2>
            <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Covera provides a centralized platform to manage vendor insurance compliance across your entire organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Track COI status in real time</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Monitor all vendor Certificate of Insurance statuses automatically across your entire organization.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Zap className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Automated vendor reminders</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Automatically remind vendors before coverage expires, eliminating manual follow-up emails.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <CheckCircle className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Clear compliance visibility</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                See compliant, at-risk, and non-compliant vendors without interpretation or guesswork.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Shield className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Instant audit-ready reports</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Generate comprehensive compliance reports instantly for audits, reviews, or stakeholder updates.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-base md:text-lg" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              Everything lives in one place and updates automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Who We Serve
            </h2>
            <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Covera is trusted by operations and compliance teams managing third party risk across multiple industries:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            {[
              'Property management',
              'Construction and subcontractor networks',
              'Healthcare and medical services',
              'Logistics and transportation',
              'Retail and franchise operations',
              'Government and municipal services'
            ].map((industry, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border flex items-center gap-3"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>{industry}</span>
              </div>
            ))}
          </div>

          <p className="text-base md:text-xl" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
            If your business relies on vendors, contractors, or partners, Covera helps protect your operations.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section style={{ backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Our Approach
            </h2>
            <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              We believe great compliance software should be:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Lightbulb className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Easy to use without training</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Intuitive interface that teams can start using immediately without lengthy onboarding or training sessions.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <CheckCircle className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Clear without legal interpretation</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Plain language compliance status that anyone can understand without insurance expertise.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Zap className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Automated without losing control</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Smart automation that handles routine tasks while keeping you informed and in control.
              </p>
            </div>

            <div className="p-5 md:p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4" style={{ color: 'var(--primary)' }} />
              <h3 className="mb-2 text-base md:text-lg" style={{ fontWeight: 600 }}>Built for scale</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Designed to grow with your business as your vendor network expands across locations and teams.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-base md:text-lg" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              Covera is designed to work quietly in the background, giving you confidence without adding work.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6" style={{ color: 'var(--primary)' }} />
            <h2 className="mb-6 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Our Mission
            </h2>
            <p className="text-lg md:text-2xl mb-6" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              Our mission is to eliminate compliance chaos and replace it with clarity.
            </p>
            <p className="text-sm md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              We help teams reduce risk, save time, and operate with confidence by making vendor insurance compliance simple, reliable, and automatic.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Ready to eliminate compliance chaos?
            </h2>
            <p className="text-sm md:text-lg mb-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Join operations teams who've replaced spreadsheets with confidence.
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

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
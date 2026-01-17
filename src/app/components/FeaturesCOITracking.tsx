import { Link } from 'react-router';
import { FileCheck, ArrowRight } from 'lucide-react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import MarketingFeatures from './MarketingFeatures';

export default function FeaturesCOITracking() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Certificate of Insurance (COI) Tracking Software | Automated COI Management - Covera"
        description="Automate certificate of insurance tracking with Covera. Upload COIs, get expiration alerts, and maintain vendor compliance with enterprise COI management software."
        keywords="COI tracking software, certificate of insurance tracking, automated COI management, insurance certificate software, COI expiration alerts, vendor COI tracking, certificate of insurance automation"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Certificate of Insurance Tracking",
          "description": "Automated COI tracking and management software",
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
                "name": "Features",
                "item": "https://covera.co/features"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "COI Tracking",
                "item": "https://covera.co/features/coi-tracking"
              }
            ]
          }
        }}
      />

      <LandingNav />

      <main className="flex-1">
        {/* Spacing for fixed nav */}
        <div className="h-24 md:h-28"></div>

        {/* Hero */}
        <section className="border-b pt-16 md:pt-20" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                <FileCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Feature Spotlight</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
                Automated Certificate <span className="text-[#3A4F6A]">of Insurance Tracking</span>
              </h1>
              
              <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
                Never miss an insurance renewal again. Upload COIs, track expiration dates, and automatically send renewal reminders to vendors. Enterprise-grade COI management in one centralized platform.
              </p>
              
              <Link 
                to="/login"
                className="px-8 py-4 rounded-lg text-base inline-flex items-center gap-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                Start free trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* New Premium Features Section */}
        <MarketingFeatures />

        {/* Benefits */}
        <section className="py-20 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              Why Automated COI Tracking Matters
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  stat: '75%',
                  label: 'Time Saved',
                  description: 'Eliminate manual tracking and email follow-ups'
                },
                {
                  stat: '100%',
                  label: 'Compliance Rate',
                  description: 'Never work with uninsured vendors again'
                },
                {
                  stat: '0',
                  label: 'Missed Renewals',
                  description: 'Automatic reminders ensure timely renewals'
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
                  <div className="text-5xl mb-3" style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.stat}</div>
                  <div className="text-xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.label}</div>
                  <p style={{ color: 'var(--foreground-muted)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6">
              Start Tracking COIs <span className="text-[#3A4F6A]">Automatically</span>
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
              Join companies managing thousands of insurance certificates with Covera
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
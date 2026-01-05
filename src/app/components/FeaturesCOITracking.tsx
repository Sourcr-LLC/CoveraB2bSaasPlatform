import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle, ArrowRight, Bell, Calendar, Shield, Upload, Download } from 'lucide-react';
import SEO from './SEO';
import LandingNav from './LandingNav';

export default function FeaturesCOITracking() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Certificate of Insurance (COI) Tracking Software | Automated COI Management - Covera"
        description="Automate certificate of insurance tracking with Covera. Upload COIs, get expiration alerts, and maintain vendor compliance with enterprise COI management software."
        keywords="COI tracking software, certificate of insurance tracking, automated COI management, insurance certificate software, COI expiration alerts, vendor COI tracking, certificate of insurance automation"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Certificate of Insurance Tracking",
          "description": "Automated COI tracking and management software"
        }}
      />

      <LandingNav />

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
            
            <h1 className="mb-6" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, color: 'var(--foreground)' }}>
              Automated <span style={{ color: 'var(--primary)' }}>Certificate of Insurance</span> Tracking
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

      {/* How It Works */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              How COI Tracking Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Upload COIs',
                description: 'Drag and drop insurance certificates or forward them via email',
                icon: Upload
              },
              {
                step: '2',
                title: 'Auto-Extract Data',
                description: 'System automatically reads policy numbers, coverage limits, and expiration dates',
                icon: FileCheck
              },
              {
                step: '3',
                title: 'Set Reminders',
                description: 'Configure automatic email reminders 30, 14, and 7 days before expiration',
                icon: Bell
              },
              {
                step: '4',
                title: 'Stay Compliant',
                description: 'Monitor compliance status and generate reports for audits',
                icon: Shield
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="text-sm mb-2" style={{ color: 'var(--primary)', fontWeight: 600 }}>STEP {item.step}</div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</h3>
                <p style={{ color: 'var(--foreground-muted)' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Powerful COI Management Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Centralized COI Repository',
                description: 'Store all insurance certificates in one secure, searchable location with unlimited storage'
              },
              {
                title: 'Expiration Timeline View',
                description: 'See all expiring COIs at a glance with 7, 14, and 30-day expiration timelines'
              },
              {
                title: 'Automated Email Reminders',
                description: 'Automatic renewal reminders sent directly to vendors before their insurance expires'
              },
              {
                title: 'Coverage Requirements Tracking',
                description: 'Set minimum coverage requirements and verify vendor insurance meets your standards'
              },
              {
                title: 'Bulk Upload & Export',
                description: 'Upload multiple COIs at once and export compliance reports for stakeholders'
              },
              {
                title: 'Additional Insured Verification',
                description: 'Ensure your organization is listed as additional insured on all vendor policies'
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
          <h2 className="text-3xl md:text-4xl mb-6" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Start Tracking COIs Automatically
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
    </div>
  );
}
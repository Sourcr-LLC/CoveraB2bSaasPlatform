import { Link } from 'react-router';
import { Building2, CheckCircle, Shield, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import SEO, { SEO_CONFIGS } from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function SolutionsPropertyManagement() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="page-root min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="section section-hero section-padding pt-32 md:pt-40 border-b border-slate-200">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor Compliance Management for <span className="text-[#3A4F6A]">Property Managers</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto">
              Track contractor insurance certificates, manage service provider compliance, and protect your properties with automated COI tracking. Built for residential and commercial property management teams.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-md shadow-[var(--primary)]/20 hover:shadow-lg hover:shadow-[var(--primary)]/30 flex items-center justify-center gap-2"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Schedule demo
              </button>
            </div>
          </div>
        </section>

        {/* Key Challenges Section */}
        <section className="section section-padding py-20 bg-white border-b border-slate-100">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Challenges Property Managers Face
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
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
                  className="rounded-2xl border border-slate-100 p-8 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 text-[#3A4F6A]">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section section-padding py-20 bg-[#fafaf9] border-b border-slate-200">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
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
                  description: 'Never miss an insurance renewal with automatic email reminders sent to contractors before expiration',
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
                  className="rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-[#3A4F6A]">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{item.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="section section-padding py-20 bg-white border-b border-slate-100">
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-12 text-center">
              Perfect for Every Property Type
            </h2>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
                  className="rounded-xl border border-slate-100 p-5 flex items-center gap-3 hover:bg-slate-50 transition-colors duration-200"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-[#3A4F6A]" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-cta section-padding bg-[#fafaf9]">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
              Start Managing Property <span className="text-[#3A4F6A]">Compliance Today</span>
            </h2>
            <p className="text-xl mb-10 text-slate-500 leading-relaxed">
              Join property management companies using Covera to track 1000+ contractors
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all bg-[#3A4F6A] text-white hover:bg-[#2c3e53] font-medium shadow-xl shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 hover:-translate-y-1"
              >
                Start free trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white font-medium"
              >
                Schedule demo
              </button>
            </div>
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
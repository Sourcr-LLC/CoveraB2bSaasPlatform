import { Link } from 'react-router';
import { Building2, CheckCircle, Shield, ArrowRight, FileCheck, Users, Scale } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesGovernment() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Government Vendor Compliance Software | Public Sector Contract Management - Covera"
        description="Vendor compliance and insurance tracking for government agencies, municipalities, and public sector organizations. Track contractor COIs, verify vendor compliance, and ensure regulatory adherence."
        keywords="government vendor compliance, public sector contract management, municipal vendor tracking, government COI management, public procurement compliance, contractor compliance software, government vendor management"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Government & Public Sector Compliance Solutions",
          "description": "Vendor compliance and insurance tracking software for government agencies and public sector organizations",
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
                "name": "Government & Public Sector",
                "item": "https://covera.co/industries/government"
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
              Vendor compliance for government <span className="text-[#3A4F6A]">agencies & public sector</span>
            </h1>
            
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Streamline vendor management for municipalities, counties, state agencies, and federal departments. Track contractor insurance, verify compliance, and maintain audit-ready documentation for all public sector procurement.
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
              Public Sector Compliance Challenges
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              Government agencies face unique vendor management requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Regulatory Requirements',
                description: 'Complex federal, state, and local compliance regulations across multiple vendor categories',
                icon: Shield,
                color: 'var(--status-non-compliant)'
              },
              {
                title: 'Audit Preparation',
                description: 'Constant readiness for audits, FOIA requests, and public disclosure requirements',
                icon: FileCheck,
                color: 'var(--status-at-risk)'
              },
              {
                title: 'Budget Constraints',
                description: 'Limited staff resources managing high volumes of vendors and contractors',
                icon: Scale,
                color: 'var(--status-at-risk)'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-2xl border p-8 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: '#f1f5f9'
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
              Built for Public Sector Compliance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Centralized Vendor Registry',
                description: 'Maintain a complete database of all contractors, suppliers, and service providers with comprehensive compliance documentation'
              },
              {
                title: 'Automated Compliance Tracking',
                description: 'Monitor insurance certificates, licenses, certifications, and all required documentation with automated expiration alerts'
              },
              {
                title: 'Audit-Ready Documentation',
                description: 'Generate instant reports for audits, public records requests, and regulatory compliance reviews with complete historical tracking'
              },
              {
                title: 'Department Collaboration',
                description: 'Enable multiple departments to access vendor information while maintaining role-based access controls and security'
              },
              {
                title: 'Procurement Integration',
                description: 'Verify vendor compliance before contract awards and during ongoing service delivery'
              },
              {
                title: 'Risk Management',
                description: 'Identify non-compliant vendors, track incidents, and protect against liability exposure with real-time monitoring'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-2xl border p-8 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: '#f1f5f9'
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

      {/* Use Cases */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Trusted by Government Agencies
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Municipal Government',
              'County Departments',
              'State Agencies',
              'Federal Contractors',
              'Public Works Departments',
              'Parks & Recreation',
              'Public Safety',
              'Transportation Authorities',
              'Public Utilities',
              'School Districts',
              'Public Housing Authorities',
              'Emergency Services'
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-lg border p-6 flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <Building2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
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
            Public Sector Benefits
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Scale,
                title: 'Save Staff Time',
                description: 'Reduce manual tracking by 80% with automated compliance monitoring and vendor notifications'
              },
              {
                icon: Shield,
                title: 'Reduce Risk',
                description: 'Protect taxpayers and government assets with comprehensive vendor compliance verification'
              },
              {
                icon: FileCheck,
                title: 'Improve Transparency',
                description: 'Maintain complete audit trails and respond instantly to public records requests'
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
            Modernize Your Vendor <span className="text-[#3A4F6A]">Management</span>
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
            Join government agencies streamlining compliance with Covera
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
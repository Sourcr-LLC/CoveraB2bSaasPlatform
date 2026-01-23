import { Link } from 'react-router';
import { GraduationCap, CheckCircle, Shield, ArrowRight, Users, Building2, FileCheck } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
import DemoModal from './DemoModal';

export default function IndustriesEducation() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Education Vendor Compliance Software | School & University Contractor Management - Covera"
        description="Vendor compliance and insurance tracking for schools, universities, and educational institutions. Track contractor COIs, ensure student safety, and manage campus vendor compliance."
        keywords="education vendor compliance, school contractor management, university vendor tracking, campus COI management, educational institution compliance, school vendor management software"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Education Compliance Solutions",
          "description": "Vendor compliance and insurance tracking software for schools, universities, and educational institutions",
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
                "name": "Education",
                "item": "https://covera.co/industries/education"
              }
            ]
          }
        }}
      />

      <LandingNav />

      <main className="flex-1">
        {/* Spacing for fixed nav */}
        <div className="h-24 md:h-28"></div>

        {/* Hero Section */}
        <section className="border-b pt-20 md:pt-24" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
                Vendor compliance for schools, universities <span className="text-[#3A4F6A]">& educational institutions</span>
              </h1>
              
              <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
                Protect students, staff, and campus facilities with comprehensive vendor compliance tracking. Manage contractor insurance, verify background checks, and ensure all campus vendors meet safety and compliance requirements.
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

        {/* Challenges Section */}
        <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                Campus Safety & Compliance Risks
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
                Educational institutions face unique vendor management challenges
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Student Safety',
                  description: 'Contractors working on campus without proper insurance or background verification',
                  icon: Shield,
                  color: 'var(--status-non-compliant)'
                },
                {
                  title: 'Multi-Department Complexity',
                  description: 'Facilities, athletics, housing, and academic departments all managing separate vendors',
                  icon: Users,
                  color: 'var(--status-at-risk)'
                },
                {
                  title: 'Liability Exposure',
                  description: 'Institutional risk from non-compliant vendors during campus events and construction projects',
                  icon: Shield,
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
                Built for Educational Institutions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Campus-Wide Vendor Database',
                  description: 'Centralize all contractor and vendor information across facilities, athletics, food service, IT, and academic departments'
                },
                {
                  title: 'Safety Compliance Tracking',
                  description: 'Monitor insurance certificates, background checks, safety certifications, and specialized credentials for campus work'
                },
                {
                  title: 'Department Access Control',
                  description: 'Enable multiple departments to manage their vendors while maintaining centralized oversight and compliance standards'
                },
                {
                  title: 'Event Vendor Management',
                  description: 'Track compliance for athletic events, conferences, campus activities, and visiting contractor programs'
                },
                {
                  title: 'Construction Project Tracking',
                  description: 'Manage compliance for capital projects, renovations, and ongoing maintenance contractors with project-specific requirements'
                },
                {
                  title: 'Automated Notifications',
                  description: 'Receive alerts for expiring insurance, missing documentation, and upcoming compliance renewals across all departments'
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

        {/* Institution Types */}
        <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              For All Educational Institutions
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                'K-12 School Districts',
                'Private Schools',
                'Universities & Colleges',
                'Community Colleges',
                'Technical Schools',
                'Charter Schools',
                'Student Housing',
                'Athletic Departments',
                'Research Facilities',
                'Campus Recreation',
                'Dining Services',
                'Campus Security'
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-xl border p-6 flex items-center gap-3 hover:shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: '#f1f5f9'
                  }}
                >
                  <GraduationCap className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
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
              Educational Institution Benefits
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Enhanced Campus Safety',
                  description: 'Ensure all contractors meet safety and compliance requirements before accessing campus facilities'
                },
                {
                  icon: Building2,
                  title: 'Streamlined Operations',
                  description: 'Reduce administrative burden across departments with centralized vendor management'
                },
                {
                  icon: FileCheck,
                  title: 'Risk Mitigation',
                  description: 'Protect students, staff, and institutional assets with comprehensive compliance verification'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border p-8 text-center hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: '#f1f5f9'
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
              Protect Your Campus <span className="text-[#3A4F6A]">Community</span>
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
              Join educational institutions ensuring vendor compliance with Covera
            </p>
            <Link 
              to="/login"
              className="px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              Start 7-Day Free Trial
              <ArrowRight className="w-5 h-5" />
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
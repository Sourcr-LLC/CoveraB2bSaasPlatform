import { Link } from 'react-router-dom';
import { Building2, CheckCircle, Shield, ArrowRight, TrendingUp, Users, Clock, AlertTriangle, FileCheck } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import DemoModal from './DemoModal';

export default function SolutionsConstruction() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Construction Vendor Compliance Software | Subcontractor Insurance Tracking - Covera"
        description="Manage subcontractor compliance for construction projects. Track contractor insurance certificates, verify coverage requirements, and reduce project risk with automated COI management."
        keywords="construction compliance software, subcontractor insurance tracking, construction COI management, contractor compliance software, general contractor software, construction vendor management, subcontractor COI tracking"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Construction Compliance Solutions",
          "description": "Subcontractor compliance and insurance tracking software for general contractors and construction firms"
        }}
      />

      <LandingNav />

      {/* Hero Section */}
      <section className="border-b pt-20 md:pt-24" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-6xl" style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
              Subcontractor Compliance for <span style={{ color: 'var(--primary)' }}>General Contractors</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Track subcontractor insurance certificates, verify coverage requirements, and protect your projects with automated COI management. Built for general contractors, construction managers, and project teams.
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

      {/* Risks Section */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
              Construction Project Risks
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              Non-compliant subcontractors expose your projects to significant liability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expired Coverage',
                description: 'Subcontractors working on-site with lapsed insurance policies',
                icon: AlertTriangle,
                color: 'var(--status-non-compliant)'
              },
              {
                title: 'Inadequate Limits',
                description: 'Insurance coverage that doesn\'t meet project requirements or contract terms',
                icon: Shield,
                color: 'var(--status-at-risk)'
              },
              {
                title: 'Project Delays',
                description: 'Work stoppages due to missing or non-compliant insurance certificates',
                icon: Users,
                color: 'var(--status-at-risk)'
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
              Built for Construction Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Project-Based Organization',
                description: 'Organize subcontractors by project, trade, or contract with custom workflows for each construction site'
              },
              {
                title: 'Coverage Verification',
                description: 'Automatically verify that insurance coverage meets your project-specific requirements including General Liability, Workers Comp, and Auto'
              },
              {
                title: 'Pre-Qualification Tracking',
                description: 'Track pre-qualification status, safety records, and compliance documentation for all subcontractors'
              },
              {
                title: 'Automated Alerts',
                description: 'Get instant notifications when subcontractor insurance is expiring or falls out of compliance'
              },
              {
                title: 'Audit-Ready Reports',
                description: 'Generate compliance reports for project owners, insurance audits, and regulatory requirements'
              },
              {
                title: 'Mobile Access',
                description: 'Field teams can verify compliance status and request COIs directly from the job site'
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

      {/* Project Types */}
      <section className="py-20 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12 text-center" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            For All Construction Project Types
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Commercial Construction',
              'Residential Development',
              'Infrastructure Projects',
              'Renovation & Remodeling',
              'Industrial Construction',
              'Public Works Projects'
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-lg border p-6 flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <FileCheck className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--foreground)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl mb-6" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Protect Your Construction Projects
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--foreground-muted)' }}>
            Join general contractors tracking subcontractor compliance with Covera
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

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
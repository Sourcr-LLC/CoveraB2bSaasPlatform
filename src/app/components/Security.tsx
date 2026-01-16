import { Link } from 'react-router';
import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, Users } from 'lucide-react';
import { useEffect } from 'react';
import LandingNav from './LandingNav';
import Footer from './Footer';

export default function Security() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LandingNav />

      {/* Spacing for fixed nav */}
      <div className="h-24 md:h-28"></div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-16 md:py-24">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs mb-6" style={{ 
            borderColor: 'var(--border)', 
            color: 'var(--foreground-subtle)',
            fontWeight: 500,
            backgroundColor: 'var(--card)'
          }}>
            <Shield className="w-3.5 h-3.5" style={{ color: 'var(--status-compliant)' }} />
            SOC 2 TYPE II CERTIFIED
          </div>
          
          <h1 className="mb-6 text-4xl md:text-5xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Enterprise-grade security
          </h1>
          
          <p className="text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
            Covera is built with security at its core. We protect your sensitive compliance data with industry-leading security practices trusted by enterprise compliance teams.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Lock,
              title: 'Bank-grade encryption',
              description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your vendor and insurance data is protected with the same standards used by financial institutions.'
            },
            {
              icon: Shield,
              title: 'SOC 2 Type II certified',
              description: 'We maintain SOC 2 Type II compliance, demonstrating our commitment to security, availability, and confidentiality through independent third-party audits.'
            },
            {
              icon: Eye,
              title: 'Continuous monitoring',
              description: '24/7 security monitoring with automated threat detection and response. Our systems are continuously scanned for vulnerabilities and suspicious activity.'
            },
            {
              icon: Server,
              title: 'Secure infrastructure',
              description: 'Hosted on enterprise-grade cloud infrastructure with automatic failover, redundancy, and daily encrypted backups. 99.9% uptime SLA for Enterprise customers.'
            },
            {
              icon: Users,
              title: 'Access controls',
              description: 'Role-based access controls (RBAC), multi-factor authentication (MFA), and single sign-on (SSO) support. You control exactly who can access your data.'
            },
            {
              icon: FileCheck,
              title: 'Compliance ready',
              description: 'Built to support compliance with GDPR, CCPA, HIPAA, and other regulatory requirements. Audit logs track all data access and changes.'
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <feature.icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Details */}
        <div className="space-y-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Data Privacy & Protection
            </h2>
            <p className="mb-3">
              Your data belongs to you. We never sell, share, or use your data for any purpose other than providing our service. Our commitment to data privacy includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data is logically isolated per customer with strict access controls</li>
              <li>Regular penetration testing and security assessments</li>
              <li>Employee background checks and security training</li>
              <li>Data processing agreements (DPAs) available for enterprise customers</li>
              <li>Right to data portability and deletion upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Infrastructure & Availability
            </h2>
            <p className="mb-3">
              Covera runs on enterprise-grade infrastructure designed for reliability and security:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Multi-region deployment with automatic failover</li>
              <li>Distributed denial-of-service (DDoS) protection</li>
              <li>Daily encrypted backups with point-in-time recovery</li>
              <li>Disaster recovery plan tested quarterly</li>
              <li>99.9% uptime SLA for Enterprise plans</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Vendor Portal Security
            </h2>
            <p>
              Our secure vendor portal uses magic link authentication to eliminate password risks. Each upload link is:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Single-use and time-limited to prevent unauthorized access</li>
              <li>Cryptographically signed to prevent tampering</li>
              <li>Scoped to specific vendors with no access to other data</li>
              <li>Tracked with audit logs showing exactly who uploaded what and when</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Compliance Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  SOC 2 Type II
                </div>
                <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                  Security, availability, and confidentiality
                </div>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  GDPR Compliant
                </div>
                <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                  EU data protection standards
                </div>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  CCPA Compliant
                </div>
                <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                  California consumer privacy
                </div>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  HIPAA Ready
                </div>
                <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                  Healthcare data protection
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Incident Response
            </h2>
            <p>
              In the unlikely event of a security incident, we have a comprehensive incident response plan:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Immediate containment and investigation</li>
              <li>Notification to affected customers within 72 hours</li>
              <li>Transparent communication throughout the resolution process</li>
              <li>Post-incident review and preventive measures</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Security Documentation
            </h2>
            <p>
              Enterprise customers can request additional security documentation including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>SOC 2 Type II report</li>
              <li>Penetration test results</li>
              <li>Data processing agreement (DPA)</li>
              <li>Business associate agreement (BAA) for HIPAA</li>
              <li>Security questionnaire responses</li>
            </ul>
            <p className="mt-4">
              Contact us at security@covera.co for more information.
            </p>
          </section>

          <section className="pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Report a Vulnerability
            </h2>
            <p>
              We welcome responsible disclosure of security vulnerabilities. If you discover a security issue, please email security@covera.co with details. We commit to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Acknowledge your report within 24 hours</li>
              <li>Provide an estimated timeline for resolution</li>
              <li>Keep you informed of our progress</li>
              <li>Credit you for the discovery (if desired) once resolved</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
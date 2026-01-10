import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import LandingNav from './LandingNav';
import Footer from './Footer';

export default function PrivacyPolicy() {
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
        <h1 className="mb-8 text-4xl md:text-5xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        
        <div className="space-y-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          <div>
            <p className="mb-4 text-sm" style={{ color: 'var(--foreground-subtle)' }}>
              Last updated: January 2, 2026
            </p>
            <p>
              At Covera, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vendor compliance and insurance tracking platform.
            </p>
          </div>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, company name, and password</li>
              <li><strong>Vendor Data:</strong> Vendor names, contact information, insurance certificates, and compliance documents</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store full credit card numbers)</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including IP address, browser type, and access times</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              2. How We Use Your Information
            </h2>
            <p className="mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related notifications</li>
              <li>Send automated vendor reminders and compliance alerts</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              3. Information Sharing
            </h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With Your Consent:</strong> When you direct us to share information with third parties</li>
              <li><strong>Service Providers:</strong> With vendors who perform services on our behalf (e.g., hosting, payment processing, email delivery)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              4. Data Security
            </h2>
            <p className="mb-3">
              We implement industry-leading security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit using TLS and at rest using AES-256 encryption</li>
              <li><strong>SOC 2 Type II Compliance:</strong> We maintain SOC 2 Type II certification demonstrating our commitment to security</li>
              <li><strong>Access Controls:</strong> Role-based access controls and multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Continuous monitoring and regular security assessments</li>
              <li><strong>Secure Infrastructure:</strong> Data hosted on enterprise-grade cloud infrastructure with redundancy and backup</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              5. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. If you cancel your account, we will delete your data within 90 days, except where we are required to retain it for legal or regulatory purposes. You may request data deletion at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              6. Your Rights
            </h2>
            <p className="mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Data Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at privacy@getcovera.co
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              7. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar tracking technologies to improve your experience, analyze usage, and deliver relevant content. You can control cookies through your browser settings, but disabling cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              8. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              9. Children's Privacy
            </h2>
            <p>
              Covera is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the platform. Your continued use of Covera after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              11. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-3">
              Email: privacy@getcovera.co<br />
              Address: Covera Inc., Data Protection Officer
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
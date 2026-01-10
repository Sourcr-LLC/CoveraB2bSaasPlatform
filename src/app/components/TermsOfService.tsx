import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import LandingNav from './LandingNav';
import Footer from './Footer';

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        
        <div className="space-y-8 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          <div>
            <p className="mb-4 text-sm" style={{ color: 'var(--foreground-subtle)' }}>
              Last updated: January 2, 2026
            </p>
            <p>
              Welcome to Covera. By accessing or using our vendor compliance and insurance tracking platform, you agree to be bound by these Terms of Service.
            </p>
          </div>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              1. Service Description
            </h2>
            <p>
              Covera provides a cloud-based platform for managing vendor compliance, tracking certificates of insurance (COIs), and monitoring vendor documentation. Our service is designed for property managers, construction firms, healthcare groups, logistics companies, and franchises.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              2. Account Registration
            </h2>
            <p className="mb-3">
              To use Covera, you must create an account and provide accurate, complete information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your team members comply with these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              3. Subscription and Billing
            </h2>
            <p className="mb-3">
              Covera offers subscription-based pricing with a 7-day free trial period:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your trial begins when you create an account</li>
              <li>No credit card is required during the trial period</li>
              <li>After the trial, you will be charged monthly based on your selected plan</li>
              <li>Subscriptions automatically renew unless canceled</li>
              <li>You may cancel at any time from your account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              4. Acceptable Use
            </h2>
            <p className="mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Upload false, misleading, or fraudulent information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Resell or redistribute the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              5. Data and Privacy
            </h2>
            <p>
              We take data security seriously. Your use of Covera is also governed by our Privacy Policy, which describes how we collect, use, and protect your information. We implement industry-standard security measures including SOC 2 Type II compliance and bank-grade encryption.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              6. Intellectual Property
            </h2>
            <p>
              Covera and all related trademarks, logos, and content are owned by us or our licensors. You retain ownership of any data you upload to the platform. By using our service, you grant us a license to process your data solely to provide the service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              7. Limitation of Liability
            </h2>
            <p>
              Covera is provided "as is" without warranties of any kind. We are not responsible for any damages arising from your use of the service, including but not limited to data loss, business interruption, or compliance failures. Our total liability shall not exceed the amount you paid us in the 12 months preceding any claim.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              8. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms. Upon termination, you will lose access to your account and data. You may export your data before canceling your subscription.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you of material changes via email or through the platform. Continued use of Covera after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              10. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact us at legal@getcovera.co
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
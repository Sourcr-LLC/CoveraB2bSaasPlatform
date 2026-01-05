import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Shield, Building2, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import BlogFooter from './BlogFooter';
import DemoModal from './DemoModal';

export default function Pricing() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What\'s included in the 7-day free trial?',
      answer: 'Full access to all premium features with no credit card required. Add unlimited vendors, upload COIs, set up automated alerts, and explore the complete platform. No limitations, no strings attached.'
    },
    {
      question: 'How does the pre-authorization work?',
      answer: 'After your 7-day trial, we\'ll pre-authorize your payment method. You won\'t be charged until the trial ends. Cancel anytime during the trial with zero charges.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. Cancel your subscription at any time from your billing dashboard. No cancellation fees, no questions asked. Your data remains accessible for 30 days after cancellation.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees, ever. We believe in transparent pricing. What you see is what you pay – one simple monthly price for unlimited access.'
    },
    {
      question: 'Do you offer annual billing?',
      answer: 'Yes! Contact our sales team for annual billing options with additional savings. Perfect for organizations looking for predictable budgeting.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) securely processed through Stripe. For enterprise customers, we can arrange invoicing and ACH payments.'
    },
    {
      question: 'Can I get a custom plan for my organization?',
      answer: 'Yes! For organizations with unique requirements, high vendor volumes, or specific compliance needs, we offer custom enterprise plans. Schedule a call with our team to discuss your needs.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. You can export all vendor records, documents, and compliance reports during this time. After 30 days, data is permanently deleted per our security policy.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO
        title="Pricing - Simple, Transparent Vendor Compliance Software | Covera"
        description="One simple price for unlimited vendor compliance tracking. Start with a 7-day free trial. No setup fees, no contracts. Cancel anytime. Trusted by property managers, construction firms, and healthcare organizations."
        keywords="vendor compliance software pricing, COI tracking software cost, certificate of insurance software pricing, vendor management pricing, compliance tracking cost, property management software pricing"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Pricing",
          "description": "Transparent pricing for Covera's vendor compliance and insurance tracking platform",
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
                "name": "Pricing",
                "item": "https://getcovera.co/pricing"
              }
            ]
          }
        }}
      />

      <LandingNav />

      {/* Hero Section */}
      <section className="border-b pt-20 md:pt-24" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-6xl leading-tight md:leading-none" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Transparent pricing for every team
            </h1>
            <p className="text-sm sm:text-base md:text-xl leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Start with everything you need. Scale when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Core Plan */}
            <div 
              className="rounded-2xl border-2 p-10 relative"
              style={{ 
                borderColor: 'var(--primary)',
                backgroundColor: 'var(--card)',
                boxShadow: '0 8px 32px rgba(58, 79, 106, 0.12)'
              }}
            >
              <div 
                className="absolute -top-3 left-8 px-4 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }}
              >
                MOST POPULAR
              </div>

              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                    Core
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)', lineHeight: 1 }}>
                      $399
                    </span>
                    <span className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
                      /month
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    Everything most businesses actually need
                  </p>
                </div>

                <Link 
                  to="/login"
                  className="block w-full py-4 rounded-xl text-center transition-all mb-3"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--primary-foreground)', 
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(58, 79, 106, 0.2)'
                  }}
                >
                  Start free trial
                </Link>
                
                <p className="text-xs text-center" style={{ color: 'var(--foreground-subtle)' }}>
                  7-day free trial • No credit card required
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                {[
                  'Up to 150 vendors',
                  'COI uploads & storage',
                  'Automated reminders (30 / 14 / 7 days)',
                  'Compliance dashboard',
                  'High-risk & non-compliant tracking',
                  'Audit-ready exports (PDF / CSV)',
                  'Team access',
                  'Email support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-compliant)' }} />
                    <span style={{ color: 'var(--foreground)', fontWeight: 400 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div 
              className="rounded-2xl border p-10"
              style={{ 
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                    Enterprise
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>from</span>
                    <span style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)', lineHeight: 1 }}>
                      $1,200
                    </span>
                    <span className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
                      /month
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    For complex or regulated organizations
                  </p>
                </div>

                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="block w-full py-4 rounded-xl text-center transition-all mb-3"
                  style={{ 
                    border: '2px solid var(--border)',
                    color: 'var(--foreground)', 
                    fontWeight: 500
                  }}
                >
                  Contact sales
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--foreground-subtle)' }}>
                  Custom pricing • Dedicated support
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                {[
                  'Unlimited vendors',
                  'Multiple locations / entities',
                  'Custom compliance rules',
                  'Internal escalations',
                  'Dedicated onboarding',
                  'Priority support',
                  'Security & legal review'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-compliant)' }} />
                    <span style={{ color: 'var(--foreground)', fontWeight: 400 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--foreground)' }}>
              Frequently asked questions
            </h2>
            <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
              Everything you need to know about pricing and billing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-xl border overflow-hidden transition-all"
                style={{ 
                  borderColor: openFaqIndex === index ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: 'var(--card)'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-all"
                >
                  <span style={{ fontWeight: 500, color: 'var(--foreground)', flex: 1 }}>
                    {faq.question}
                  </span>
                  <span 
                    className="transition-transform duration-200"
                    style={{ 
                      transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--foreground-muted)'
                    }}
                  >
                    ▼
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              Still have questions? We're here to help.
            </p>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-3 rounded-xl transition-all"
              style={{ 
                border: '1px solid var(--border)', 
                color: 'var(--foreground)', 
                fontWeight: 500 
              }}
            >
              Schedule a call
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-12 text-center">
          <h2 className="mb-6" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--foreground)' }}>
            Ready to eliminate compliance headaches?
          </h2>
          <p className="text-xl mb-10 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
            Join hundreds of teams who've automated their vendor compliance with Covera
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)', 
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(58, 79, 106, 0.2)'
              }}
            >
              Start free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all"
              style={{ 
                border: '2px solid var(--border)', 
                color: 'var(--foreground)', 
                fontWeight: 500 
              }}
            >
              Schedule demo
            </button>
          </div>
        </div>
      </section>

      <BlogFooter />

      {/* Demo Modal with correct props */}
      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}
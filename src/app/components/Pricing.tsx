import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import SEO from './SEO';
import LandingNav from './LandingNav';
import Footer from './Footer';
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
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
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
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Transparent pricing for every team
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Start with everything you need. Scale when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Core Plan */}
            <div className="rounded-3xl border-2 border-[#3A4F6A] bg-white p-10 relative shadow-2xl shadow-[#3A4F6A]/10">
              <div className="absolute -top-4 left-8 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#3A4F6A] text-white uppercase">
                Most Popular
              </div>

              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">Core</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-[#1a1a1a] tracking-tight">$399</span>
                    <span className="text-lg text-slate-500">/month</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Everything most businesses actually need
                  </p>
                </div>

                <Link 
                  to="/login"
                  className="block w-full py-4 rounded-xl text-center text-white bg-[#3A4F6A] hover:bg-[#2c3e53] font-medium transition-all shadow-lg shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 mb-3"
                >
                  Start free trial
                </Link>
                
                <p className="text-xs text-center text-slate-400">
                  7-day free trial • No credit card required
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100">
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
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-3xl border border-slate-200 bg-white p-10 relative hover:border-slate-300 transition-colors">
              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">Enterprise</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-slate-500">from</span>
                    <span className="text-5xl font-bold text-[#1a1a1a] tracking-tight">$1,200</span>
                    <span className="text-lg text-slate-500">/month</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    For complex or regulated organizations
                  </p>
                </div>

                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="block w-full py-4 rounded-xl text-center border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all mb-3"
                >
                  Contact sales
                </button>

                <p className="text-xs text-center text-slate-400">
                  Custom pricing • Dedicated support
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100">
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
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-slate-700">
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
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-500">
              Everything you need to know about pricing and billing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`rounded-xl border transition-all ${openFaqIndex === index ? 'border-[#3A4F6A] bg-slate-50' : 'border-slate-200 bg-white'}`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-all"
                >
                  <span className="font-medium text-[#1a1a1a] flex-1 text-lg">
                    {faq.question}
                  </span>
                  <span 
                    className={`text-slate-400 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-base leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm mb-6 text-slate-500">
              Still have questions? We're here to help.
            </p>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
            >
              Schedule a call
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-[#fafaf9]">
        <div className="max-w-4xl mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Ready to eliminate compliance headaches?
          </h2>
          <p className="text-xl mb-10 leading-relaxed text-slate-500">
            Join hundreds of teams who've automated their vendor compliance with Covera
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

      <Footer />

      {/* Demo Modal with correct props */}
      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}
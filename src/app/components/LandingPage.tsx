import { Link } from 'react-router';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import SEO, { SEO_CONFIGS } from './SEO';
import InteractiveHeroVisual from './landing/InteractiveHeroVisual';
import TrustedByMarquee from './landing/TrustedByMarquee';
import LandingNav from './LandingNav';
import Footer from './Footer';

import { TrustScore } from './ui/TrustScore';

// Lazy load heavy components and modals
const DemoModal = lazy(() => import('./DemoModal'));
const ContactSalesModal = lazy(() => import('./ContactSalesModal'));
const TestimonialCarousel = lazy(() => import('./TestimonialCarousel'));
const ComparisonSection = lazy(() => import('./landing/ComparisonSection'));
const MarketingFeatures = lazy(() => import('./MarketingFeatures'));
const AIContractAnalysisSection = lazy(() => import('./landing/AIContractAnalysisSection'));

// Simple loading fallback for sections
const SectionLoader = () => (
  <div className="section">
    <div className="py-24 flex justify-center items-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#3A4F6A] rounded-full animate-spin" />
    </div>
  </div>
);

// Move constant data outside component to prevent re-creation on render
const TESTIMONIALS = [
  {
    quote: "Before Covera, tracking vendor insurance was a full-time nightmare. Now our compliance rate is 98% and our team spends zero time chasing COIs. It's eliminated a massive liability risk.",
    author: "Jessica Martinez",
    title: "Director of Operations, Summit Properties",
    initials: "JM"
  },
  {
    quote: "We manage 200+ subcontractors across active job sites. Covera's automated reminders and vendor portal mean we never miss an expiration. Our legal team can finally sleep at night.",
    author: "David Kim",
    title: "VP of Risk Management, BuildRight Construction",
    initials: "DK"
  },
  {
    quote: "As a healthcare administrator managing vendor compliance across 14 facilities, Covera has been transformative. The audit exports alone have saved us countless hours during regulatory reviews.",
    author: "Sarah Chen",
    title: "Compliance Director, MedCore Health Systems",
    initials: "SC"
  },
  {
    quote: "We went from 60% compliance to 97% in just 3 months. The automated workflows and vendor portal eliminated the constant back-and-forth. Our insurance broker was genuinely impressed.",
    author: "Michael Torres",
    title: "Operations Manager, FastFleet Logistics",
    initials: "MT"
  },
  {
    quote: "Managing franchise vendor compliance used to require a dedicated FTE. Now it's completely automated. The dashboard gives our corporate team instant visibility across all 50+ locations.",
    author: "Rachel Williams",
    title: "Head of Franchise Operations, FranchiseCo",
    initials: "RW"
  },
  {
    quote: "The ROI was immediate. Between avoided liability exposure and recovered staff time, Covera paid for itself in the first month. Our general counsel calls it essential infrastructure.",
    author: "James Patterson",
    title: "CFO, Apex Development Group",
    initials: "JP"
  },
  {
    quote: "We onboarded 50 new vendors in a week without a single email. The self-service portal is intuitive, and the automated verification catches issues our team used to miss.",
    author: "Elena Rodriguez",
    title: "Procurement Lead, TechFlow Systems",
    initials: "ER"
  },
  {
    quote: "Finally, a compliance tool that doesn't feel like legacy software. It's fast, modern, and actually helpful. Our vendors prefer using Covera over our old email process.",
    author: "Marcus Johnson",
    title: "Facility Director, Urban Spaces",
    initials: "MJ"
  }
];

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);

  return (
    <div className="page-root relative min-h-screen flex flex-col bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
      <SEO {...SEO_CONFIGS.landing} />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#fafaf9]">
        {/* Animated Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
             }} 
        />
      </div>

      <Suspense fallback={null}>
        {isDemoModalOpen && <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />}
        {isContactSalesModalOpen && <ContactSalesModal isOpen={isContactSalesModalOpen} onClose={() => setIsContactSalesModalOpen(false)} />}
      </Suspense>
      
      <LandingNav />

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="section-hero pt-32 pb-16 md:pt-48 md:pb-32 relative">
          <div className="text-center max-w-4xl mx-auto mb-16 px-4">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor Contracts & Compliance <br className="hidden md:block" />
              <span className="text-[#3A4F6A]">Without Spreadsheets</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every vendor introduces risk. Covera makes it visible, trackable, and controlled.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-[#3A4F6A] text-white hover:bg-[#2c3e53] transition-colors shadow-md shadow-[#3A4F6A]/20 hover:shadow-lg hover:shadow-[#3A4F6A]/30 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Schedule demo
              </button>
            </div>

            <div className="flex justify-center">
              <TrustScore />
            </div>
          </div>

          {/* Hero Visual */}
          <div className="fullbleed mt-16 w-full px-4 md:px-6 lg:px-8">
            <div className="relative max-w-[1280px] mx-auto w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-[#3A4F6A]/20 rounded-3xl opacity-40 blur-lg" />
              <div className="relative z-10 overflow-hidden rounded-2xl h-[240px] sm:h-[420px] md:h-[560px] lg:h-[700px] border border-slate-100 bg-white shadow-lg shadow-slate-200/40" aria-hidden="true">
                {/* 
                  Scaling Logic:
                  Mobile (343px width): Scale 0.34 * 1280px content ≈ 435px width (still wider than 343).
                  Needs adjustment.
                  If we assume content is 1280px fixed width (from InteractiveHeroVisual max-w).
                  Mobile scale 0.34 -> 435px.
                  Container width ~340px. 
                  So it will overflow or need to be smaller.
                  
                  Let's use a percentage-based width on the inner container to ensure it fills the space correctly.
                */}
                <div className="origin-top-left transform scale-[0.34] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 w-[294%] sm:w-[166%] md:w-[125%] lg:w-full">
                  <InteractiveHeroVisual />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section py-12 md:py-16 border-y border-slate-100 bg-white/50 overflow-hidden">
          <div className="text-center w-full mb-8">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted by compliance-first teams</p>
          </div>
          <div className="fullbleed w-full">
            <TrustedByMarquee />
          </div>
        </section>

        {/* The Shift Section */}
        <Suspense fallback={<SectionLoader />}>
          <ComparisonSection />
        </Suspense>

        {/* New Marketing Features */}
        <Suspense fallback={<SectionLoader />}>
          <MarketingFeatures />
        </Suspense>

        {/* AI Contract Analysis Section */}
        <Suspense fallback={<SectionLoader />}>
          <AIContractAnalysisSection />
        </Suspense>

        {/* Testimonials */}
        <section className="section bg-slate-50 border-y border-slate-200 py-16 md:py-24">
          <div className="w-full">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                 <MessageSquare className="w-3 h-3" />
                 Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
                Loved by <span className="text-[#3A4F6A]">Operations Teams</span>
              </h2>
            </div>
            <Suspense fallback={<SectionLoader />}>
              <TestimonialCarousel testimonials={TESTIMONIALS} />
            </Suspense>
          </div>
        </section>

        {/* CTA */}
        <section className="section-cta relative overflow-hidden">
          <div className="absolute inset-0 bg-[#3A4F6A] fullbleed" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay fullbleed" />
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              Ready to automate your compliance?
            </h2>
            <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of companies using Covera to reduce risk and save time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white text-[#3A4F6A] hover:bg-slate-50 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsContactSalesModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-transparent border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Contact Sales
              </button>
            </div>
            <p className="mt-8 text-sm text-slate-300">
              7-day free trial • Cancel anytime • No credit card required for demo
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
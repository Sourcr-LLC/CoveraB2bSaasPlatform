import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import DemoModal from './DemoModal';
import ContactSalesModal from './ContactSalesModal';
import TestimonialCarousel from './TestimonialCarousel';
import ComparisonSection from './landing/ComparisonSection';
import MarketingFeatures from './MarketingFeatures';
import AIScannerSection from './landing/AIScannerSection';
import SEO, { SEO_CONFIGS } from './SEO';
import InteractiveHeroVisual from './landing/InteractiveHeroVisual';
import LandingNav from './LandingNav';
import Footer from './Footer';

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
  }
];

// Memoize FeatureSteps removed to reduce redundancy


export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
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
        
        {/* Subtle glowing orbs replacing the blobs - Optimized for performance */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-[100px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3A4F6A]/10 blur-[80px] opacity-30 animate-pulse-slower" />
      </div>

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <ContactSalesModal isOpen={isContactSalesModalOpen} onClose={() => setIsContactSalesModalOpen(false)} />
      
      <LandingNav />

      {/* Hero Section */}
      <main>
        <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor Insurance and Compliance <br className="hidden md:block" />
              <span className="text-[#3A4F6A]">Without Spreadsheets</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automatically track COIs, prevent expired coverage, and stay audit-ready without chasing vendors or exposing your business to legal risk.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-[#3A4F6A] text-white hover:bg-[#2c3e53] transition-colors shadow-xl shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                Schedule demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-6xl mt-16 animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-[#3A4F6A]/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative z-10" aria-hidden="true">
              <InteractiveHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 md:py-12 border-y border-slate-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-slate-600 mb-8 uppercase tracking-widest">Trusted by compliance-first teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Roadr', 'Summit Properties', 'BuildRight', 'MedCore Health', 'FranchiseCo', 'Apex Group'].map((name) => (
              <div key={name} className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Shift Section */}
      <ComparisonSection />

      {/* New Marketing Features (Inspired by JeevaAI) */}
      <MarketingFeatures />

      {/* AI Deep Dive */}
      <AIScannerSection />

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
               <MessageSquare className="w-3 h-3" />
               Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
              Loved by <span className="text-[#3A4F6A]">Operations Teams</span>
            </h2>
          </div>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3A4F6A]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Ready to automate your compliance?
          </h2>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            Join hundreds of companies using Covera to reduce risk and save time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white text-[#3A4F6A] hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-2"
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
          <p className="mt-6 text-sm text-slate-300">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
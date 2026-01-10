import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Bell, FileText, TrendingUp, ArrowRight, Building2, Hospital, Store, Truck, MapPin, FileCheck, CheckCircle, Upload, Zap, Lock, Globe, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DemoModal from './DemoModal';
import ContactSalesModal from './ContactSalesModal';
import TestimonialCarousel from './TestimonialCarousel';
import SEO, { SEO_CONFIGS } from './SEO';
import DashboardPreview from './DashboardPreview';
import LandingNav from './LandingNav';
import Footer from './Footer';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('self-service');

  // Testimonials data
  const testimonials = [
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

  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
      <SEO {...SEO_CONFIGS.landing} />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#3A4F6A]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3A4F6A]/3 blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-[80px]" />
      </div>

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <ContactSalesModal isOpen={isContactSalesModalOpen} onClose={() => setIsContactSalesModalOpen(false)} />
      
      <LandingNav />

      {/* Hero Section */}
      <main>
        <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor Insurance and Compliance <br className="hidden md:block" />
              <span className="text-[#3A4F6A]">Without Spreadsheets</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automatically track COIs, prevent expired coverage, and stay audit-ready without chasing vendors or exposing your business to legal risk.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-[#3A4F6A] text-white hover:bg-[#2c3e53] transition-all shadow-xl shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                Schedule demo
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto max-w-6xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-[#3A4F6A]/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-2xl" aria-hidden="true">
              <DashboardPreview />
              
              {/* Floating Element: Magic Link Notification */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -right-4 top-12 md:right-8 md:top-20 bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-lg shadow-black/5 max-w-xs hidden lg:block"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Acme Corp uploaded COI</h4>
                    <p className="text-xs text-slate-500 mt-1">Via Secure Magic Link • Just now</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-flex">
                      <Shield className="w-3 h-3" />
                      Verified by AI
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-white/50">
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
      <section className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">The Old Way is Broken</h2>
            <p className="text-lg text-slate-600">
              Why are you still manually data-entering expirations from PDF attachments?
              There is a better way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Old Way */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group">
              <div className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-300">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Manual Admin (Bottleneck)</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5" />
                  <span>You email vendor asking for COI</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5" />
                  <span>Vendor emails back a PDF (eventually)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5" />
                  <span>You open PDF, type dates into Excel</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5" />
                  <span>Repeat 100x per month</span>
                </li>
              </ul>
              <div className="h-48 bg-slate-200/50 rounded-xl flex items-center justify-center border border-slate-200 border-dashed">
                <span className="text-slate-600 font-medium">Costly & Slow</span>
              </div>
            </div>

            {/* The New Way */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#3A4F6A] text-white relative shadow-2xl shadow-[#3A4F6A]/20 overflow-hidden group">
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute top-6 right-6 md:top-8 md:right-8 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex flex-wrap items-center gap-2 pr-12 relative z-10">
                The Network Effect
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm whitespace-nowrap">Automated</span>
              </h3>
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-start gap-3 text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5" />
                  <span>You send one "Magic Link"</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5" />
                  <span>Vendor uploads their own COI & W9</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5" />
                  <span>AI scans & verifies coverage instantly</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5" />
                  <span>Vendor updates their own expired docs</span>
                </li>
              </ul>
              <div className="h-48 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Vendor Portal</div>
                    <div className="text-xs text-white/80">Active now</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                  <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-24 md:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[40px] transform rotate-3 scale-95 opacity-50" />
              <div className="bg-white rounded-[32px] border border-slate-200 p-4 md:p-8 shadow-xl relative z-10">
                <div className="flex flex-col gap-6">
                  {/* Step 1 */}
                  <div className={`flex gap-4 transition-all duration-300 ${activeStep === 1 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0 transition-all ${activeStep === 1 ? 'bg-[#3A4F6A] text-white shadow-[#3A4F6A]/30 scale-110' : 'bg-slate-100 text-slate-400 scale-100'}`}>1</div>
                    <div className={`flex-1 p-4 rounded-xl border transition-all ${activeStep === 1 ? 'border-[#3A4F6A]/10 bg-white shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                      <div className={`font-medium ${activeStep === 1 ? 'text-[#3A4F6A]' : 'text-slate-900'}`}>Generate Link</div>
                      <div className="text-sm text-slate-700 mt-1">Create a secure, time-limited upload token.</div>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className={`flex gap-4 transition-all duration-300 ${activeStep === 2 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0 transition-all ${activeStep === 2 ? 'bg-[#3A4F6A] text-white shadow-[#3A4F6A]/30 scale-110' : 'bg-slate-100 text-slate-400 scale-100'}`}>2</div>
                    <div className={`flex-1 p-4 rounded-xl border transition-all ${activeStep === 2 ? 'border-[#3A4F6A]/10 bg-white shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                      <div className={`font-bold mb-2 flex items-center gap-2 ${activeStep === 2 ? 'text-[#3A4F6A]' : 'text-slate-900'}`}>
                        Vendor Uploads
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wide">Magic Link</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800 truncate">GL_Insurance_2024.pdf</div>
                            <div className="text-xs text-slate-600">2.4 MB • Uploading...</div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-[#3A4F6A] animate-spin flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className={`flex gap-4 transition-all duration-300 ${activeStep === 3 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0 transition-all ${activeStep === 3 ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-100 text-slate-400 scale-100'}`}>3</div>
                    <div className={`flex-1 p-4 rounded-xl border transition-all ${activeStep === 3 ? 'border-emerald-100 bg-emerald-50/50 shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="font-medium text-slate-900">AI Verification</div>
                      <div className="text-sm text-slate-700 mt-1">Coverage limits extracted and checked instantly.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Zero-Friction <br />
                <span className="text-[#3A4F6A]">Vendor Onboarding</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Vendors don't need to create an account. They just click the link, drag-and-drop their files, and they're done. 
                It's the easiest compliance workflow they've ever used.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Secure Access</h3>
                  <p className="text-sm text-slate-600">Encrypted links expire automatically after 7 days.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Self-Correction</h3>
                  <p className="text-sm text-slate-600">Vendors can update their own phone & address info.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Loved by Operations Teams</h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3A4F6A]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
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
          <p className="mt-6 text-sm text-slate-400">
            No credit card required for trial • Cancel anytime
          </p>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
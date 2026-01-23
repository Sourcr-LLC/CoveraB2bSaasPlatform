import { Link } from 'react-router';
import { Target, Users, Zap, Shield, ArrowRight, CheckCircle, TrendingUp, Lightbulb, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import SEO from './SEO';
import DemoModal from './DemoModal';
import LandingNav from './LandingNav';
import Footer from './Footer';

export default function AboutUs() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9] text-[#1a1a1a] selection:bg-[var(--primary)] selection:text-white">
      <SEO
        title="About Covera | Vendor Compliance Without the Chaos"
        description="Covera helps businesses stay compliant with vendor contracts without spreadsheets, manual follow ups, or compliance chaos."
        keywords="about Covera, vendor contract software, COI tracking platform"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Covera",
          "description": "Covera helps businesses stay compliant with vendor contracts without spreadsheets, manual follow ups, or compliance chaos",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://covera.co" },
              { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://covera.co/about" }
            ]
          }
        }}
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--primary)]/3 blur-[100px]" />
      </div>

      <LandingNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div 
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
                About Covera
              </h1>
              
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                Covera helps businesses stay compliant with vendor contracts without spreadsheets, manual follow ups, or compliance chaos.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 flex items-center justify-center gap-2"
                >
                  Start free trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2"
                >
                  Schedule demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-white/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl leading-relaxed mb-6 text-slate-700">
                We built Covera for operations teams who manage third party vendors and need clear, reliable insurance compliance without becoming insurance experts.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-slate-700">
                Our platform automatically tracks Certificates of Insurance, flags risk in real time, and keeps teams audit ready with confidence.
              </p>
              <div className="mt-8 p-8 rounded-2xl border border-slate-100 bg-white">
                <p className="text-xl font-semibold text-[var(--primary)]">
                  Covera is operations first, not insurance first.
                </p>
                <p className="mt-3 text-base leading-relaxed text-slate-500">
                  We focus on clarity, automation, and accountability so teams can stop chasing documents and start focusing on running their business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="mb-6 text-3xl md:text-5xl font-semibold text-[#1a1a1a]">
                Why We Exist
              </h2>
              <p className="text-2xl mb-6 font-medium text-[var(--primary)]">
                Vendor insurance compliance is broken.
              </p>
              <p className="text-lg leading-relaxed mb-4 text-slate-600">
                Too many businesses still rely on spreadsheets, inbox searches, and manual reviews to manage COIs. That leads to expired coverage, missed requirements, delayed projects, and unnecessary risk exposure.
              </p>
              <p className="text-lg leading-relaxed mb-4 text-slate-600">
                Covera exists to remove that friction entirely.
              </p>
              <p className="text-xl font-medium text-[var(--primary)]">
                We believe compliance should be simple, transparent, and built into daily operations—not a last minute scramble during audits or incidents.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="mb-4 text-3xl md:text-5xl font-semibold text-[#1a1a1a]">
                What We Do
              </h2>
              <p className="text-lg text-slate-500">
                Covera provides a centralized platform to manage vendor insurance compliance across your entire organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg">
                <TrendingUp className="w-8 h-8 mb-4 text-[var(--primary)]" />
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Track COI status in real time</h3>
                <p className="text-slate-500 leading-relaxed">
                  Monitor all vendor Certificate of Insurance statuses automatically across your entire organization.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg">
                <Zap className="w-8 h-8 mb-4 text-[var(--primary)]" />
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Automated vendor reminders</h3>
                <p className="text-slate-500 leading-relaxed">
                  Automatically remind vendors before coverage expires, eliminating manual follow-up emails.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg">
                <CheckCircle className="w-8 h-8 mb-4 text-[var(--primary)]" />
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Clear compliance visibility</h3>
                <p className="text-slate-500 leading-relaxed">
                  See compliant, at-risk, and non-compliant vendors without interpretation or guesswork.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg">
                <Shield className="w-8 h-8 mb-4 text-[var(--primary)]" />
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Instant audit-ready reports</h3>
                <p className="text-slate-500 leading-relaxed">
                  Generate comprehensive compliance reports instantly for audits, reviews, or stakeholder updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
import { Link } from 'react-router';
import { ArrowLeft, Scale, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';
import LandingNav from '../LandingNav';
import Footer from '../Footer';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function IndemnificationGuide() {
  return (
    <div className="page-root min-h-screen flex flex-col bg-[#fafaf9]">
      <SEO {...SEO_CONFIGS.blogIndemnificationGuide} />
      <LandingNav />
      
      <main className="flex-1">
        <article className="section section-padding pt-32 pb-16 md:pt-48">
          <div className="w-full max-w-3xl mx-auto">
            {/* Back Link */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#3A4F6A] hover:underline mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
                  Legal Basics
                </span>
                <span className="text-gray-500 text-sm">7 min read</span>
              </div>
              <h1 
                className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
                style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
              >
                The "Plain English" Guide to Vendor Indemnification Clauses
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Indemnification is the most negotiated and least understood part of any contract. We break it down into simple terms so you know what you're signing.
              </p>
              <div className="mt-6 text-sm text-gray-500">
                Published January 19, 2026
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none space-y-8">
              
              <div>
                <p className="text-gray-700 leading-relaxed">
                  If you mention "indemnification" at a dinner party, you'll clear the room. But in business, it's the specific clause that saves you from bankruptcy.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>In plain English:</strong> Indemnification is a promise to pay for someone else's loss. It means "If I mess up and you get sued because of it, I'll pay for your lawyers and the settlement."
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 my-8">
                 <h3 className="text-xl font-bold mb-4 text-slate-800">Real World Example</h3>
                 <div className="flex gap-4">
                   <div className="flex-shrink-0 mt-1">
                     <Shield className="w-8 h-8 text-[#3A4F6A]" />
                   </div>
                   <p className="text-slate-600 italic">
                     You hire a cleaning company (Vendor) to wax your office floors. They leave a wet spot without a sign. A visitor slips, breaks a hip, and sues YOUR company for $100,000.
                     <br/><br/>
                     <strong>With Indemnification:</strong> The cleaning company steps in, hires the lawyer, and pays the $100k.
                     <br/>
                     <strong>Without Indemnification:</strong> You pay everything, even though it was their fault.
                   </p>
                 </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The 3 Magic Words to Look For</h2>
                <p className="text-gray-700 leading-relaxed">
                  When reviewing a vendor contract, scan the indemnification section for these three protections. You want the vendor to:
                </p>
                <ul className="space-y-4 text-gray-700 mt-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Indemnify:</strong> Pay for any damages or settlements.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Defend:</strong> Pay for the lawyers to fight the case in court.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Hold Harmless:</strong> Agree not to blame you for their mistakes.
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Red Flag: "One-Way" Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  Many standard vendor contracts (especially from software giants) include "one-way" indemnification. They ask YOU to indemnify THEM if you misuse the software, but they refuse to indemnify YOU if their software deletes your database or infringes a patent.
                </p>
                <div className="flex items-center gap-4 bg-red-50 p-4 rounded-lg border border-red-100 text-red-800 font-medium">
                  <AlertOctagon className="w-6 h-6" />
                  Never sign a one-way indemnity clause. Always ask for "Mutuality."
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The "Super Cap" Exception</h2>
                <p className="text-gray-700 leading-relaxed">
                  Indemnification is useless if the vendor's liability is capped at $5,000. For high-risk items like Third Party Claims (lawsuits from outsiders), Data Breach, and Gross Negligence, you should demand that the liability be <strong>uncapped</strong> or set to a very high limit (e.g., $1M+).
                </p>
              </div>

              {/* CTA */}
              <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4 text-white">Compliance Made Simple</h3>
                <p className="text-white/90 mb-6">
                  Covera tracks your vendor contracts and ensures insurance policies are active to back up these indemnification promises.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-white text-[#3A4F6A] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>

            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
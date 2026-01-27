import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle, ShieldAlert, Eye, DollarSign, CalendarX } from 'lucide-react';
import LandingNav from '../LandingNav';
import Footer from '../Footer';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function HiddenContractRisks() {
  return (
    <div className="page-root min-h-screen flex flex-col bg-[#fafaf9]">
      <SEO {...SEO_CONFIGS.blogHiddenContractRisks} />
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
                  Risk Management
                </span>
                <span className="text-gray-500 text-sm">6 min read</span>
              </div>
              <h1 
                className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
                style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
              >
                5 Hidden Contract Risks Your General Counsel Wants You to Spot
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Before you send that MSA to legal, check for these 5 common pitfalls that delay deals and increase liability.
              </p>
              <div className="mt-6 text-sm text-gray-500">
                Published January 19, 2026
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none space-y-8">
              
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Vendor contracts are often 50+ pages of "legalese" designed to protect the drafter, not you. While your legal team will catch the major issues, operations and procurement teams are the first line of defense. Spotting these risks early can save weeks of negotiation time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  1. "Unlimited" Liability Caps (or Lack Thereof)
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Most vendors will try to cap their liability at the total value of the contract (e.g., "12 months of fees paid"). This sounds fair until a data breach costs you $5M in damages on a $50k contract.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>What to look for:</strong> Ensure liability caps for gross negligence, willful misconduct, and data breaches are either "uncapped" or set at a super-cap (e.g., 5x contract value or $1M, whichever is higher).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4 flex items-center gap-3">
                  <CalendarX className="w-6 h-6 text-amber-500" />
                  2. Sneaky Auto-Renewal Clauses
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  "Evergreen" clauses are standard, but watch out for the notice period. Some contracts require you to cancel 90 or even 120 days before the term ends. If you miss that window by one day, you're locked in for another year.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6 my-4">
                   <p className="font-semibold text-amber-900">The Fix:</p>
                   <p className="text-amber-800">Negotiate for a shorter notice period (30 days) or a "renewal for convenience" clause that allows you to cancel anytime with notice.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-amber-500" />
                  3. Uncapped Price Increases
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Look for language that allows the vendor to increase prices "at prevailing market rates" upon renewal. This gives them a blank check.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Best Practice:</strong> Cap annual price increases at 3-5% or CPI (Consumer Price Index).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                  4. One-Sided Indemnification
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Vendors often ask you to indemnify them for everything, while offering zero protection in return. If their software infringes on a patent and you get sued, you should not be footing the bill.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Ensure the indemnification is <strong>mutual</strong>. If they break it, they pay. If you break it, you pay.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-amber-500" />
                  5. Data Ownership Ambiguity
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  In SaaS contracts, verify that YOU own your data. Some contracts hide clauses that grant the vendor a "perpetual, irrevocable license" to use your data for "improving their services." While aggregated data usage is common, ensure they cannot use your proprietary data to build competing products.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4 text-white">Let AI Scan Your Contracts</h3>
                <p className="text-white/90 mb-6">
                  Don't review contracts manually. Covera's AI automatically flags these 5 risks and more in seconds.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-white text-[#3A4F6A] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Try Contract AI Scanner
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
import { Link } from 'react-router';
import { ArrowLeft, RefreshCw, Bell, CalendarClock } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function VendorContractRenewalBestPractices() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogVendorContractRenewalBestPractices} />
      <LandingNav />
      
      <article className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#3A4F6A] hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
                Renewals
              </span>
              <span className="text-gray-500 text-sm">4 min read</span>
            </div>
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Vendor Contract Renewal: A Proactive Guide to Avoiding Auto-Renewals
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Don't get locked into another year of a tool you don't use. Learn how to manage contract renewals and notice periods effectively.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published January 16, 2026
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The Auto-Renewal Trap</h2>
              <p className="text-gray-700 leading-relaxed">
                "Evergreen" clauses or auto-renewal provisions are standard in most B2B contracts. They state that unless you cancel within a specific window (e.g., 60 days before expiration), the contract renews automatically for another term.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Missing this window means you are legally obligated to pay for another year, even if you planned to switch vendors.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <CalendarClock className="w-5 h-5" /> Key Term: Notice Period
              </h3>
              <p className="text-yellow-800 mb-0">
                The "Notice Period" is the window of time you must provide notice of non-renewal. If your contract expires December 31st and has a 60-day notice period, you MUST cancel by November 1st.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Best Practices for Renewal Management</h2>
              
              <div className="space-y-6 my-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#3A4F6A] mb-2">1. Centralize All Expiration Dates</h3>
                  <p className="text-gray-700">You can't manage what you can't see. Build a master list of every vendor, their contract end date, and their notice period.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#3A4F6A] mb-2">2. Set "Decision Date" Alerts</h3>
                  <p className="text-gray-700">Don't just set an alert for the cancellation deadline. Set a "Decision Date" alert 30 days BEFORE the deadline. This gives you time to evaluate the vendor, look for alternatives, and make a decision without pressure.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#3A4F6A] mb-2">3. Renegotiate Early</h3>
                  <p className="text-gray-700">Your leverage is highest before the renewal lock-in. Use the renewal conversation to negotiate better pricing, improved SLAs, or removed restrictions.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">What If You Miss the Window?</h2>
              <p className="text-gray-700 leading-relaxed">
                If you miss an auto-renewal deadline, don't panic.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Check the contract language carefully:</strong> Is the auto-renewal clause enforceable in your jurisdiction?</li>
                <li><strong>Negotiate a buyout:</strong> The vendor might accept a partial payment to release you.</li>
                <li><strong>Downgrade:</strong> If you can't cancel, see if you can downgrade to a cheaper tier for the renewal term.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The Solution: Automated Renewal Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                Spreadsheets are risky because they don't send push notifications. A dedicated contract management system will email you well in advance of the notice period, ensuring you never accidentally renew an unwanted service.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Get Renewal Alerts Before It's Too Late</h3>
              <p className="text-white/90 mb-6">
                Covera tracks your contract expiration dates and notice periods, sending you alerts so you stay in control of your renewals.
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

      <BlogFooter />
    </div>
  );
}
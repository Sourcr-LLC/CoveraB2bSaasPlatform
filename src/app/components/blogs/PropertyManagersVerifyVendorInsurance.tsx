import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function PropertyManagersVerifyVendorInsurance() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#3A4F6A] hover:opacity-70 transition-opacity mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
              Property Management
            </span>
          </div>

          <h1 className="mb-6 text-[#0A0F1E]">
            How Property Managers Verify Vendor Insurance
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 29, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">4 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              As a property manager, verifying vendor insurance isn't just good practice—it's essential protection against liability claims. Here's your complete guide to verifying certificates of insurance effectively.</p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Why Insurance Verification Matters</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When a vendor works on your property without proper insurance, you're exposed to significant risks:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-700"><strong>Liability claims</strong> if someone gets injured during the vendor's work</li>
              <li className="text-gray-700"><strong>Property damage</strong> costs if the vendor damages your building</li>
              <li className="text-gray-700"><strong>Legal fees</strong> defending against claims</li>
              <li className="text-gray-700"><strong>Increased insurance premiums</strong> after filing claims</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Required Insurance Types for Vendors</h2>
            
            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">1. General Liability Insurance</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum coverage:</strong> $1,000,000 per occurrence, $2,000,000 aggregate<br />
              <strong>Covers:</strong> Bodily injury, property damage, personal injury
            </p>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">2. Workers' Compensation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Required for:</strong> All vendors with employees<br />
              <strong>Covers:</strong> Employee injuries on the job
            </p>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">3. Commercial Auto (if applicable)</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Required for:</strong> Vendors using vehicles on your property<br />
              <strong>Minimum coverage:</strong> $1,000,000 combined single limit
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step-by-Step Verification Process</h2>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">Step 1: Request Certificate of Insurance</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Before any work begins, request a current COI from the vendor. The certificate should be issued directly by their insurance agent, not created by the vendor themselves.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">Step 2: Verify Coverage Details</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Check these critical elements:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-700"><strong>Coverage amounts</strong> meet your minimum requirements</li>
              <li className="text-gray-700"><strong>Effective dates</strong> cover the entire work period</li>
              <li className="text-gray-700"><strong>Policy numbers</strong> are present and valid</li>
              <li className="text-gray-700"><strong>Insurance carrier</strong> is legitimate (check AM Best rating)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">Step 3: Confirm Additional Insured Status</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your property management company must be listed as an "Additional Insured" on the vendor's general liability policy. This gives you direct rights under their policy in case of a claim.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">Step 4: Verify Certificate Holder Information</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The "Certificate Holder" section should show your company's exact legal name and current address. Any discrepancies could invalidate your protection.
            </p>

            <h3 className="text-xl font-semibold text-[#0A0F1E] mt-8 mb-3">Step 5: Contact the Insurance Company</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              For high-risk work, call the insurance carrier directly to verify the policy is active and the coverage limits are accurate. Get the agent's name and note the date you verified.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Common Red Flags to Watch For</h2>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-700"><strong>Expired certificates</strong> - even by one day means no coverage</li>
              <li className="text-gray-700"><strong>Missing additional insured endorsement</strong> - you won't be protected</li>
              <li className="text-gray-700"><strong>Coverage amounts below your requirements</strong> - increases your liability</li>
              <li className="text-gray-700"><strong>Canceled or non-renewed policies</strong> - the COI becomes void</li>
              <li className="text-gray-700"><strong>Unlicensed insurance carriers</strong> - check state insurance department</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Tracking Expiration Dates</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Most property managers work with 50-200+ vendors. Manually tracking all expiration dates in spreadsheets is:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-700">Time-consuming (3-5 hours per week)</li>
              <li className="text-gray-700">Error-prone (easy to miss renewals)</li>
              <li className="text-gray-700">Difficult to scale as you add properties</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Automated tracking systems send renewal reminders 90, 60, and 30 days before expiration, ensuring you never work with an uninsured vendor.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Best Practices for Property Managers</h2>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-700"><strong>Create a vendor compliance policy</strong> with clear insurance requirements</li>
              <li className="text-gray-700"><strong>Verify insurance before every project</strong>, not just at initial onboarding</li>
              <li className="text-gray-700"><strong>Set calendar reminders</strong> for 30 days before expiration dates</li>
              <li className="text-gray-700"><strong>Keep digital copies</strong> of all certificates organized by vendor</li>
              <li className="text-gray-700"><strong>Document all verification calls</strong> with dates and agent names</li>
              <li className="text-gray-700"><strong>Have backup vendors</strong> ready in case a vendor's coverage lapses</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">What to Do When Insurance Expires</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If a vendor's insurance lapses:
            </p>
            <ol className="space-y-3 mb-8 list-decimal list-inside">
              <li className="text-gray-700"><strong>Stop all work immediately</strong> - don't allow them on the property</li>
              <li className="text-gray-700"><strong>Request updated COI</strong> - give them 48 hours to provide proof of renewal</li>
              <li className="text-gray-700"><strong>Don't accept verbal promises</strong> - require the actual certificate</li>
              <li className="text-gray-700"><strong>Use backup vendor</strong> if they can't provide updated insurance quickly</li>
              <li className="text-gray-700"><strong>Document everything</strong> - keep records of when you stopped their work and why</li>
            </ol>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Verifying vendor insurance is one of the most important risk management tasks for property managers. While it takes time and attention to detail, the cost of working with an uninsured vendor far exceeds the effort of proper verification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you verify manually or use automated software, the key is consistency—check every vendor, every time, before they start work.
            </p>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Automate Your Vendor Insurance Tracking</h3>
            <p className="text-white/90 mb-6">
              Covera automates vendor insurance tracking, sends renewal reminders, and gives you instant compliance visibility—without the manual work.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#3A4F6A] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free 7-Day Trial
            </Link>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
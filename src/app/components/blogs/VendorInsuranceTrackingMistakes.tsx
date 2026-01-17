import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function VendorInsuranceTrackingMistakes() {
  return (
    <div className="bg-white">
      <LandingNav />
      
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#3A4F6A] hover:opacity-70 transition-opacity mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
              Risk Management
            </span>
          </div>

          <h1 className="mb-6 text-[#0A0F1E]">
            7 Vendor Insurance Tracking Mistakes That Could Cost You Millions
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 22, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">8 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              These common compliance errors leave businesses exposed to catastrophic liability. If you're making any of these mistakes, fix them today—before they result in an uninsured claim.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #1: Accepting the Certificate Without Verification</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> A vendor emails you a COI, and you file it without calling the insurance agency to verify.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> COI fraud is shockingly common. Vendors create fake certificates using templates downloaded online, hoping you won't check. Others provide expired certificates hoping you won't notice the dates.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Call the insurance agency listed on every COI. Verify:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>The policy is active and current</li>
              <li>Coverage limits match what's shown on the certificate</li>
              <li>You're actually listed as Additional Insured (not just Certificate Holder)</li>
            </ul>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6 rounded-r-lg">
              <p className="text-red-900">
                <strong>Real Cost:</strong> A property management company accepted an unverified COI from a roofing contractor. After a fall injury, they discovered the certificate was forged. The resulting lawsuit cost $2.3 million—paid entirely from their own insurance because the vendor had no coverage.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #2: Only Being Listed as "Certificate Holder"</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> Your company name appears in the "Certificate Holder" box, and you assume you're protected.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> Certificate Holder status provides zero coverage. If the vendor causes an incident and you're sued, their insurance will NOT defend you. Your own policy pays.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Always require "Additional Insured" status. Look for this language in the description box or attached endorsements. Being Additional Insured means the vendor's policy extends coverage to you.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #3: Not Tracking Expiration Dates</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> You collect certificates when vendors first start, but don't monitor renewal dates.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> Vendors let policies lapse all the time—budget issues, forgotten renewals, business problems. If they're working with expired coverage and something happens, you're unprotected.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Implement a system that alerts you 60, 30, and 15 days before any policy expires. Send renewal requests proactively. If a policy lapses, immediately suspend all work.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #4: Using Inadequate Coverage Limits</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> Accepting $500K general liability coverage because "the vendor said that's all they have."
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> Medical costs, legal fees, and settlement amounts routinely exceed $500K—especially for serious injuries or multi-party claims. When the vendor's limits are exhausted, guess whose insurance pays the rest?
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Set minimum requirements based on risk:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Low-risk vendors:</strong> $1M per occurrence / $2M aggregate</li>
              <li><strong>Medium-risk vendors:</strong> $2M per occurrence / $4M aggregate</li>
              <li><strong>High-risk vendors:</strong> $2M+ per occurrence with umbrella policy</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #5: Skipping Workers' Compensation Verification</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> Not requiring Workers' Comp from vendors with employees, or accepting a vendor's claim that "we're all independent contractors."
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> If a vendor's employee is injured and they don't have Workers' Comp, YOUR policy becomes primary. This can result in six-figure claims and premium increases that last for years.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Require proof of Workers' Comp from any vendor with W-2 employees. For true sole proprietors, get a signed waiver stating they declined coverage and understand the risks.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6 rounded-r-lg">
              <p className="text-red-900">
                <strong>Real Cost:</strong> A facilities manager hired a janitorial company claiming all workers were independent contractors. When an employee fell and was injured, the resulting Workers' Comp claim cost $180K—paid by the facilities company's insurance because the janitorial company had no coverage.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #6: Missing Required Endorsements</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> Not requesting specific endorsements like "Waiver of Subrogation" or "Primary and Non-Contributory."
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> Without these endorsements:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>The vendor's insurance company can sue you to recover claim payments (without Waiver of Subrogation)</li>
              <li>Both your policy and the vendor's policy may try to avoid paying, resulting in gaps (without Primary/Non-Contributory language)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Require these endorsements in your vendor contracts and verify they're on the actual policy (not just mentioned in the certificate description).
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Mistake #7: No Written Contracts With Insurance Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Error:</strong> Relying on verbal agreements or handshake deals without documented insurance requirements.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Why It's Dangerous:</strong> Many Additional Insured endorsements include language like "coverage applies only when required by written contract." Without a written contract specifying insurance requirements, the Additional Insured coverage may not apply.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Use written contracts for ALL vendors, even small jobs. Include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Specific insurance types and minimum limits required</li>
              <li>Requirement that your company be named Additional Insured</li>
              <li>Required endorsements (Waiver of Subrogation, Primary and Non-Contributory)</li>
              <li>Deadline for providing proof of insurance before work starts</li>
              <li>Your right to verify coverage directly with the insurance carrier</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Bonus Mistake: Storing Certificates in Email</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              While not a compliance error per se, storing COIs in various email accounts creates chaos during audits or lawsuits. When you need to prove you had valid insurance on file, spending hours searching email threads looks negligent.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>The Fix:</strong> Use centralized document management—either a dedicated compliance system or at minimum a well-organized shared drive with consistent file naming.
            </p>

            <div className="bg-gray-50 border-l-4 border-[#3A4F6A] p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-[#0A0F1E] mb-2">Take Action Today</h3>
              <p className="text-gray-700">
                Review your vendor files this week. For each vendor, verify: (1) valid insurance is on file, (2) you're Additional Insured, (3) coverage limits are adequate, (4) expiration dates are tracked. Fix any gaps immediately—because the next claim could happen tomorrow.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Eliminate Compliance Mistakes Automatically</h3>
            <p className="text-white/90 mb-6">
              Covera verifies vendor insurance, tracks expirations, checks for required endorsements, and alerts you to compliance gaps before they become million-dollar problems.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#3A4F6A] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free 7-Day Trial
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-[#0A0F1E] mb-6">Related Articles</h3>
            <div className="space-y-4">
              <Link to="/blog/additional-insured-vs-certificate-holder" className="block p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <span className="text-sm text-[#3A4F6A] font-medium">Basics</span>
                <h4 className="font-bold text-[#0A0F1E] mt-1">Additional Insured vs Certificate Holder: What's the Difference?</h4>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
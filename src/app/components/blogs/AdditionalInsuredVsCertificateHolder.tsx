import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function AdditionalInsuredVsCertificateHolder() {
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
              Basics
            </span>
          </div>

          <h1 className="mb-6 text-[#0A0F1E]">
            Additional Insured vs Certificate Holder: What's the Difference?
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 24, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">7 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              These two terms appear on every Certificate of Insurance, but they provide completely different levels of protection. Understanding the difference could save your business from a catastrophic uninsured claim.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Certificate Holder: You Get Notified (That's It)</h2>
            
            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">What It Means</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Being listed as the Certificate Holder means:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>You receive a copy of the certificate proving the vendor has insurance</li>
              <li>You <em>may</em> receive notice if the policy is cancelled (if requested)</li>
              <li><strong>You get ZERO coverage from their policy</strong></li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">What It Does NOT Do</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Certificate Holder status does NOT:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Extend the vendor's insurance coverage to you</li>
              <li>Provide any liability protection for your company</li>
              <li>Cover legal defense costs if you're sued</li>
              <li>Give you any rights to make claims</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Common Misconception</h3>
              <p className="text-red-900">
                Many businesses mistakenly believe that having a COI with their name as Certificate Holder provides protection. It doesn't. If the vendor causes damage or injury, their insurance will NOT defend you unless you're also listed as Additional Insured.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Additional Insured: You Get Real Protection</h2>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">What It Means</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Being listed as Additional Insured means the vendor's liability policy extends coverage to YOU. Specifically:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>The vendor's insurance will defend you in lawsuits arising from their work</li>
              <li>Their policy covers damages or settlements against you (up to policy limits)</li>
              <li>Legal defense costs come from their insurance, not yours</li>
              <li>You have direct rights to file claims under their policy</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Real-World Example</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              A painting contractor working on your property spills paint thinner, causing a slip-and-fall injury to a tenant. The tenant sues both the painter AND your company (because you're the property owner).
            </p>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <p className="font-bold text-[#0A0F1E] mb-3">If you're ONLY the Certificate Holder:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>The painter's insurance defends the painter</li>
                <li>YOUR insurance must defend you (consuming your policy limits)</li>
                <li>You pay your deductible</li>
                <li>Your premiums increase at renewal</li>
              </ul>

              <p className="font-bold text-[#0A0F1E] mb-3">If you're listed as Additional Insured:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The painter's insurance defends BOTH of you</li>
                <li>Your insurance remains untouched</li>
                <li>You pay nothing (no deductible)</li>
                <li>Your loss history stays clean</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">How to Verify Additional Insured Status</h2>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Step 1: Check the Certificate</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Look in Section D ("Description of Operations") on the ACORD 25 form. You should see language like:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>"[Your Company Name] is Additional Insured per written contract"</li>
              <li>"Additional Insured endorsement Form CG 20 10 attached"</li>
              <li>"Certificate holder is Additional Insured when required by written contract"</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Step 2: Verify With the Insurance Agency</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              A certificate can say anything—it's not the actual policy. Always call the insurance agency listed on the COI and verify:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>"Is [Your Company Name] listed as Additional Insured on the actual policy?"</li>
              <li>"What is the endorsement form number?"</li>
              <li>"Are there any limitations to the Additional Insured coverage?"</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Step 3: Request the Actual Endorsement</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              For high-risk projects, request a copy of the actual Additional Insured endorsement. This is the page added to the policy that names you. Common forms include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>CG 20 10:</strong> Owners, lessees, or contractors (scheduled)</li>
              <li><strong>CG 20 37:</strong> Owners, lessees, or contractors (automatic)</li>
              <li><strong>CG 20 33:</strong> Additional Insured – Owners, Lessees or Contractors – Automatic Status for Other Parties When Required by Written Contract</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Limitations to Watch For</h2>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">1. "Ongoing Operations" vs "Completed Operations"</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Some endorsements only cover you during active work ("ongoing operations"). If a defect appears months after the project finishes, you may not be covered. Request endorsements that include "completed operations" coverage.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">2. "Sole Negligence" Exclusions</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Some policies exclude coverage if you are solely negligent (the vendor did nothing wrong). While this seems fair, it can leave gaps in real-world scenarios.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">3. Contract Requirement Clauses</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Many endorsements state coverage only applies "when required by written contract." This means:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>You MUST have a written contract with insurance requirements</li>
              <li>The contract must specifically require Additional Insured status</li>
              <li>Verbal agreements or missing contract language can void coverage</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Which Policies Should List You as Additional Insured?</h2>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">General Liability: Always</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You should ALWAYS be Additional Insured on the vendor's General Liability policy. This is the most critical coverage.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Auto Liability: When Vehicles Are Used</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If the vendor uses vehicles on your property, you should be Additional Insured on their Commercial Auto policy as well.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Workers' Compensation: No</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You cannot be Additional Insured on Workers' Comp. Instead, require a "Waiver of Subrogation" endorsement that prevents the insurance company from suing you to recover claim costs.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Quick Reference Guide</h2>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 font-bold text-[#0A0F1E]">Designation</th>
                    <th className="text-left py-2 font-bold text-[#0A0F1E]">You Get</th>
                    <th className="text-left py-2 font-bold text-[#0A0F1E]">You DON'T Get</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-semibold">Certificate Holder</td>
                    <td className="py-3">• Proof vendor has insurance<br/>• Possibly cancellation notice</td>
                    <td className="py-3">• Any coverage<br/>• Legal defense<br/>• Claim payment</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Additional Insured</td>
                    <td className="py-3">• Coverage under their policy<br/>• Legal defense<br/>• Claim payments<br/>• Protection from lawsuits</td>
                    <td className="py-3">• Guaranteed notification<br/>• Control over the policy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#3A4F6A] p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-[#0A0F1E] mb-2">Bottom Line</h3>
              <p className="text-gray-700">
                Certificate Holder = you get paperwork. Additional Insured = you get protection. Never start a project where you're only the Certificate Holder. The few minutes it takes to verify Additional Insured status can save you from six-figure uninsured claims.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Verify Additional Insured Status Automatically</h3>
            <p className="text-white/90 mb-6">
              Covera's compliance platform checks that you're properly listed as Additional Insured on every vendor certificate—and alerts you when something's missing.
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
              <Link to="/blog/what-is-certificate-of-insurance" className="block p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <span className="text-sm text-[#3A4F6A] font-medium">Basics</span>
                <h4 className="font-bold text-[#0A0F1E] mt-1">What Is a Certificate of Insurance (COI)?</h4>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function ExpiredVendorInsurance() {
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
              Risk Management
            </span>
          </div>

          <h1 className="mb-6 text-[#0A0F1E]">
            What To Do When Your Vendor's Insurance Expires
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 28, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">6 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              You just discovered a vendor has been working on your property with expired insurance. Here's your step-by-step action plan to minimize liability and prevent this from happening again.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 1: Immediately Stop All Work</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The moment you discover expired coverage, you must:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Halt all active projects:</strong> Contact the vendor immediately and suspend all work</li>
              <li><strong>Secure the site:</strong> If work is mid-project, ensure the area is safe and secure</li>
              <li><strong>Document the stoppage:</strong> Note the date, time, and reason in your records</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              Do NOT allow work to continue while "waiting for the updated certificate." Every hour they work uninsured increases your liability exposure.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 2: Send Written Notice</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Email the vendor immediately with:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
              <p className="text-sm font-mono text-gray-700 mb-2"><strong>Subject:</strong> URGENT: Work Suspended Due to Expired Insurance</p>
              <p className="text-sm font-mono text-gray-700 mb-4"><strong>Body:</strong></p>
              <p className="text-sm text-gray-700 italic">
                "This is to inform you that all work has been suspended effective immediately due to expired insurance coverage. Our records show your [General Liability/Workers' Comp/Auto] policy expired on [DATE].<br/><br/>
                
                Per our vendor agreement, all work must cease until proof of current insurance is provided. Please provide an updated Certificate of Insurance showing active coverage with the required limits and our company listed as Additional Insured.<br/><br/>
                
                Work may not resume until we receive and verify current insurance documentation."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 3: Verify the Gap Period</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Determine exactly when coverage lapsed:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Check the expiration date on the last valid COI</li>
              <li>Review when the vendor last worked on your property</li>
              <li>Calculate how many days they worked without coverage</li>
              <li>Document any incidents or near-misses during that period</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 4: Notify Your Insurance Broker</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If the vendor worked uninsured for any period, inform your insurance broker:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Provide details about the gap in coverage</li>
              <li>Ask about your exposure during that period</li>
              <li>Document their advice in writing</li>
              <li>Follow any additional steps they recommend</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 5: Request and Verify New Coverage</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When the vendor provides an updated COI:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Check the effective date:</strong> Ensure no gap exists between old and new policies</li>
              <li><strong>Verify coverage amounts:</strong> Confirm they meet your minimum requirements</li>
              <li><strong>Confirm Additional Insured status:</strong> Your company must be listed</li>
              <li><strong>Call the insurance agency:</strong> Always verify directly—don't just accept the certificate</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Watch for Backdating</h3>
              <p className="text-red-900">
                Some vendors may ask their insurance agent to backdate a policy to cover the gap. This is insurance fraud. Do not accept backdated certificates. If you discover this, consult legal counsel immediately.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 6: Decide Whether to Continue the Relationship</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Consider these factors:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>First offense vs. pattern:</strong> Is this the first lapse or a recurring issue?</li>
              <li><strong>Response time:</strong> Did they provide updated coverage immediately or delay?</li>
              <li><strong>Communication:</strong> Were they forthcoming or did you have to chase them?</li>
              <li><strong>Risk level:</strong> High-risk vendors (roofing, electrical) deserve stricter standards</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              Many businesses implement a "three strikes" policy: first lapse is a warning, second is final warning, third is termination.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Step 7: Document Everything</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Maintain detailed records of:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>When you discovered the lapse</li>
              <li>Actions you took to stop work</li>
              <li>All communication with the vendor</li>
              <li>Verification calls to the insurance agency</li>
              <li>New certificate and verification of coverage</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              This documentation is critical if a claim arises later. It shows you took reasonable steps to ensure compliance.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Prevention: Never Let This Happen Again</h2>
            
            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Set Up Automatic Reminders</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Track expiration dates and send reminders 60, 30, and 15 days before policies expire. Automated compliance software does this without manual effort.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Quarterly Audits</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Review all vendor files quarterly to catch any gaps before vendors start work.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Pre-Work Verification</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Before any project starts, verify insurance is current—even for vendors you've worked with for years.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Contract Language</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Include clear terms in vendor contracts:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Work stops immediately if coverage lapses</li>
              <li>Vendor is responsible for any claims during uninsured periods</li>
              <li>Repeated lapses are grounds for contract termination</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-[#3A4F6A] p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-[#0A0F1E] mb-2">Key Takeaway</h3>
              <p className="text-gray-700">
                Discovering expired vendor insurance is serious, but it's manageable with immediate action and proper documentation. The real risk is NOT discovering it until after an incident occurs. Prevention through systematic tracking is always cheaper than damage control.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Never Miss an Expiration Again</h3>
            <p className="text-white/90 mb-6">
              Covera automatically tracks expiration dates and sends renewal reminders before policies lapse—so you never discover expired coverage after the fact.
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
              <Link to="/blog/track-vendor-insurance-expiration-automatically" className="block p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <span className="text-sm text-[#3A4F6A] font-medium">How-To Guides</span>
                <h4 className="font-bold text-[#0A0F1E] mt-1">How to Track Vendor Insurance Expiration Automatically</h4>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
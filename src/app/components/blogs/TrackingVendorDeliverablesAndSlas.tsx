import { Link } from 'react-router';
import { ArrowLeft, Target, BarChart3, AlertCircle } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function TrackingVendorDeliverablesAndSlas() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogTrackingVendorDeliverablesAndSlas} />
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
                Performance
              </span>
              <span className="text-gray-500 text-sm">7 min read</span>
            </div>
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              How to Track Vendor Deliverables & SLAs Effectively
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Are you getting what you pay for? Learn how to monitor vendor performance, enforce SLAs, and track critical deliverables without the chaos.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published January 16, 2026
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The "Set It and Forget It" Trap</h2>
              <p className="text-gray-700 leading-relaxed">
                Many companies sign a contract and then assume the vendor will deliver as promised. Six months later, they realize deadlines were missed, quality is subpar, and service credits were never claimed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Active vendor management requires tracking two main things: <strong>Deliverables</strong> (specific outputs) and <strong>SLAs</strong> (performance standards).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Defining Service Level Agreements (SLAs)</h2>
              <p className="text-gray-700 leading-relaxed">
                An SLA defines the expected level of service. It should be measurable, specific, and tied to penalties or credits.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#3A4F6A]" /> Good SLA Examples
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• "99.9% Uptime guarantee per month"</li>
                    <li>• "Customer support response within 1 hour"</li>
                    <li>• "Report delivery by the 5th of each month"</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" /> Bad SLA Examples
                  </h3>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li>• "High availability" (Vague)</li>
                    <li>• "Prompt response time" (Subjective)</li>
                    <li>• "Regular reporting" (Undefined)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Strategies for Tracking Deliverables</h2>
              <p className="text-gray-700 leading-relaxed">
                Deliverables are tangible items like a software feature, a marketing report, or a completed renovation. Here is how to track them:
              </p>
              <ul className="space-y-4 text-gray-700 my-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                  <div>
                    <strong>Centralize Milestone Dates:</strong> Don't leave dates buried in a PDF contract. Extract them into a calendar or tracking system.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                  <div>
                    <strong>Assign Owners:</strong> Every deliverable needs an internal owner responsible for verifying it was received and acceptable.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                  <div>
                    <strong>Set Alerts:</strong> Configure reminders 7, 30, and 60 days before a major deliverable is due to check progress.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-orange-500 rounded-xl p-6">
              <h3 className="font-semibold text-[#0A0F1E] mb-2">The Cost of Missed SLAs</h3>
              <p className="text-gray-700 mb-0">
                Most contracts include "Service Credits" for missed SLAs. For example, if uptime drops below 99.9%, you might be owed 10% of your monthly fee back. If you aren't tracking this, you are literally leaving money on the table.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Automating the Process</h2>
              <p className="text-gray-700 leading-relaxed">
                Manual tracking in spreadsheets works for 1-2 vendors, but it breaks down at scale. Modern vendor management platforms (like Covera) can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Extract dates and SLAs from uploaded contracts automatically.</li>
                <li>Send automated reminders to vendors before due dates.</li>
                <li>Provide a dashboard view of "At Risk" deliverables.</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Never Miss a Deliverable Again</h3>
              <p className="text-white/90 mb-6">
                Covera's contract management engine tracks deliverables and SLAs for you, sending alerts before things go off track.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-white text-[#3A4F6A] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Track My Contracts
              </Link>
            </div>

          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
import { Link } from 'react-router';
import { CheckCircle, Shield, Clock, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { PremiumCheck } from './ui/PremiumCheck';
import LandingNav from './LandingNav';
import Footer from './Footer';
import MarketingFeatures from './MarketingFeatures';

export default function HowToTrackVendorCompliance() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
              Ultimate Guide
            </span>
          </div>
          <h1 
            className="mb-6 text-4xl md:text-5xl leading-tight"
            style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            How to Track Vendor Insurance Compliance in 2026
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive step-by-step guide for property managers, construction firms, and enterprise teams managing vendor compliance and Certificate of Insurance (COI) tracking.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Updated January 2026</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Free Checklist Included</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl mb-6 text-[#0A0F1E]">Table of Contents</h2>
            <div className="space-y-3">
              <a href="#why-matters" className="block text-[#3A4F6A] hover:underline">1. Why Vendor Insurance Compliance Matters</a>
              <a href="#common-challenges" className="block text-[#3A4F6A] hover:underline">2. Common Challenges in COI Tracking</a>
              <a href="#manual-process" className="block text-[#3A4F6A] hover:underline">3. The Manual Tracking Process (Step-by-Step)</a>
              <a href="#automated-approach" className="block text-[#3A4F6A] hover:underline">4. The Automated Approach (Modern Solution)</a>
              <a href="#best-practices" className="block text-[#3A4F6A] hover:underline">5. Best Practices for Compliance Management</a>
              <a href="#red-flags" className="block text-[#3A4F6A] hover:underline">6. Red Flags to Watch For</a>
              <a href="#conclusion" className="block text-[#3A4F6A] hover:underline">7. Conclusion & Free Tools</a>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Section 1 */}
          <div id="why-matters">
            <h2 className="mb-6 text-[#0A0F1E]">Why Vendor Insurance Compliance Matters</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                When you hire vendors, contractors, or service providers, your organization assumes significant financial and legal risk if those vendors are uninsured or underinsured. A single incident—whether it's property damage, bodily injury, or professional errors—can result in lawsuits, insurance claim denials, and devastating financial losses.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Real Cost Example</h3>
                    <p className="text-red-800 mb-0">
                      A property management company in Texas was sued for $2.3M after an uninsured HVAC contractor caused a fire. The vendor's COI had expired 6 months prior, but no one on the team noticed. The insurance claim was denied, and the company had to pay out of pocket.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Tracking vendor insurance compliance protects you from:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <Shield className="w-8 h-8 text-[#3A4F6A] mb-3" />
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Legal Liability</h3>
                  <p className="text-gray-600 mb-0">
                    You can be held legally responsible for damages caused by uninsured vendors working on your property or projects.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <FileText className="w-8 h-8 text-[#3A4F6A] mb-3" />
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Insurance Denials</h3>
                  <p className="text-gray-600 mb-0">
                    Your own insurance may deny claims if you failed to verify vendor coverage before the incident.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-[#3A4F6A] mb-3" />
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Regulatory Fines</h3>
                  <p className="text-gray-600 mb-0">
                    Many industries (construction, healthcare, government) have strict compliance requirements with steep penalties.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-[#3A4F6A] mb-3" />
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Project Delays</h3>
                  <p className="text-gray-600 mb-0">
                    Discovering expired insurance mid-project can halt operations and cause costly delays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div id="common-challenges">
            <h2 className="mb-6 text-[#0A0F1E]">Common Challenges in COI Tracking</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Most organizations struggle with vendor compliance tracking for these reasons:
              </p>
              
              <div className="space-y-4 my-8">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Volume Overload</h3>
                    <p className="text-gray-600 mb-0">
                      Managing 50+ vendors means tracking hundreds of insurance documents, each with different expiration dates, coverage types, and renewal schedules.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Manual Email Chaos</h3>
                    <p className="text-gray-600 mb-0">
                      COIs arrive via email as PDF attachments. They get buried in inboxes, saved to random folders, or accidentally deleted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">No Expiration Alerts</h3>
                    <p className="text-gray-600 mb-0">
                      Without automated reminders, policies expire silently. You only discover the lapse when an incident occurs or during an audit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Incomplete Coverage Verification</h3>
                    <p className="text-gray-600 mb-0">
                      Not all COIs are equal. Many fail to meet minimum coverage requirements, don't name you as Additional Insured, or have incorrect policy details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#3A4F6A] text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Multi-Department Silos</h3>
                    <p className="text-gray-600 mb-0">
                      Operations uses one vendor. Finance uses the same vendor. But neither team knows the vendor's insurance expired 90 days ago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div id="manual-process">
            <h2 className="mb-6 text-[#0A0F1E]">The Manual Tracking Process (Step-by-Step)</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                If you're tracking vendor insurance manually, here's the complete workflow most teams follow:
              </p>

              <div className="bg-gray-50 rounded-xl p-8 my-8 space-y-6">
                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 1: Collect Vendor Information</h3>
                    <p className="text-gray-600 mb-0">
                      Create a master spreadsheet with vendor names, contact info, service type, and contract start/end dates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 2: Request COIs</h3>
                    <p className="text-gray-600 mb-0">
                      Email each vendor requesting Certificate of Insurance with specific coverage requirements (General Liability, Workers Comp, Auto, etc.).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 3: Review Each Document</h3>
                    <p className="text-gray-600 mb-0">
                      Manually verify: expiration dates, coverage limits, Additional Insured status, policy numbers match, no exclusions that affect your risk.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 4: Store Documents Securely</h3>
                    <p className="text-gray-600 mb-0">
                      Save PDFs to shared drive (e.g., "Vendor_Insurance_2026" folder) with consistent file naming: "VendorName_COI_ExpirationDate.pdf"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 5: Add to Tracking Spreadsheet</h3>
                    <p className="text-gray-600 mb-0">
                      Input: Policy expiration date, coverage limits, date received, next renewal date (30/60/90 days before expiration).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 6: Set Calendar Reminders</h3>
                    <p className="text-gray-600 mb-0">
                      Create manual calendar alerts for renewal follow-ups. If vendor doesn't respond, escalate and potentially suspend work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PremiumCheck className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">Step 7: Repeat Monthly</h3>
                    <p className="text-gray-600 mb-0">
                      Review spreadsheet weekly to check for upcoming expirations. Send reminder emails 90, 60, and 30 days before each deadline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
                <p className="text-amber-900 font-semibold mb-2">Time Investment:</p>
                <p className="text-amber-800 mb-0">
                  For a team managing 50 vendors, this manual process takes <strong>15-20 hours per month</strong> on average—not counting emergency requests or compliance audits.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div id="automated-approach">
            <h2 className="mb-6 text-[#0A0F1E]">The Automated Approach (Modern Solution)</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Modern vendor compliance platforms eliminate 90% of the manual work. Here's how automation changes the game:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Automatic COI Collection</h3>
                  <p className="text-gray-600 mb-0">
                    Vendors upload documents directly to a secure portal. No more email attachments or lost PDFs.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Smart Expiration Alerts</h3>
                  <p className="text-gray-600 mb-0">
                    Automated reminders sent to vendors and your team before expiration.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Coverage Verification</h3>
                  <p className="text-gray-600 mb-0">
                    System flags insufficient coverage limits, missing Additional Insured status, or incorrect policy details.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Real-Time Compliance Dashboard</h3>
                  <p className="text-gray-600 mb-0">
                    See which vendors are compliant, at-risk, or expired at a glance. Filter by department, location, or risk level.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Audit-Ready Reports</h3>
                  <p className="text-gray-600 mb-0">
                    Generate compliance reports in seconds. Perfect for insurance audits, legal reviews, or board presentations.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#3A4F6A]/5 to-[#3A4F6A]/10 rounded-xl p-6 border border-[#3A4F6A]/20">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Contract Integration</h3>
                  <p className="text-gray-600 mb-0">
                    Link insurance requirements directly to vendor contracts. Ensure compliance before work begins.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
                <p className="text-green-900 font-semibold mb-2">Time Saved:</p>
                <p className="text-green-800 mb-0">
                  Teams using automated compliance platforms reduce tracking time by <strong>85%</strong> (from 20 hours/month to 3 hours/month) while improving accuracy and reducing risk.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Visual Feature Breakdown */}
      <MarketingFeatures />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl p-12 text-center text-white my-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Vendor Compliance?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Covera helps property managers, construction firms, and enterprises track vendor insurance compliance automatically—without spreadsheets or email chaos.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3A4F6A] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free 7-Day Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/70 mt-4">Setup in 5 minutes</p>
          </div>

          {/* Section 5 */}
          <div id="best-practices">
            <h2 className="mb-6 text-[#0A0F1E]">Best Practices for Compliance Management</h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6">
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">1. Set Clear Minimum Requirements</h3>
                  <p className="text-gray-600 mb-0">
                    Define exact coverage requirements upfront: General Liability ($1M/$2M), Workers Comp (statutory limits), Auto Liability ($1M combined single limit), and Additional Insured status. Include these in every vendor contract.
                  </p>
                </div>

                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">2. Verify Before Work Begins</h3>
                  <p className="text-gray-600 mb-0">
                    Never allow a vendor on-site or start work until you've reviewed and approved their current COI. Make this a non-negotiable policy.
                  </p>
                </div>

                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">3. Track Contract Renewals Separately</h3>
                  <p className="text-gray-600 mb-0">
                    Insurance expiration dates rarely align with contract end dates. Track both independently to avoid gaps in coverage.
                  </p>
                </div>

                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">4. Use 90-Day Lead Time</h3>
                  <p className="text-gray-600 mb-0">
                    Start renewal reminders 90 days before expiration. Vendors often need 30-60 days to get updated COIs from their insurance agent.
                  </p>
                </div>

                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">5. Implement a Suspension Policy</h3>
                  <p className="text-gray-600 mb-0">
                    Have a clear policy: Any vendor with expired insurance is immediately suspended from all active projects until coverage is restored.
                  </p>
                </div>

                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="text-lg font-semibold text-[#0A0F1E] mb-2">6. Conduct Quarterly Audits</h3>
                  <p className="text-gray-600 mb-0">
                    Review your entire vendor insurance portfolio quarterly. Check for upcoming expirations, outdated documents, and compliance gaps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div id="red-flags">
            <h2 className="mb-6 text-[#0A0F1E]">Red Flags to Watch For</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Not all Certificates of Insurance are valid or sufficient. Watch for these warning signs:
              </p>

              <div className="bg-red-50 rounded-xl p-8 my-8 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>Missing Additional Insured Status:</strong> You're not listed as Additional Insured, meaning their policy won't protect you in a lawsuit.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>Coverage Below Minimums:</strong> General Liability shows $500K when you require $1M+. This is a deal-breaker.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>Suspicious Expiration Dates:</strong> Policy expired yesterday but COI was issued today. Verify with insurance company directly.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>No Workers Comp:</strong> If vendor has employees but no Workers Comp coverage, you could be liable for workplace injuries.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>Wrong Certificate Holder:</strong> COI lists a different company name. Must match your organization exactly.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-red-900 mb-0">
                    <strong>Handwritten Changes:</strong> Any handwritten modifications to a printed COI are invalid and unenforceable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div id="conclusion">
            <h2 className="mb-6 text-[#0A0F1E]">Conclusion & Free Tools</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Effective vendor insurance compliance tracking is essential to protect your organization from costly legal and financial risks. Whether you choose the manual spreadsheet approach or invest in automated compliance software, the key is consistency—never let a vendor work without current, verified insurance coverage.
              </p>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 my-8">
                <h3 className="text-xl font-semibold text-[#0A0F1E] mb-4">Free Resources</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PremiumCheck />
                    <span className="text-gray-700">Vendor Compliance Checklist (PDF) - Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumCheck />
                    <span className="text-gray-700">COI Tracking Spreadsheet Template - Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumCheck />
                    <span className="text-gray-700">Insurance Requirements by State Guide - Coming Soon</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For organizations managing 25+ vendors, manual tracking becomes unsustainable. <strong>Covera</strong> automates the entire compliance workflow—from COI collection to expiration alerts to audit-ready reporting—saving teams 15+ hours per month while eliminating compliance gaps.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0A0F1E] mb-4">
            Stop Managing Vendor Compliance in Spreadsheets
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join property managers, construction firms, and enterprise teams using Covera to automate vendor insurance tracking.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3A4F6A] text-white rounded-xl font-semibold hover:bg-[#2a3f5a] transition-colors"
          >
            Start Free 7-Day Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">Setup takes 5 minutes • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
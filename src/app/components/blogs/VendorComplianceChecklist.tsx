import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft, Download, CheckSquare } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function VendorComplianceChecklist() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogComplianceChecklist} />
      <LandingNav />
      
      <article className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#3A4F6A] hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
                Templates
              </span>
              <span className="text-gray-500 text-sm">5 min read</span>
            </div>
            <h1 className="mb-6 text-[#0A0F1E]">
              Vendor Compliance Checklist (Free Template)
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your step by step checklist for onboarding vendors, verifying insurance, and maintaining compliance throughout the relationship.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published December 30, 2025
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <p className="text-gray-700 leading-relaxed">
                Vendor compliance isn't complicated, but it does require consistency. Miss one step and you open yourself up to massive legal and financial risk.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Use this checklist every single time you onboard a new vendor or renew an existing relationship. Print it out, save it to your desktop, or better yet, build it into your vendor management software so nothing gets missed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#3A4F6A]/10 to-[#3A4F6A]/5 rounded-2xl p-8 border border-[#3A4F6A]/20">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-[#3A4F6A]" />
                <h3 className="text-xl font-bold text-[#0A0F1E] mb-0">Free Download</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Get this checklist as a printable PDF (coming soon) or use the version below to build your own compliance process.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-6">Phase 1: Before You Hire the Vendor</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Define Your Insurance Requirements</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Before you even contact the vendor, know exactly what coverage you need them to carry. This should be standardized across all vendors in the same category.
                    </p>
                    <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
                      <p className="mb-2"><strong>Typical minimums:</strong></p>
                      <ul className="space-y-1 ml-4">
                        <li>• General Liability: $1M per occurrence / $2M aggregate</li>
                        <li>• Workers Compensation: Statutory limits (if they have employees)</li>
                        <li>• Commercial Auto: $1M combined single limit (if using vehicles)</li>
                        <li>• Professional Liability: $1M (for consultants/professionals)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Add Insurance Requirements to Contract</h3>
                    <p className="text-gray-700 text-sm">
                      Your vendor agreement must explicitly state the required coverage types, limits, Additional Insured requirements, and what happens if insurance lapses (immediate suspension).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Request Certificate of Insurance (COI)</h3>
                    <p className="text-gray-700 text-sm">
                      Send the vendor a clear email outlining exactly what you need. Include your company's legal name and address for the Certificate Holder field.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-6">Phase 2: Reviewing the Certificate of Insurance</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Verify Vendor Name Matches</h3>
                    <p className="text-gray-700 text-sm">
                      The business name on the COI should exactly match the name on your contract. Watch for DBAs (Doing Business As) or LLC variations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Check All Policies Are Active</h3>
                    <p className="text-gray-700 text-sm">
                      Look at the effective dates for each policy. All coverage should be current (effective date in the past, expiration date in the future). If you see an expiration date that already passed, that's a major red flag.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Confirm Coverage Limits Meet Minimums</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Each policy type should meet or exceed your required limits. Don't accept anything less.
                    </p>
                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
                      <strong>Reject if:</strong> General Liability shows $500K but you require $1M
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Verify You're Listed as Additional Insured</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      This is critical. Look for a checkbox or note on the COI that says "Additional Insured" with your company name. Being the Certificate Holder is NOT enough.
                    </p>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                      <strong>Pro Tip:</strong> Additional Insured status typically only applies to General Liability. Don't expect it on Workers Comp or Auto policies.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Check Certificate Holder Information</h3>
                    <p className="text-gray-700 text-sm">
                      Your company name and address should be listed correctly in the Certificate Holder box. If it shows someone else's name, reject the COI and request a corrected version.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Look for Handwritten Changes</h3>
                    <p className="text-gray-700 text-sm">
                      Any handwritten modifications to a printed COI are invalid. If something was filled in by hand or crossed out, the insurance company needs to issue a new certificate with the correct information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Verify with Insurance Company (Optional but Recommended)</h3>
                    <p className="text-gray-700 text-sm">
                      For high risk vendors or large projects, call the insurance agent listed on the COI to confirm the policy is actually active. This takes 3 minutes and could save you from fraudulent certificates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-6">Phase 3: Documentation and Record Keeping</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Save COI to Central Repository</h3>
                    <p className="text-gray-700 text-sm">
                      Store the PDF in a shared drive or compliance platform where your entire team can access it. Use consistent file naming like "VendorName_COI_ExpirationDate.pdf"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Log Expiration Dates</h3>
                    <p className="text-gray-700 text-sm">
                      Record the expiration date for each policy type in your tracking system. Note that different policies may expire on different dates (General Liability might renew in March while Workers Comp renews in July).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Set Renewal Reminders</h3>
                    <p className="text-gray-700 text-sm">
                      Create calendar alerts or configure your compliance software to send reminders at 90, 60, and 30 days before each policy expires. The vendor needs time to renew and send you the updated COI.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Document Your Review</h3>
                    <p className="text-gray-700 text-sm">
                      Note who reviewed the COI, when it was approved, and any issues that were found and resolved. This creates an audit trail proving you did your due diligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-6">Phase 4: Ongoing Compliance Monitoring</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Send Renewal Requests 90 Days Before Expiration</h3>
                    <p className="text-gray-700 text-sm">
                      Don't wait until the last minute. Give vendors plenty of lead time to renew their policies and send you updated certificates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Follow Up at 60 and 30 Days</h3>
                    <p className="text-gray-700 text-sm">
                      If you haven't received the renewal COI, send increasingly urgent reminders. Make it clear that work will be suspended if insurance lapses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Suspend Vendor if Insurance Expires</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      This is non negotiable. If a vendor's insurance expires, they must stop all work immediately until you receive and approve a current COI.
                    </p>
                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
                      <strong>Zero Tolerance:</strong> No exceptions to this rule. Not even for "just one day" or "they said the renewal is processing."
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Review All COIs Upon Renewal</h3>
                    <p className="text-gray-700 text-sm">
                      When you receive an updated certificate, go through the same verification process as initial onboarding. Don't just file it away. Coverage limits can change, Additional Insured status might not carry over, or new exclusions could appear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">Conduct Quarterly Compliance Audits</h3>
                    <p className="text-gray-700 text-sm">
                      Every 3 months, review your entire vendor portfolio. Check for upcoming expirations, missing documents, vendors who stopped responding to renewal requests, and any gaps in coverage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-6">Phase 5: When Things Go Wrong</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">If Vendor Won't Provide COI</h3>
                    <p className="text-gray-700 text-sm">
                      Don't hire them. Period. A vendor who refuses to provide proof of insurance is either uninsured (massive liability) or trying to hide something (also bad). Walk away.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">If COI Doesn't Meet Requirements</h3>
                    <p className="text-gray-700 text-sm">
                      Send it back with specific instructions on what needs to be corrected. Don't start work until you receive an acceptable certificate. The vendor can either increase their coverage or you find someone else.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">If You Discover Expired Coverage Mid Project</h3>
                    <p className="text-gray-700 text-sm">
                      Stop work immediately. Document the discovery date and time. Notify the vendor they're suspended until current COI is provided. Assess whether you need to bring in a replacement vendor or if the project can wait.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded border-2 border-[#3A4F6A] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-[#0A0F1E] mb-2">If an Incident Occurs</h3>
                    <p className="text-gray-700 text-sm">
                      Pull the vendor's COI immediately and verify coverage was active on the date of the incident. Contact your insurance company and legal counsel before discussing anything with the vendor or their insurance. Document everything.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Checklist Summary</h3>
              <p className="text-blue-800 mb-4">Print this quick reference and keep it at your desk:</p>
              <div className="space-y-2 text-sm text-blue-900">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Define insurance requirements before hiring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Request COI with specific coverage details</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Verify all policies are current and meet minimums</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Confirm Additional Insured status</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 mt-0.5" />
                  <span>Save to central repository with expiration tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Set 90/60/30 day renewal reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Suspend vendors with lapsed coverage (zero tolerance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Conduct quarterly compliance audits</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Stop Doing This Manually</h2>
              <p className="text-gray-700 leading-relaxed">
                This checklist works, but it's labor intensive. Every vendor goes through this same process. Every renewal cycle repeats it.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Compliance software automates 90% of these steps. COIs get uploaded to a portal, data gets extracted automatically, reminders go out on schedule, and you get real time visibility into your entire vendor base.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For small teams managing dozens or hundreds of vendors, automation isn't optional anymore. It's the only way to maintain consistent compliance without burning out your staff.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Never Miss a Vendor Compliance Deadline</h3>
              <p className="text-white/90 mb-6">
                Covera handles every step of this process automatically so you never miss a renewal or work with an uninsured vendor.
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
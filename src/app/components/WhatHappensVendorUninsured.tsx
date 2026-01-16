import { Link } from 'react-router';
import { AlertTriangle, Shield, DollarSign, Scale, FileText, Clock, ArrowRight } from 'lucide-react';
import LandingNav from './LandingNav';

export default function WhatHappensVendorUninsured() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-sm font-medium">
              Risk Assessment
            </span>
          </div>
          <h1 
            className="mb-6 text-4xl md:text-5xl leading-tight"
            style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
          >
            What Happens If a Vendor Is Uninsured? The Real Costs & Consequences
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Understanding the legal, financial, and operational risks when vendors work without proper insurance coverage—and how to protect your organization.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Updated January 2026</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </div>
      </section>

      {/* Critical Stats */}
      <section className="py-12 px-6 bg-red-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">$2.3M</div>
              <p className="text-gray-700">Average lawsuit settlement when uninsured vendors cause injury or damage</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">78%</div>
              <p className="text-gray-700">Of insurance claims denied due to unverified vendor coverage</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">6-18</div>
              <p className="text-gray-700">Months average litigation duration, costing $50K-$200K in legal fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Real Case Studies */}
          <div>
            <h2 className="mb-8 text-[#0A0F1E]">Real Case Studies: When Vendors Were Uninsured</h2>
            
            <div className="space-y-8">
              {/* Case Study 1 */}
              <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0A0F1E] mb-2">Case #1: The $2.3M Fire</h3>
                    <p className="text-sm text-gray-600">Property Management • Dallas, TX • 2023</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p><strong>What Happened:</strong> An HVAC contractor's employee accidentally started a fire during routine maintenance at a 200-unit apartment complex. The fire caused $800K in property damage and displaced 47 residents.</p>
                  <p><strong>The Problem:</strong> The contractor's General Liability insurance had expired 6 months earlier. The property management company had never updated their tracking spreadsheet.</p>
                  <p><strong>The Outcome:</strong> The property management company was sued for negligence. Their own insurance denied the claim because they failed to verify vendor coverage. Final cost: <strong>$2.3M in settlements + $180K in legal fees</strong>. The company filed for bankruptcy 14 months later.</p>
                </div>
              </div>

              {/* Case Study 2 */}
              <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0A0F1E] mb-2">Case #2: The $950K Workplace Injury</h3>
                    <p className="text-sm text-gray-600">Construction • Phoenix, AZ • 2024</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p><strong>What Happened:</strong> A subcontractor's employee fell from scaffolding on a commercial construction project, suffering permanent spinal injuries.</p>
                  <p><strong>The Problem:</strong> The subcontractor claimed to have Workers Compensation insurance but was actually operating without coverage to cut costs.</p>
                  <p><strong>The Outcome:</strong> Because the general contractor never verified the COI or contacted the insurance company directly, they were held liable. Final cost: <strong>$950K settlement + $140K legal fees + 8-month project delay</strong>. The GC's insurance premium increased 340% at renewal.</p>
                </div>
              </div>

              {/* Case Study 3 */}
              <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0A0F1E] mb-2">Case #3: The $1.4M Data Breach</h3>
                    <p className="text-sm text-gray-600">Healthcare • Chicago, IL • 2024</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p><strong>What Happened:</strong> An IT vendor with access to patient records suffered a ransomware attack, exposing 12,000 patient files containing PHI/PII data.</p>
                  <p><strong>The Problem:</strong> The vendor had Professional Liability (E&O) insurance when initially hired, but it lapsed 9 months before the breach. The hospital's compliance team never tracked vendor insurance renewals.</p>
                  <p><strong>The Outcome:</strong> The hospital faced HIPAA fines, class-action lawsuits, and reputation damage. Final cost: <strong>$1.4M in fines + settlements + $300K breach remediation + patient notification costs</strong>. The hospital lost 23% of its patient base within 6 months.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The 6 Major Risks */}
          <div>
            <h2 className="mb-8 text-[#0A0F1E]">The 6 Major Risks of Working with Uninsured Vendors</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">1. You Become Liable for Their Mistakes</h3>
                    <p className="text-gray-700 mb-3">
                      When an uninsured vendor causes injury, property damage, or financial loss, <strong>you are legally responsible</strong>. Courts often hold the hiring party liable under the theory of "negligent hiring" or "vicarious liability."
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-0">
                        <strong>Legal Principle:</strong> If you hire a vendor without verifying their insurance, courts view this as negligence. You "should have known" better, making you liable for damages even though you didn't cause the incident.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">2. Your Insurance Won't Cover It</h3>
                    <p className="text-gray-700 mb-3">
                      Most commercial insurance policies have <strong>"hired/non-owned" exclusions</strong>. If you allow an uninsured vendor to work and they cause damage, your insurer can deny the claim entirely.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>What Your Policy Likely Says:</strong> "Coverage does not apply to liability assumed by the insured arising from work performed by contractors who do not maintain required insurance limits."
                      </p>
                      <p className="text-sm text-gray-700 mb-0">
                        Translation: If you didn't verify their COI, <strong>you're on your own</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">3. Regulatory Fines & Penalties</h3>
                    <p className="text-gray-700 mb-3">
                      Many industries have strict compliance requirements mandating contractor insurance verification:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>OSHA Construction:</strong> $15,625 per violation (up to $156,259 for willful violations)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>HUD Housing Projects:</strong> Contract termination + 3-year debarment from federal projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>Healthcare (HIPAA):</strong> $100-$50,000 per violation (up to $1.5M annually)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>State Licensing Boards:</strong> Professional license suspension or revocation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">4. Project Delays & Operational Disruption</h3>
                    <p className="text-gray-700 mb-3">
                      When you discover mid-project that a vendor's insurance expired, you have to:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Immediately halt all work (exposing you to breach-of-contract claims from clients)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Find replacement vendors mid-stream (higher costs, schedule delays)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Rework contracts and onboarding (2-4 week delay minimum)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Pay liquidated damages for missed deadlines</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">5. Skyrocketing Insurance Premiums</h3>
                    <p className="text-gray-700 mb-3">
                      After a claim involving an uninsured vendor, your own insurance costs will explode:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-gray-700"><strong>First Renewal After Incident:</strong> 150-400% premium increase</p>
                      <p className="text-sm text-gray-700"><strong>Claims History Impact:</strong> 5-7 years of elevated rates</p>
                      <p className="text-sm text-gray-700"><strong>Coverage Restrictions:</strong> Higher deductibles, lower limits, exclusions added</p>
                      <p className="text-sm text-gray-700 mb-0"><strong>Worst Case:</strong> Policy non-renewal, forcing you into expensive "high-risk" markets</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0F1E] mb-3">6. Reputation Damage & Lost Business</h3>
                    <p className="text-gray-700 mb-3">
                      Public lawsuits, regulatory actions, and media coverage destroy trust:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Existing clients terminate contracts due to perceived risk</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Prospective clients choose competitors with stronger compliance programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Difficult to secure bonding or financing for future projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Negative online reviews and industry reputation damage</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who's Responsible? */}
          <div>
            <h2 className="mb-6 text-[#0A0F1E]">Who's Legally Responsible When a Vendor Is Uninsured?</h2>
            <div className="bg-gray-50 rounded-xl p-8 space-y-6">
              <p className="text-gray-700 text-lg">
                The answer is: <strong className="text-red-600">You both are</strong>—but you (the hiring party) usually end up paying because:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <p className="text-gray-700 mb-0">
                    <strong>The vendor has no assets.</strong> Even if you sue them and win, they have nothing to collect. Many small contractors operate on thin margins or shut down entirely after a major incident.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <p className="text-gray-700 mb-0">
                    <strong>You have "deeper pockets."</strong> Plaintiff attorneys target whoever has money—that's usually you, not the uninsured vendor.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <p className="text-gray-700 mb-0">
                    <strong>Joint and several liability.</strong> In most states, if multiple parties share responsibility, the plaintiff can collect 100% of damages from whichever party can pay—even if that party was only 20% at fault.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Protect Yourself */}
          <div>
            <h2 className="mb-6 text-[#0A0F1E]">How to Protect Your Organization</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ BEFORE Hiring Any Vendor:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Require a current Certificate of Insurance (COI) before work begins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Verify coverage limits meet your minimums (typically $1M+ General Liability)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Confirm you're listed as Additional Insured on the policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Call the insurance company directly to verify the policy is active (don't trust the PDF alone)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Include insurance requirements in written contracts with termination clauses for lapses</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ DURING the Vendor Relationship:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Track all policy expiration dates (set reminders 90, 60, 30 days before)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Request updated COIs immediately upon renewal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Suspend work immediately if insurance lapses (zero tolerance policy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Conduct quarterly compliance audits across all active vendors</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#0A0F1E] mb-3">✅ Use Technology to Eliminate Human Error:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Automated COI tracking software (like Covera) prevents lapses from slipping through</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Real-time expiration alerts notify your team and vendors automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Centralized dashboard shows compliance status across all vendors instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Audit trails prove due diligence if you ever face litigation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Don't Risk Millions Over a $300/Month Software</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Covera automatically tracks vendor insurance compliance so you never work with an uninsured vendor again. Protect your organization from catastrophic risk.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3A4F6A] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free 7-Day Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/70 mt-4">Setup in 5 minutes • Cancel anytime</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F1E] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Covera. All rights reserved. | <Link to="/privacy-policy" className="hover:text-white">Privacy</Link> | <Link to="/terms-of-service" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
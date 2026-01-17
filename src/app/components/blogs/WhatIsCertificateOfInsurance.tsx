import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function WhatIsCertificateOfInsurance() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogWhatIsCOI} />
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
                Basics
              </span>
              <span className="text-gray-500 text-sm">6 min read</span>
            </div>
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              What Is a Certificate of Insurance (COI)?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              If you hire contractors, vendors, or service providers, you need to understand Certificates of Insurance. Here's everything you should know.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published January 4, 2026
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The Simple Definition</h2>
              <p className="text-gray-700 leading-relaxed">
                A Certificate of Insurance (COI) is a one page document that proves a vendor or contractor has active insurance coverage. It's essentially a snapshot of their insurance policies at a specific moment in time.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like a receipt from an insurance company saying "Yes, this business has coverage, and here are the details." The certificate itself is not an insurance policy. It's proof that a policy exists.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
              <p className="text-blue-900 mb-0">
                <strong>Important:</strong> A COI does not grant you coverage. It simply verifies that the vendor has insurance. You need to be listed as "Additional Insured" on their actual policy to receive protection (more on that later).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Why Do You Need a COI From Vendors?</h2>
              <p className="text-gray-700 leading-relaxed">
                Let's say you hire an electrician to rewire your office building. During the work, they accidentally start a fire that causes $500,000 in damage. If that electrician doesn't have insurance, guess who gets sued? You do.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Courts often hold property owners and hiring parties responsible for damages caused by uninsured contractors under the legal theories of "negligent hiring" or "vicarious liability." Basically, you should have known better than to hire someone without proper coverage.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Collecting a COI before work begins protects you in two ways:
              </p>
              <ul className="space-y-3 text-gray-700 my-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>It proves you did your due diligence by verifying coverage before allowing the vendor on site</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>It gives you documentation showing the vendor had active insurance at the time of the incident (critical for defending lawsuits)</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">What's Actually On a Certificate of Insurance?</h2>
              <p className="text-gray-700 leading-relaxed">
                COIs follow a standard format created by the ACORD insurance industry association. Here's what you'll see on most certificates:
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 my-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Producer Information</h3>
                  <p className="text-gray-700 text-sm">The insurance agent or broker who issued the certificate. If you need to verify the COI is legitimate, you can call this number.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Insured Name and Address</h3>
                  <p className="text-gray-700 text-sm">The vendor's legal business name and contact info. Make sure this matches the company you're actually hiring.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Policy Types and Numbers</h3>
                  <p className="text-gray-700 text-sm">Lists all active insurance policies: General Liability, Workers Compensation, Auto Liability, Professional Liability, etc. Each policy has a unique number.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Coverage Limits</h3>
                  <p className="text-gray-700 text-sm">How much each policy will pay out. For example, "$1,000,000 per occurrence / $2,000,000 aggregate" means up to $1M per incident and $2M total per year.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Policy Effective Dates</h3>
                  <p className="text-gray-700 text-sm">When the policy starts and when it expires. This is critical. A COI issued today might show a policy that expired yesterday (a huge red flag).</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Certificate Holder</h3>
                  <p className="text-gray-700 text-sm">Your company name and address. This identifies who requested the certificate. You should always be listed here.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Additional Insured Status</h3>
                  <p className="text-gray-700 text-sm">A checkbox or note indicating whether you're listed as an Additional Insured on the General Liability policy. This is extremely important (see next section).</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Description of Operations</h3>
                  <p className="text-gray-700 text-sm">Optional section describing what work the vendor is performing for you. Useful for record keeping.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Certificate Holder vs Additional Insured (Super Important)</h2>
              <p className="text-gray-700 leading-relaxed">
                This is where people get confused. Being listed as the Certificate Holder is NOT the same as being an Additional Insured.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-3">Certificate Holder</h3>
                  <p className="text-gray-700 text-sm mb-3">You're just the person receiving the document. You have <strong>zero rights</strong> under the vendor's insurance policy.</p>
                  <p className="text-gray-700 text-sm mb-0">If something goes wrong, their insurance company owes you nothing. You're basically just getting a copy of their proof of insurance for your records.</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold text-[#0A0F1E] mb-3">Additional Insured ✓</h3>
                  <p className="text-gray-700 text-sm mb-3">You're <strong>protected by their insurance policy</strong>. If the vendor causes damage or injury, their policy will defend you and pay claims on your behalf.</p>
                  <p className="text-gray-700 text-sm mb-0">This is what you actually want. Always require Additional Insured status in your vendor contracts.</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Common Mistake</h3>
                  <p className="text-red-800 mb-0">
                    Many businesses accept COIs that list them as Certificate Holder but NOT as Additional Insured. Then when an incident happens, they discover the vendor's insurance won't cover them. Don't make this mistake. Always verify Additional Insured status before work starts.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">How Long Is a COI Valid?</h2>
              <p className="text-gray-700 leading-relaxed">
                Here's a trick question: A Certificate of Insurance is only valid at the exact moment it's issued.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Let me explain. If a vendor sends you a COI today showing their General Liability policy expires in 6 months, that's great. But the actual certificate becomes outdated the second their policy changes, gets cancelled, or lapses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This is why smart businesses track policy expiration dates (not certificate issue dates) and request updated COIs whenever policies renew. Many companies use software to automate this process so they don't have to manually check spreadsheets every month.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">What Insurance Types Should You Require?</h2>
              <p className="text-gray-700 leading-relaxed">
                It depends on what the vendor does, but here are the most common requirements:
              </p>
              
              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">General Liability Insurance</h3>
                  <p className="text-gray-700 text-sm">Covers bodily injury and property damage. Minimum $1M per occurrence is standard. This is non negotiable for almost every vendor.</p>
                </div>
                
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Workers Compensation</h3>
                  <p className="text-gray-700 text-sm">Covers their employees if they get injured on the job. Required in most states if the vendor has employees. If they claim to be a sole proprietor with no employees, verify this carefully.</p>
                </div>
                
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Commercial Auto Liability</h3>
                  <p className="text-gray-700 text-sm">If the vendor drives to your location or uses vehicles for work, require this. Minimum $1M combined single limit is standard.</p>
                </div>
                
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Professional Liability (E&O)</h3>
                  <p className="text-gray-700 text-sm">For consultants, IT vendors, accountants, lawyers, or anyone providing professional services. Covers mistakes, errors, or negligence in their work product.</p>
                </div>
                
                <div className="border-l-4 border-[#3A4F6A] pl-6">
                  <h3 className="font-semibold text-[#0A0F1E] mb-2">Umbrella/Excess Liability</h3>
                  <p className="text-gray-700 text-sm">Extra coverage above the base policies. Typically required for high risk work or large projects. Common minimums are $2M to $5M.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Red Flags to Watch For</h2>
              <p className="text-gray-700 leading-relaxed">
                Not all COIs are legitimate. Here's what should make you suspicious:
              </p>
              
              <ul className="space-y-3 text-gray-700 my-6">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span><strong>Handwritten changes:</strong> Any handwritten modifications to a printed COI are invalid. The insurance company must issue a new certificate with the correct info.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span><strong>Expired coverage:</strong> The certificate was issued today but shows a policy expiration date in the past. This is fraud.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span><strong>Missing Additional Insured:</strong> No checkbox or note confirming you're an Additional Insured. Send it back and request a corrected version.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span><strong>Coverage below minimums:</strong> You required $1M General Liability but the COI shows $500K. Not acceptable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span><strong>Wrong Certificate Holder:</strong> Lists a different company name instead of yours. Could be a copy/paste error or the vendor using the same COI for multiple clients.</span>
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                When in doubt, call the insurance agent listed on the certificate and verify everything directly. It takes 3 minutes and could save you from a lawsuit.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">How to Request a COI From Vendors</h2>
              <p className="text-gray-700 leading-relaxed">
                Make it part of your standard onboarding process. Here's a simple email template you can use:
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 my-6 font-mono text-sm text-gray-800">
                <p className="mb-4">Subject: Insurance Requirements for [Project Name]</p>
                <p className="mb-4">Hi [Vendor Name],</p>
                <p className="mb-4">Before we can begin work, we need you to provide a current Certificate of Insurance showing the following coverage:</p>
                <ul className="mb-4 space-y-1 ml-4">
                  <li>• General Liability: $1,000,000 per occurrence / $2,000,000 aggregate</li>
                  <li>• Workers Compensation: Statutory limits</li>
                  <li>• Commercial Auto Liability: $1,000,000 combined single limit</li>
                </ul>
                <p className="mb-4">Please ensure [Your Company Name] is listed as Additional Insured on the General Liability policy and as Certificate Holder.</p>
                <p className="mb-4">You can have your insurance agent email the certificate to [your email] or upload it to [your portal].</p>
                <p className="mb-0">Thanks!</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Bottom Line</h2>
              <p className="text-gray-700 leading-relaxed">
                A Certificate of Insurance is your first line of defense against vendor related lawsuits and financial losses. It's a simple one page document, but understanding what to look for can literally save your business from bankruptcy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Never let a vendor start work without a current, verified COI. And don't just file it away and forget about it. Track expiration dates religiously and request renewals before policies lapse.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you're managing more than a handful of vendors, consider using compliance software to automate the tracking process. It's a lot cheaper than paying a lawyer to defend you in court.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Automate Your Vendor Insurance Tracking</h3>
              <p className="text-white/90 mb-6">
                Covera eliminates the manual work of collecting COIs, tracking expirations, and chasing vendors for renewals.
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

      {/* Footer */}
      <BlogFooter />
    </div>
  );
}
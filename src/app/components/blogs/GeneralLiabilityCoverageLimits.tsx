import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function GeneralLiabilityCoverageLimits() {
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
            What Are Standard General Liability Coverage Limits for Vendors?
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 20, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">6 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Setting appropriate insurance requirements for vendors is a balancing act—too low and you're exposed to risk, too high and you exclude qualified contractors. Here's what industry standards say you should require.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Understanding the Two Key Numbers</h2>
            
            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Per Occurrence Limit</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              This is the maximum the insurance company will pay for a single incident or claim. If one person is injured and sues, this is the limit that applies.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Aggregate Limit</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              This is the maximum the policy will pay for ALL claims during the policy period (typically one year). Once the aggregate limit is exhausted, the policy provides no further coverage—even if individual claims are below the per occurrence limit.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Example:</strong> A $1M per occurrence / $2M aggregate policy will pay up to $1M for any single claim, but no more than $2M total across all claims in a year. Two claims of $1M each would exhaust the policy.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Industry Standard Minimums</h2>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">The Baseline: $1M / $2M</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>$1 million per occurrence / $2 million aggregate</strong> is the most common minimum requirement across industries. This is appropriate for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Low to medium-risk service providers (landscaping, cleaning, painting, general repairs)</li>
              <li>Office-based vendors with minimal on-site work</li>
              <li>Vendors working on small to mid-sized projects</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Elevated Standard: $2M / $4M</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>$2 million per occurrence / $4 million aggregate</strong> is increasingly common for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Construction trades (electrical, plumbing, HVAC, roofing)</li>
              <li>Higher-value properties or projects</li>
              <li>Vendors working in high-liability environments (schools, healthcare facilities, public buildings)</li>
              <li>Businesses with strict risk management requirements</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">High-Risk Requirements: $5M+ / $10M+</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Some situations justify much higher limits:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Large construction projects:</strong> $5M-$10M per occurrence</li>
              <li><strong>High-rise buildings:</strong> Often $10M+ per occurrence</li>
              <li><strong>Public infrastructure:</strong> $5M-$25M depending on project scope</li>
              <li><strong>Hazardous work:</strong> Demolition, environmental remediation, crane operations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              For these scenarios, you'll typically require an Umbrella or Excess Liability policy on top of the base General Liability coverage.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Coverage Limits by Vendor Type</h2>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="font-bold text-[#0A0F1E] mb-4">Property Management Vendors</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>• Janitorial services</span>
                  <span className="font-semibold">$1M / $2M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Landscaping</span>
                  <span className="font-semibold">$1M / $2M</span>
                </li>
                <li className="flex justify-between">
                  <span>• HVAC contractors</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Roofing contractors</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Elevator service</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="font-bold text-[#0A0F1E] mb-4">Construction Subcontractors</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>• General carpentry</span>
                  <span className="font-semibold">$1M / $2M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Painting</span>
                  <span className="font-semibold">$1M / $2M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Electrical</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Plumbing</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Structural steel</span>
                  <span className="font-semibold">$5M / $10M</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="font-bold text-[#0A0F1E] mb-4">Healthcare Facility Vendors</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>• Cleaning services</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• Medical equipment service</span>
                  <span className="font-semibold">$2M / $4M</span>
                </li>
                <li className="flex justify-between">
                  <span>• IT services</span>
                  <span className="font-semibold">$2M / $4M + E&O</span>
                </li>
                <li className="flex justify-between">
                  <span>• Construction/renovation</span>
                  <span className="font-semibold">$5M / $10M</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">When to Require Higher Limits</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Consider increasing requirements when:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Project value is high:</strong> Projects over $1M often justify $2M+ limits</li>
              <li><strong>Public exposure:</strong> Work in areas with heavy foot traffic or public access</li>
              <li><strong>Vulnerable populations:</strong> Schools, nursing homes, hospitals, daycare centers</li>
              <li><strong>Complex operations:</strong> Work involving heavy machinery, hazardous materials, or height work</li>
              <li><strong>Your own insurance requires it:</strong> Check your policy—it may mandate minimum vendor coverage</li>
              <li><strong>Contract requirements:</strong> Government or institutional contracts often specify minimums</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">What Happens When Limits Are Too Low</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A serious claim can easily exceed $1 million:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Catastrophic injury settlement: $2M-$10M+</li>
              <li>Multi-party claim (several people injured): $3M-$15M+</li>
              <li>Wrongful death: $5M-$20M+</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              When the vendor's policy limits are exhausted, the remaining liability falls on whoever else can be held responsible—often you. Your insurance then pays, which:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Consumes your own policy limits</li>
              <li>Triggers your deductible</li>
              <li>Creates claims history that increases your premiums for 3-5 years</li>
              <li>May result in your insurance company dropping you at renewal</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-[#3A4F6A] p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-[#0A0F1E] mb-2">Finding the Right Balance</h3>
              <p className="text-gray-700 mb-3">
                While you want adequate protection, requiring excessive coverage limits can backfire:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>You exclude small, qualified vendors who can't afford high premiums</li>
                <li>You create incentive for vendors to misrepresent coverage</li>
                <li>You may pay higher bid prices as vendors pass insurance costs through</li>
              </ul>
              <p className="text-gray-700 mt-3">
                The sweet spot: Set minimums based on actual risk exposure, not arbitrary standards. A vendor painting your office needs different coverage than one installing your electrical system.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Quick Reference: Minimum Requirements by Risk Level</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Low Risk:</strong> $500K / $1M (rare, only for very low-exposure vendors)</li>
              <li><strong>Standard Risk:</strong> $1M / $2M (most common baseline)</li>
              <li><strong>Elevated Risk:</strong> $2M / $4M (construction trades, higher-value work)</li>
              <li><strong>High Risk:</strong> $5M / $10M+ (large projects, hazardous work, public infrastructure)</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              When in doubt, consult with your insurance broker or risk manager. They can provide guidance specific to your industry, location, and risk profile.
            </p>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Verify Coverage Limits Automatically</h3>
            <p className="text-white/90 mb-6">
              Covera checks that every vendor meets your minimum coverage requirements and alerts you when limits are inadequate—before work begins.
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
import { Link } from 'react-router';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';

export default function ConstructionVendorInsuranceRequirements() {
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
              Construction
            </span>
          </div>

          <h1 className="mb-6 text-[#0A0F1E]">
            Construction Vendor Insurance Requirements: The Complete Guide
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">December 26, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">10 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Construction sites are high-risk environments. One uninsured subcontractor can expose your entire project to catastrophic liability. Here's exactly what coverage you need from every vendor.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">General Liability Insurance (Required for All)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> $1 million per occurrence / $2 million aggregate
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>What it covers:</strong> Bodily injury, property damage, and personal injury claims
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>When to require higher limits:</strong>
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>High-value projects ($1M+): Require $2M per occurrence / $4M aggregate</li>
              <li>High-rise construction: Require $5M per occurrence / $10M aggregate</li>
              <li>Public projects: Check contract requirements (often $2M-$5M minimum)</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Workers' Compensation (Required for All with Employees)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> Statutory limits for your state
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>What it covers:</strong> Medical expenses and lost wages for injured workers
            </p>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Critical Requirement</h3>
              <p className="text-red-900">
                NEVER allow a subcontractor with employees to work without Workers' Comp. If their employee is injured and they don't have coverage, YOUR policy becomes primary. This can result in devastating claims and premium increases.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Sole Proprietors Exception</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Some states don't require Workers' Comp for sole proprietors with no employees. In these cases:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Get a signed waiver acknowledging they declined coverage</li>
              <li>Require them to carry disability insurance instead</li>
              <li>Consider requiring higher General Liability limits to compensate</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Commercial Auto Liability (Conditional)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> $1 million combined single limit
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Required when:</strong>
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Vendor uses vehicles on the job site</li>
              <li>Vendor transports materials or equipment</li>
              <li>Vendor's company name is on the vehicle</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Not required when:</strong> Vendor works entirely on foot or uses public transportation
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Umbrella/Excess Liability (For Large Projects)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> $5-10 million
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>When to require:</strong>
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Projects over $5 million in value</li>
              <li>High-risk trades (crane operators, demo, hazmat)</li>
              <li>Public infrastructure projects</li>
              <li>Projects in high-liability jurisdictions</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Professional Liability (Trade-Specific)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> $1-2 million per claim
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Required for:</strong>
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Architects and engineers</li>
              <li>Structural engineers</li>
              <li>Design-build contractors</li>
              <li>Construction managers offering professional services</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Builders Risk Insurance (Project-Specific)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Who provides it:</strong> Typically the general contractor or property owner
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>What it covers:</strong> The structure under construction, including materials and equipment
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you're the GC, ensure your Builders Risk policy covers all subs. If you're a sub, verify the GC has this coverage before starting work.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Pollution Liability (Environmental Work)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Minimum Coverage:</strong> $1 million per claim
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Required for:</strong>
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Asbestos abatement</li>
              <li>Lead paint removal</li>
              <li>Mold remediation</li>
              <li>Underground storage tank removal</li>
              <li>Soil remediation</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Required Certificate Features</h2>
            
            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">1. Additional Insured Status</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your company MUST be listed as Additional Insured on both General Liability and Auto Liability policies. This is non-negotiable. Without this designation, the vendor's insurance won't cover claims against you.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">2. Waiver of Subrogation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Require a Waiver of Subrogation on all policies. This prevents the vendor's insurance company from suing you to recover claim payments.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">3. Primary and Non-Contributory Language</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ensures the vendor's policy pays first, before your insurance is tapped. Without this, both policies may try to avoid paying, leaving you in lengthy litigation.
            </p>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">4. 30-Day Cancellation Notice</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The certificate should require the insurance company to notify you 30 days before cancellation. This gives you time to remove the vendor from the job site before coverage lapses.
            </p>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Insurance Requirements by Trade</h2>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="font-bold text-[#0A0F1E] mb-3">High-Risk Trades (Require Maximum Coverage)</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Roofing: GL $2M/$4M + Auto $1M + Umbrella $5M</li>
                <li>Electrical: GL $2M/$4M + Auto $1M</li>
                <li>Plumbing: GL $1M/$2M + Auto $1M</li>
                <li>HVAC: GL $1M/$2M + Auto $1M</li>
                <li>Demolition: GL $2M/$4M + Umbrella $5M</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="font-bold text-[#0A0F1E] mb-3">Medium-Risk Trades (Standard Coverage)</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Framing: GL $1M/$2M + Auto $1M</li>
                <li>Drywall: GL $1M/$2M</li>
                <li>Painting: GL $1M/$2M</li>
                <li>Flooring: GL $1M/$2M</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#0A0F1E] mt-12 mb-4">Enforcement and Compliance</h2>
            
            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Before Work Starts</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Collect and verify all certificates 7 days before mobilization</li>
              <li>Call insurance agencies to confirm policies are active and limits are accurate</li>
              <li>Check that all required endorsements are in place</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">During the Project</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Track expiration dates and request renewals 60 days in advance</li>
              <li>If coverage lapses, stop work immediately</li>
              <li>For long projects, re-verify coverage quarterly</li>
            </ul>

            <h3 className="text-xl font-bold text-[#0A0F1E] mt-8 mb-3">Contract Language</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Include these provisions in all subcontractor agreements:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Specific coverage types and minimum limits</li>
              <li>Additional Insured and Waiver of Subrogation requirements</li>
              <li>Proof of insurance due before mobilization</li>
              <li>Right to verify coverage directly with insurance carrier</li>
              <li>Immediate work stoppage if coverage lapses</li>
              <li>Subcontractor liable for all costs during uninsured periods</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-[#3A4F6A] p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-[#0A0F1E] mb-2">Bottom Line</h3>
              <p className="text-gray-700">
                Construction insurance requirements exist because construction is dangerous. Every requirement listed here has been written in the blood of previous contractors who learned these lessons the expensive way. Don't become the next cautionary tale.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Manage Construction Vendor Compliance</h3>
            <p className="text-white/90 mb-6">
              Covera tracks all subcontractor insurance, verifies endorsements, and ensures continuous compliance across all your projects.
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
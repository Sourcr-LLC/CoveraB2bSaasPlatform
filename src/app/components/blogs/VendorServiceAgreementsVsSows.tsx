import { Link } from 'react-router';
import { ArrowLeft, CheckCircle, FileText, Scale } from 'lucide-react';
import LandingNav from '../LandingNav';
import BlogFooter from '../BlogFooter';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function VendorServiceAgreementsVsSows() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogVendorServiceAgreementsVsSows} />
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
                Contracts
              </span>
              <span className="text-gray-500 text-sm">5 min read</span>
            </div>
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Vendor Service Agreements vs. Statements of Work (SOW): What's the Difference?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Confused by the alphabet soup of vendor contracts? Here is a clear breakdown of MSAs vs. SOWs and when to use each.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published January 16, 2026
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The Hierarchy of Vendor Contracts</h2>
              <p className="text-gray-700 leading-relaxed">
                When engaging with vendors, you'll often encounter two primary types of documents: the Master Service Agreement (MSA) and the Statement of Work (SOW). While they work together, they serve very different purposes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of the MSA as the "umbrella" that covers the entire relationship, while the SOW is the specific "task order" for a particular project.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Master Service Agreement (MSA)</h2>
              <p className="text-gray-700 leading-relaxed">
                An MSA is a contract that sets the baseline legal terms for an ongoing business relationship. It handles the "what if" scenarios and legal protections.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 my-6 space-y-4">
                <h3 className="font-semibold text-[#0A0F1E] mb-2">Key Components of an MSA:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Scale className="w-5 h-5 text-[#3A4F6A] mt-1" />
                    <span><strong>Liability & Indemnification:</strong> Who is responsible if something goes wrong?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-5 h-5 text-[#3A4F6A] mt-1" />
                    <span><strong>Payment Terms:</strong> Net 30, Net 60, etc.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-5 h-5 text-[#3A4F6A] mt-1" />
                    <span><strong>Intellectual Property Rights:</strong> Who owns the work produced?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-5 h-5 text-[#3A4F6A] mt-1" />
                    <span><strong>Confidentiality (NDA):</strong> Protecting trade secrets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-5 h-5 text-[#3A4F6A] mt-1" />
                    <span><strong>Dispute Resolution:</strong> Arbitration vs. litigation.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Statement of Work (SOW)</h2>
              <p className="text-gray-700 leading-relaxed">
                An SOW defines the specific project scope, deliverables, timeline, and pricing. It references the MSA for legal terms but focuses on the operational details.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6 my-6">
                <h3 className="font-semibold text-blue-900 mb-2">What Goes into an SOW?</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Scope of Work:</strong> Exactly what tasks will be performed.</li>
                  <li>• <strong>Deliverables:</strong> Tangible items the vendor must produce.</li>
                  <li>• <strong>Timeline:</strong> Milestones, deadlines, and project phases.</li>
                  <li>• <strong>Pricing:</strong> Fixed bid, hourly rates, or retainer details.</li>
                  <li>• <strong>Acceptance Criteria:</strong> How you define "done."</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Why You Need Both</h2>
              <p className="text-gray-700 leading-relaxed">
                Separating these documents saves time. Once you negotiate an MSA (which involves lawyers), you don't need to renegotiate legal terms for every new project. You simply sign a new SOW referencing the existing MSA.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Pro Tip:</strong> Ensure your SOW explicitly states that in the event of a conflict, the SOW overrides the MSA for project-specific details (like timeline), but the MSA overrides for legal terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">Common Pitfalls to Avoid</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong>Vague Deliverables:</strong> "Support services" is bad. "48-hour response time for P1 tickets" is good.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong>Missing Acceptance Criteria:</strong> Don't pay until the work meets a defined standard.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong>Scope Creep:</strong> Clearly define what is OUT of scope to avoid surprise bills.</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Centralize Your MSAs and SOWs</h3>
              <p className="text-white/90 mb-6">
                Covera helps you organize contracts, track SOW deliverables, and link agreements to vendors in one secure platform.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-white text-[#3A4F6A] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Managing Contracts
              </Link>
            </div>

          </div>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
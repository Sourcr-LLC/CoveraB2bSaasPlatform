import { Link } from 'react-router';
import { ArrowLeft, Zap, BrainCircuit, Search, Clock, FileCheck } from 'lucide-react';
import LandingNav from '../LandingNav';
import Footer from '../Footer';
import SEO, { SEO_CONFIGS } from '../SEO';

export default function AIContractReview() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.blogAIContractReview} />
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
                Technology
              </span>
              <span className="text-gray-500 text-sm">5 min read</span>
            </div>
            <h1 
              className="mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight" 
              style={{ fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--foreground)' }}
            >
              Why AI Contract Review is the New Standard for Vendor Compliance
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Manual contract review is slow, expensive, and error-prone. Discover how AI is transforming vendor risk management by catching what humans miss.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Published January 19, 2026
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            
            <div>
              <p className="text-gray-700 leading-relaxed">
                The average legal team spends 40-60% of their time reviewing low-complexity contracts like NDAs and basic MSAs. This creates a massive bottleneck for procurement and operations teams who just want to onboard a vendor and get to work.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Enter AI contract review. It's not about replacing lawyers; it's about giving them superpowers (and giving you faster answers).
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Manual Review</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• 3-5 days turnaround time</li>
                  <li>• Inconsistent across reviewers</li>
                  <li>• Misses "boring" details like dates</li>
                  <li>• Expensive ($300+/hr legal fees)</li>
                </ul>
              </div>
              <div className="bg-white border border-emerald-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">AI Review</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• &lt; 30 seconds turnaround</li>
                  <li>• 100% consistent logic</li>
                  <li>• Flags every date & dollar amount</li>
                  <li>• Fraction of the cost</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">What AI Can Actually Catch</h2>
              <p className="text-gray-700 leading-relaxed">
                Modern Large Language Models (LLMs) don't just "search" for keywords. They understand context.
              </p>
              <ul className="space-y-4 text-gray-700 mt-4">
                <li className="flex items-start gap-3">
                  <BrainCircuit className="w-6 h-6 text-[#3A4F6A] flex-shrink-0 mt-1" />
                  <div>
                    <strong>Logic Gaps:</strong> AI can spot if a contract references an "Exhibit A" that doesn't actually exist in the file.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Search className="w-6 h-6 text-[#3A4F6A] flex-shrink-0 mt-1" />
                  <div>
                    <strong>Missing Insurance Limits:</strong> It instantly verifies if the vendor's liability cap matches your company's required $1M/$2M standard.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="w-6 h-6 text-[#3A4F6A] flex-shrink-0 mt-1" />
                  <div>
                    <strong>Payment Term Anomalies:</strong> It flags "Net 15" terms when your standard policy is "Net 45," helping you protect cash flow.
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0A0F1E] mb-4">The "Clean Glass" Approach</h2>
              <p className="text-gray-700 leading-relaxed">
                At Covera, we believe technology should be "clean glass"—transparent and unobtrusive. Our AI doesn't redline the document for you (yet). Instead, it acts as a triage nurse. It scans the incoming contract and gives you a <strong>Green/Yellow/Red</strong> health score.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Green? Sign it. Red? Send to legal. This simple filter reduces legal backlog by 70%.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-[#3A4F6A] to-[#2a3f5a] rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-white">Experience AI Compliance</h3>
              <p className="text-white/90 mb-6">
                Upload any vendor contract to Covera and get an instant risk analysis. See what your current process is missing.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-white text-[#3A4F6A] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Free Analysis
              </Link>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
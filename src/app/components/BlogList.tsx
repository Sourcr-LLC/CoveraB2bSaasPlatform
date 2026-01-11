import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import LandingNav from './LandingNav';
import Footer from './Footer';
import SEO, { SEO_CONFIGS } from './SEO';

const blogPosts = [
  {
    slug: 'what-is-certificate-of-insurance',
    title: 'What Is a Certificate of Insurance (COI)?',
    excerpt: 'Everything you need to know about COIs, why they matter, and how to read them correctly to protect your business.',
    category: 'Basics',
    readTime: '6 min read',
    date: 'January 4, 2026',
    featured: true
  },
  {
    slug: 'track-vendor-insurance-expiration-automatically',
    title: 'How to Track Vendor Insurance Expiration Automatically',
    excerpt: 'Stop using spreadsheets and manual reminders. Learn how modern teams track hundreds of vendor policies without the headache.',
    category: 'How-To Guides',
    readTime: '8 min read',
    date: 'January 3, 2026',
    featured: true
  },
  {
    slug: 'property-managers-verify-vendor-insurance',
    title: 'How Property Managers Verify Vendor Insurance',
    excerpt: 'A practical guide to verifying vendor coverage before they step foot on your property.',
    category: 'Property Management',
    readTime: '7 min read',
    date: 'January 2, 2026',
    featured: false
  },
  {
    slug: 'coi-tracking-spreadsheet-vs-software',
    title: 'COI Tracking Spreadsheet vs Software: Which Is Right for You?',
    excerpt: 'An honest comparison of spreadsheets and specialized software for managing vendor compliance.',
    category: 'Comparisons',
    readTime: '9 min read',
    date: 'January 1, 2026',
    featured: false
  },
  {
    slug: 'vendor-compliance-checklist',
    title: 'Vendor Compliance Checklist (Free Template)',
    excerpt: 'Your complete checklist for onboarding vendors, verifying insurance, and maintaining compliance throughout the relationship.',
    category: 'Templates',
    readTime: '5 min read',
    date: 'December 30, 2025',
    featured: true
  },
  {
    slug: 'expired-vendor-insurance-what-to-do',
    title: 'What To Do When Your Vendor\'s Insurance Expires',
    excerpt: 'Your step by step action plan when you discover a vendor is working with expired coverage.',
    category: 'Risk Management',
    readTime: '6 min read',
    date: 'December 28, 2025',
    featured: false
  },
  {
    slug: 'construction-vendor-insurance-requirements',
    title: 'Construction Vendor Insurance Requirements: The Complete Guide',
    excerpt: 'What coverage limits construction firms need from subcontractors and how to enforce them.',
    category: 'Construction',
    readTime: '10 min read',
    date: 'December 26, 2025',
    featured: false
  },
  {
    slug: 'additional-insured-vs-certificate-holder',
    title: 'Additional Insured vs Certificate Holder: What\'s the Difference?',
    excerpt: 'Understanding the critical difference between these two designations and why it matters for your protection.',
    category: 'Basics',
    readTime: '7 min read',
    date: 'December 24, 2025',
    featured: false
  },
  {
    slug: 'vendor-insurance-tracking-mistakes',
    title: '7 Vendor Insurance Tracking Mistakes That Could Cost You Millions',
    excerpt: 'Common compliance errors that expose your business to catastrophic legal and financial risk.',
    category: 'Risk Management',
    readTime: '8 min read',
    date: 'December 22, 2025',
    featured: false
  },
  {
    slug: 'general-liability-coverage-limits',
    title: 'What Are Standard General Liability Coverage Limits for Vendors?',
    excerpt: 'Industry benchmarks for minimum insurance requirements based on vendor type and risk level.',
    category: 'Basics',
    readTime: '6 min read',
    date: 'December 20, 2025',
    featured: false
  },
  {
    slug: 'automate-coi-collection',
    title: 'How to Automate COI Collection From Vendors',
    excerpt: 'Stop chasing vendors for insurance documents via email. Here\'s how to automate the entire process.',
    category: 'How-To Guides',
    readTime: '7 min read',
    date: 'December 18, 2025',
    featured: false
  },
  {
    slug: 'vendor-insurance-compliance-small-business',
    title: 'Vendor Insurance Compliance for Small Businesses',
    excerpt: 'Yes, you still need to track vendor insurance even if you only work with 5 contractors. Here\'s why.',
    category: 'Small Business',
    readTime: '5 min read',
    date: 'December 16, 2025',
    featured: false
  }
];

export default function BlogList() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
      <SEO {...SEO_CONFIGS.blog} />
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
              Vendor Compliance & Insurance Tracking Blog
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Expert guides, best practices, and insights for managing vendor insurance compliance
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#3A4F6A]/10 text-[#3A4F6A] rounded-full text-xs font-medium uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#3A4F6A] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All Articles */}
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">All Articles</h2>
          <div className="space-y-6">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex items-start gap-6 p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#3A4F6A] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#3A4F6A] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-slate-200 bg-[#fafaf9]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#1a1a1a]">
            Ready to Stop Tracking Vendor Insurance in Spreadsheets?
          </h2>
          <p className="text-xl text-slate-500 mb-8">
            Covera automates the entire compliance workflow so you can focus on running your business.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all bg-[#3A4F6A] text-white hover:bg-[#2c3e53] shadow-lg shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 hover:-translate-y-1"
          >
            Start free trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-slate-400 mt-4">Setup in 5 minutes</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
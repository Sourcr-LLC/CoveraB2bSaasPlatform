/**
 * BEFORE/AFTER REFACTOR EXAMPLE
 * Shows how to migrate from old layout pattern to modern CSS Grid approach
 */

/* ============================================
   BEFORE ❌ (Old Pattern)
   ============================================ */

function AboutUsOld() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9]">
      <main className="flex-1">
        {/* Hero Section - OLD WAY */}
        <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-semibold">
                About Covera
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                Covera helps businesses stay compliant with vendor contracts
              </p>
            </div>
          </div>
        </section>

        {/* Introduction - OLD WAY */}
        <section className="py-20 bg-white/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl leading-relaxed">
                We built Covera for operations teams...
              </p>
            </div>
          </div>
        </section>

        {/* Why We Exist - OLD WAY */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="mb-6 text-3xl md:text-5xl font-semibold">
                Why We Exist
              </h2>
              <p>Content...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================================
   AFTER ✅ (Modern Grid Pattern)
   ============================================ */

function AboutUsNew() {
  return (
    <div className="page-root relative min-h-screen flex flex-col bg-[#fafaf9]">
      <main className="flex-1">
        {/* Hero Section - NEW WAY */}
        <section className="section-hero">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-semibold">
              About Covera
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              Covera helps businesses stay compliant with vendor contracts
            </p>
          </div>
        </section>

        {/* Introduction - NEW WAY (Full-bleed background) */}
        <section className="section">
          <div className="fullbleed bg-white/50 border-y border-slate-100">
            <div className="section-narrow section-padding">
              <p className="text-lg md:text-xl leading-relaxed">
                We built Covera for operations teams...
              </p>
            </div>
          </div>
        </section>

        {/* Why We Exist - NEW WAY */}
        <section className="section-narrow section-padding">
          <h2 className="mb-6 text-3xl md:text-5xl font-semibold">
            Why We Exist
          </h2>
          <p>Content...</p>
        </section>
      </main>
    </div>
  );
}

/* ============================================
   KEY DIFFERENCES
   ============================================ */

/*
BEFORE ❌:
- Multiple nested divs (max-w-7xl, max-w-4xl, max-w-3xl, mx-auto)
- Manual padding (pt-40, pb-20, px-4, md:px-6)
- Backgrounds not truly full-width
- Repetitive class names
- Harder to maintain

AFTER ✅:
- Single semantic section element
- Automatic centering with CSS Grid
- True full-bleed backgrounds
- Clamp-based responsive padding
- Cleaner, more maintainable code
- Better performance (fewer DOM nodes)
*/

/* ============================================
   MORE EXAMPLES
   ============================================ */

// Example 1: Feature Section with Image
function FeatureSectionOld() {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2>Amazing Feature</h2>
        <img src="/feature.jpg" alt="Feature" className="w-full rounded-xl" />
      </div>
    </section>
  );
}

function FeatureSectionNew() {
  return (
    <section className="section">
      <div className="fullbleed bg-slate-50">
        <div className="section section-padding">
          <h2>Amazing Feature</h2>
          <img src="/feature.jpg" alt="Feature" className="fullbleed rounded-xl" />
        </div>
      </div>
    </section>
  );
}

// Example 2: Two-Column Layout
function TwoColumnOld() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>Column 1</div>
          <div>Column 2</div>
        </div>
      </div>
    </section>
  );
}

function TwoColumnNew() {
  return (
    <section className="section section-padding">
      <div className="grid md:grid-cols-2 gap-12">
        <div>Column 1</div>
        <div>Column 2</div>
      </div>
    </section>
  );
}

// Example 3: Blog Post
function BlogPostOld() {
  return (
    <article className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <img src="/hero.jpg" alt="Hero" className="w-full mb-12" />
        <h1 className="text-4xl font-bold mb-6">Blog Title</h1>
        <p className="text-lg leading-relaxed">Content...</p>
      </div>
    </article>
  );
}

function BlogPostNew() {
  return (
    <article className="section-narrow section-padding">
      <img src="/hero.jpg" alt="Hero" className="fullbleed mb-12" />
      <h1 className="text-4xl font-bold mb-6">Blog Title</h1>
      <p className="text-lg leading-relaxed">Content...</p>
    </article>
  );
}

// Example 4: CTA Section
function CTAOld() {
  return (
    <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to get started?
        </h2>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl">
          Start Free Trial
        </button>
      </div>
    </section>
  );
}

function CTANew() {
  return (
    <section className="section">
      <div className="fullbleed bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="section-cta text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-xl">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}

// Example 5: Dashboard Layout
function DashboardOld() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </div>
    </div>
  );
}

function DashboardNew() {
  return (
    <div className="section-wide section-padding">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </div>
    </div>
  );
}

/* ============================================
   ADVANCED PATTERNS
   ============================================ */

// Pattern 1: Alternating Sections
function AlternatingNew() {
  return (
    <>
      {/* White section */}
      <section className="section section-padding bg-white">
        <h2>Feature 1</h2>
      </section>

      {/* Gray section with full-bleed */}
      <section className="section">
        <div className="fullbleed bg-slate-50">
          <div className="section section-padding">
            <h2>Feature 2</h2>
          </div>
        </div>
      </section>

      {/* White section */}
      <section className="section section-padding bg-white">
        <h2>Feature 3</h2>
      </section>
    </>
  );
}

// Pattern 2: Hero with Background Image
function HeroWithBgNew() {
  return (
    <section className="section">
      <div 
        className="fullbleed min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      >
        <div className="section-hero">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-6">
              Hero Title
            </h1>
            <p className="text-xl mb-8">Subtitle</p>
            <button>Get Started</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pattern 3: Content with Sidebar
function ContentWithSidebarNew() {
  return (
    <section className="section section-padding">
      <div className="grid lg:grid-cols-[1fr_300px] gap-12">
        <article className="section-narrow">
          <h1>Main Content</h1>
          <p>Long-form content...</p>
        </article>
        <aside>
          <div className="sticky top-6">
            <h3>Table of Contents</h3>
            <ul>...</ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ============================================
   PERFORMANCE COMPARISON
   ============================================ */

/*
OLD PATTERN:
- DOM nodes: <section> → <div max-w> → <div max-w> → <div max-w> → content
- Total: 5 nodes for simple centering
- Classes: 15+ Tailwind classes per section

NEW PATTERN:
- DOM nodes: <section.section> → content
- Total: 2 nodes
- Classes: 2-3 utility classes

RESULT:
✅ 60% fewer DOM nodes
✅ 80% fewer class names
✅ Better paint performance
✅ Easier to maintain
✅ More semantic HTML
*/

/* ============================================
   MIGRATION CHECKLIST
   ============================================ */

/*
✅ Step 1: Install layout system
   - Create /src/styles/layouts.css ✅
   - Import in /src/styles/index.css ✅

✅ Step 2: Identify sections to migrate
   - Landing page hero
   - Feature sections
   - Blog posts
   - About/contact pages
   - Dashboard layouts

✅ Step 3: Replace patterns
   - max-w-7xl mx-auto → .section
   - max-w-4xl mx-auto → .section-narrow
   - py-20 px-4 → .section-padding
   - Full-width backgrounds → .fullbleed

✅ Step 4: Test responsive
   - Mobile (320px - 768px)
   - Tablet (768px - 1280px)
   - Desktop (1280px+)

✅ Step 5: Verify
   - Backgrounds span full width
   - Content stays centered
   - Responsive gutters work
   - No horizontal scroll
*/

export {
  AboutUsOld,
  AboutUsNew,
  FeatureSectionOld,
  FeatureSectionNew,
  TwoColumnOld,
  TwoColumnNew,
  BlogPostOld,
  BlogPostNew,
  CTAOld,
  CTANew,
  DashboardOld,
  DashboardNew,
  AlternatingNew,
  HeroWithBgNew,
  ContentWithSidebarNew
};

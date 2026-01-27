# 🎯 Layout System Cheat Sheet

## Copy-Paste Ready Snippets

---

## 1️⃣ Basic Section (Most Common)
```tsx
<section className="section section-padding">
  <h2>My Heading</h2>
  <p>My content automatically centered, max 1200px</p>
</section>
```
**Use for:** 90% of your sections

---

## 2️⃣ Full-Bleed Background
```tsx
<section className="section">
  <div className="fullbleed bg-slate-50">
    <div className="section section-padding">
      <h2>Content with full-width background</h2>
    </div>
  </div>
</section>
```
**Use for:** Sections with background colors

---

## 3️⃣ Full-Bleed Image
```tsx
<section className="section section-padding">
  <h2>Section Title</h2>
  <img src="/image.jpg" alt="Hero" className="fullbleed rounded-xl my-8" />
  <p>More content below image</p>
</section>
```
**Use for:** Hero images, feature screenshots

---

## 4️⃣ Hero Section
```tsx
<section className="section-hero bg-gradient-to-br from-blue-50 to-indigo-50">
  <div className="text-center">
    <h1 className="text-6xl font-bold mb-6">Big Hero Title</h1>
    <p className="text-xl text-slate-600 mb-8">Subtitle here</p>
    <button>Call to Action</button>
  </div>
</section>
```
**Use for:** Landing page heroes

---

## 5️⃣ Narrow Content (Blog)
```tsx
<article className="section-narrow section-padding">
  <h1 className="text-4xl font-bold mb-6">Blog Post Title</h1>
  <p className="text-lg leading-relaxed">Long-form content...</p>
</article>
```
**Use for:** Blog posts, articles, long text

---

## 6️⃣ Wide Layout (Dashboard)
```tsx
<div className="section-wide section-padding">
  <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
  <div className="grid grid-cols-3 gap-6">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>
```
**Use for:** Dashboards, data tables, admin panels

---

## 7️⃣ CTA Section
```tsx
<section className="section">
  <div className="fullbleed bg-gradient-to-r from-blue-600 to-indigo-600">
    <div className="section-cta text-white">
      <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
      <p className="text-xl mb-8">Join 1000+ companies</p>
      <button>Start Free Trial</button>
    </div>
  </div>
</section>
```
**Use for:** Call-to-action sections, signup prompts

---

## 8️⃣ Two-Column Layout
```tsx
<section className="section section-padding">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-3xl font-bold mb-4">Feature Title</h2>
      <p className="text-lg text-slate-600">Description...</p>
    </div>
    <img src="/feature.jpg" alt="Feature" className="rounded-xl" />
  </div>
</section>
```
**Use for:** Feature sections, split layouts

---

## 9️⃣ Alternating Sections
```tsx
{/* White section */}
<section className="section section-padding bg-white">
  <h2>Feature 1</h2>
</section>

{/* Gray section */}
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
```
**Use for:** Multi-feature pages, landing pages

---

## 🔟 Content + Sidebar
```tsx
<section className="section section-padding">
  <div className="grid lg:grid-cols-[1fr_300px] gap-12">
    <article>
      <h1>Main Content</h1>
      <p>Long content here...</p>
    </article>
    <aside className="lg:sticky lg:top-6">
      <h3>Sidebar</h3>
      <nav>...</nav>
    </aside>
  </div>
</section>
```
**Use for:** Blog with sidebar, docs, help pages

---

## 🎨 Quick Class Reference

| Class | Max Width | Use Case |
|-------|-----------|----------|
| `.section` | 1200px | Standard sections |
| `.section-narrow` | 800px | Blog posts |
| `.section-wide` | 1400px | Dashboards |
| `.section-hero` | 1200px + full height | Landing heroes |
| `.section-cta` | 900px | CTAs |
| `.fullbleed` | 100vw | Full-width elements |

---

## 📏 Padding Classes

| Class | Padding | Use Case |
|-------|---------|----------|
| `.section-padding` | 3rem → 8rem | Standard (most common) |
| `.section-padding-sm` | 2rem → 4rem | Compact sections |
| `.section-padding-lg` | 6rem → 12rem | Spacious sections |
| `.section-padding-inline` | 1rem → 4rem | Horizontal padding |

---

## 🔄 Migration Patterns

### Pattern 1: Simple Section
```tsx
// OLD ❌
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <h1>Title</h1>
  </div>
</section>

// NEW ✅
<section className="section section-padding">
  <h1>Title</h1>
</section>
```

### Pattern 2: Centered Content
```tsx
// OLD ❌
<div className="max-w-4xl mx-auto text-center">
  <h1>Title</h1>
</div>

// NEW ✅
<div className="text-center">
  <h1 className="max-w-4xl mx-auto">Title</h1>
</div>
```

### Pattern 3: Background Section
```tsx
// OLD ❌
<section className="py-20 px-4 bg-slate-50">
  <div className="max-w-7xl mx-auto">
    <h2>Feature</h2>
  </div>
</section>

// NEW ✅
<section className="section">
  <div className="fullbleed bg-slate-50">
    <div className="section section-padding">
      <h2>Feature</h2>
    </div>
  </div>
</section>
```

---

## ⚡ Performance Tips

### ✅ DO:
```tsx
// Single section, minimal nesting
<section className="section section-padding">
  <h1>Title</h1>
  <p>Content</p>
</section>
```

### ❌ DON'T:
```tsx
// Too many nested divs
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <h1>Title</h1>
      </div>
    </div>
  </div>
</section>
```

---

## 🎯 Common Combinations

### Hero with CTA
```tsx
<section className="section-hero bg-gradient-to-br from-blue-50 to-indigo-50">
  <div className="text-center">
    <h1 className="text-6xl font-bold mb-6">Hero Title</h1>
    <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Subtitle</p>
    <div className="flex gap-4 justify-center">
      <button className="px-8 py-4 bg-blue-600 text-white rounded-xl">
        Primary CTA
      </button>
      <button className="px-8 py-4 bg-white border border-slate-300 rounded-xl">
        Secondary CTA
      </button>
    </div>
  </div>
</section>
```

### Feature Grid
```tsx
<section className="section section-padding">
  <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
  <div className="grid md:grid-cols-3 gap-8">
    <div className="p-6 bg-white border border-slate-200 rounded-xl">
      <h3 className="text-xl font-bold mb-3">Feature 1</h3>
      <p className="text-slate-600">Description...</p>
    </div>
    <div className="p-6 bg-white border border-slate-200 rounded-xl">
      <h3 className="text-xl font-bold mb-3">Feature 2</h3>
      <p className="text-slate-600">Description...</p>
    </div>
    <div className="p-6 bg-white border border-slate-200 rounded-xl">
      <h3 className="text-xl font-bold mb-3">Feature 3</h3>
      <p className="text-slate-600">Description...</p>
    </div>
  </div>
</section>
```

### Testimonial Section
```tsx
<section className="section">
  <div className="fullbleed bg-slate-900 text-white">
    <div className="section section-padding text-center">
      <h2 className="text-4xl font-bold mb-12">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <blockquote className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="mb-4">"Amazing product!"</p>
          <cite className="text-sm text-slate-400">— John Doe</cite>
        </blockquote>
        {/* More testimonials... */}
      </div>
    </div>
  </div>
</section>
```

---

## 🚀 Quick Start

1. **Copy a snippet** from above
2. **Paste into your component**
3. **Replace content** with your own
4. **Done!** ✅

---

## 📱 Mobile-First

All classes are mobile-first and automatically responsive:
- Mobile: 1rem gutters
- Tablet: 2rem gutters  
- Desktop: 4rem gutters

**No media queries needed!** 🎉

---

## 🎨 Combine with Tailwind

These classes work perfectly with Tailwind:

```tsx
<section className="section section-padding bg-gradient-to-r from-blue-50 to-indigo-50">
  <h2 className="text-4xl font-bold text-slate-900 mb-6">
    Best of both worlds!
  </h2>
  <p className="text-lg text-slate-600 leading-relaxed">
    Use layout classes for structure, Tailwind for styling.
  </p>
</section>
```

---

## ✅ Checklist

Before going live, verify:
- [ ] Backgrounds span full width
- [ ] Content stays centered
- [ ] Mobile looks good (320px)
- [ ] Tablet looks good (768px)
- [ ] Desktop looks good (1280px+)
- [ ] No horizontal scroll

---

## 🆘 Troubleshooting

**Background not full-width?**
```tsx
// Wrong ❌
<section className="section bg-slate-50">

// Right ✅
<section className="section">
  <div className="fullbleed bg-slate-50">
    <div className="section section-padding">
```

**Content too narrow?**
```tsx
// Use wider section
<section className="section-wide section-padding">
```

**Content too wide?**
```tsx
// Use narrower section
<section className="section-narrow section-padding">
```

---

## 📚 More Help

- **Full guide:** `/MODERN_LAYOUT_GUIDE.md`
- **Examples:** `/LAYOUT_REFACTOR_EXAMPLE.tsx`
- **Quick start:** `/LAYOUT_QUICK_START.md`

---

**Print this page and keep it handy!** 🖨️

---

**Last Updated:** January 27, 2026  
**Status:** Ready to copy-paste! 🎉

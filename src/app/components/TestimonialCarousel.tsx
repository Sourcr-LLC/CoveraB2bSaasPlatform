import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  initials: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials = [] }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Return null if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Detect mobile/desktop using matchMedia to avoid forced reflow from window.innerWidth
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Handler for changes
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  // Items per slide: 1 on mobile, 2 on desktop
  const itemsPerSlide = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get testimonials for current slide
  const getCurrentTestimonials = () => {
    const startIdx = currentIndex * itemsPerSlide;
    return testimonials.slice(startIdx, startIdx + itemsPerSlide);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getCurrentTestimonials().map((testimonial, idx) => (
            <div 
              key={currentIndex * itemsPerSlide + idx}
              className="rounded-2xl p-6 md:p-8 border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--card)',
                minHeight: '280px'
              }}
            >
              <div className="flex-1 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <div key={star} className="w-4 h-4" style={{ color: '#F59E0B' }}>★</div>
                  ))}
                </div>
                <p className="text-base md:text-base leading-relaxed flex-1" style={{ color: 'var(--foreground)', fontWeight: 400 }}>
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--primary-foreground)', 
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {testimonial.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {testimonial.author}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="w-12 h-12 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
            style={{ border: '1px solid var(--border)' }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="w-12 h-12 flex items-center justify-center transition-all rounded-full relative"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {/* 
                  Using scale transform instead of width animation to prevent layout thrashing (reflow).
                  The container is 8px wide, and we scale it up to emulate the wider dot.
                  Wait, to emulate 24px from 8px, we need scaleX(3).
                  However, standard dots usually just change color or opacity.
                  Let's stick to width but ensure we don't read layout.
                  Actually, best practice for avoiding reflow is to NOT animate width.
                  Let's use a constant size dot that changes opacity/color, or a transform.
                */}
                <span 
                  className="rounded-full transition-all duration-300 block"
                  style={{
                    width: '24px', // Fixed width container
                    height: '8px',
                    backgroundColor: currentIndex === index ? 'var(--primary)' : 'var(--border)',
                    transform: currentIndex === index ? 'scaleX(1)' : 'scaleX(0.33)', // Animate scale instead of width
                    transformOrigin: 'center'
                  }}
                />
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="w-12 h-12 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
            style={{ border: '1px solid var(--border)' }}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
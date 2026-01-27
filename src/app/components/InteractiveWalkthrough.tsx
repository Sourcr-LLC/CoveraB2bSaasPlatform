import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, Check } from 'lucide-react';

interface WalkthroughStep {
  id: number;
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
  highlightPadding?: number;
}

interface InteractiveWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps: WalkthroughStep[] = [
  {
    id: 1,
    target: '[data-tour="dashboard-nav"]',
    title: 'Welcome to Covera! 👋',
    description: 'Your enterprise compliance hub. Let\'s take a quick tour of the platform. Click Next to continue.',
    position: 'right',
    action: 'none',
    highlightPadding: 12
  },
  {
    id: 2,
    target: '[data-tour="vendors-nav"]',
    title: 'Vendor Management',
    description: 'Track all your vendors, contractors, and service providers in one place. Click here to continue.',
    position: 'right',
    action: 'click',
    highlightPadding: 12
  },
  {
    id: 3,
    target: '[data-tour="insurance-nav"]',
    title: 'Insurance Tracking',
    description: 'Monitor all Certificates of Insurance (COIs) in real-time. Never let vendor insurance expire. Click to continue.',
    position: 'right',
    action: 'click',
    highlightPadding: 12
  },
  {
    id: 4,
    target: '[data-tour="alerts-nav"]',
    title: 'Smart Alerts',
    description: 'Get notified before insurance expires. Automated reminders keep you compliant. Click to continue.',
    position: 'right',
    action: 'click',
    highlightPadding: 12
  },
  {
    id: 5,
    target: '[data-tour="compliance-nav"]',
    title: 'Compliance Dashboard',
    description: 'View organization-wide compliance status, risk analysis, and vendor coverage at a glance. Click to continue.',
    position: 'right',
    action: 'click',
    highlightPadding: 12
  },
  {
    id: 6,
    target: '[data-tour="reports-nav"]',
    title: 'Audit-Ready Reports',
    description: 'Export compliance reports in PDF and CSV formats for audits and stakeholder updates. Click to continue.',
    position: 'right',
    action: 'click',
    highlightPadding: 12
  },
  {
    id: 7,
    target: '[data-tour="settings-nav"]',
    title: 'You\'re All Set! 🎉',
    description: 'Manage your account, organization details, and subscription from Settings. Ready to start tracking vendor compliance?',
    position: 'right',
    action: 'none',
    highlightPadding: 12
  }
];

export default function InteractiveWalkthrough({ onComplete, onSkip }: InteractiveWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isReady, setIsReady] = useState(false);
  const [showClickFeedback, setShowClickFeedback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  console.log('🎪 InteractiveWalkthrough component MOUNTED!');

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-complete tour on mobile
      if (mobile) {
        console.log('📱 Mobile detected - skipping tour');
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [onComplete]);

  useEffect(() => {
    // Don't run tour on mobile
    if (isMobile) return;
    
    // Wait a bit for the DOM to be ready
    const timer = setTimeout(() => {
      updateHighlight();
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep, isMobile]);

  useEffect(() => {
    // Update position on window resize
    const handleResize = () => updateHighlight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]);

  const updateHighlight = () => {
    // Use requestAnimationFrame to batch DOM reads and avoid forced reflows
    requestAnimationFrame(() => {
      const element = document.querySelector(step.target);
      console.log('🎯 Walkthrough trying to find:', step.target, 'Found:', !!element);
      if (element) {
        // Batch the getBoundingClientRect call to minimize reflows
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
        calculateTooltipPosition(rect);
      } else {
        console.warn(`Element not found for step ${currentStep}:`, step.target);
        // Try again after a short delay
        setTimeout(() => {
          requestAnimationFrame(() => {
            const retryElement = document.querySelector(step.target);
            console.log('🔄 Retry finding:', step.target, 'Found:', !!retryElement);
            if (retryElement) {
              const rect = retryElement.getBoundingClientRect();
              setHighlightRect(rect);
              calculateTooltipPosition(rect);
            }
          });
        }, 500);
      }
    });
  };

  const calculateTooltipPosition = (rect: DOMRect) => {
    const tooltipWidth = 360;
    const tooltipHeight = 280; // Increased to account for actual content height
    const offset = 24;
    const viewportPadding = 20;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'right':
        // Center vertically relative to the highlighted element
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + offset;
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - offset;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
    }

    // Keep tooltip within viewport bounds
    if (left < viewportPadding) {
      left = viewportPadding;
    }
    if (left + tooltipWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - tooltipWidth - viewportPadding;
    }
    if (top < viewportPadding) {
      top = viewportPadding;
    }
    if (top + tooltipHeight > window.innerHeight - viewportPadding) {
      top = window.innerHeight - tooltipHeight - viewportPadding;
    }

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleElementClick = (e: MouseEvent) => {
    // Prevent navigation during tour
    e.preventDefault();
    e.stopPropagation();
    
    if (step.action === 'click') {
      // Show visual feedback
      setShowClickFeedback(true);
      
      // Advance to next step after brief delay
      setTimeout(() => {
        setShowClickFeedback(false);
        handleNext();
      }, 400);
    }
  };

  useEffect(() => {
    if (step.action === 'click') {
      const element = document.querySelector(step.target);
      if (element) {
        // Capture phase to intercept before navigation
        element.addEventListener('click', handleElementClick as any, true);
        return () => {
          element.removeEventListener('click', handleElementClick as any, true);
        };
      }
    }
  }, [currentStep, step]);

  if (!highlightRect || !isReady) {
    return null;
  }

  const padding = step.highlightPadding || 8;

  return (
    <>
      {/* Dark overlay with cutout */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* SVG mask for spotlight effect */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={highlightRect.left - padding}
                y={highlightRect.top - padding}
                width={highlightRect.width + padding * 2}
                height={highlightRect.height + padding * 2}
                rx="12"
                fill="black"
              />
            </mask>
            <radialGradient id="spotlight-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.65)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Spotlight glow removed for performance */}

      {/* Clickable overlay on highlighted element */}
      {step.action === 'click' && (
        <div
          className="fixed z-50 cursor-pointer"
          style={{
            top: highlightRect.top - padding,
            left: highlightRect.left - padding,
            width: highlightRect.width + padding * 2,
            height: highlightRect.height + padding * 2,
            borderRadius: '12px',
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleElementClick(e.nativeEvent as any);
          }}
        />
      )}

      {/* Highlighted element outline */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: highlightRect.top - padding,
          left: highlightRect.left - padding,
          width: highlightRect.width + padding * 2,
          height: highlightRect.height + padding * 2,
          border: showClickFeedback ? '4px solid #10b981' : '3px solid #3b82f6',
          borderRadius: '12px',
        }}
      />

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '360px',
          maxWidth: 'calc(100vw - 40px)',
        }}
      >
        <div
          className="rounded-2xl border p-6 relative"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
          }}
        >
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(100, 116, 139, 0.1)',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>

          {/* Step counter */}
          <div
            className="text-xs mb-3"
            style={{
              color: '#3b82f6',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            STEP {currentStep + 1} OF {steps.length}
          </div>

          {/* Title */}
          <h3
            className="mb-2"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.01em',
              lineHeight: 1.3
            }}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            className="mb-6"
            style={{
              fontSize: '0.9375rem',
              color: '#475569',
              lineHeight: 1.6
            }}
          >
            {step.description}
          </p>

          {/* Action hint */}
          {step.action === 'click' && (
            <div
              className="mb-4 px-4 py-2.5 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#3b82f6',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
              <span
                className="text-sm"
                style={{
                  color: '#3b82f6',
                  fontWeight: 500
                }}
              >
                Click the highlighted element to continue
              </span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="transition-all duration-300"
                  style={{
                    width: currentStep === index ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: currentStep === index
                      ? '#3b82f6'
                      : 'rgba(148, 163, 184, 0.3)'
                  }}
                />
              ))}
            </div>

            {/* Next/Finish button - only show if action is 'none' */}
            {step.action === 'none' && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 group"
                style={{
                  background: 'linear-gradient(135deg, #3A4F6A 0%, #2d3d52 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(58, 79, 106, 0.3)'
                }}
              >
                {isLastStep ? (
                  <>
                    Complete <CheckCircle2 size={16} />
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15), 0 0 50px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>
    </>
  );
}
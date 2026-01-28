import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    
    // If no choice made yet, show banner after a short delay
    if (consent === null) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
    // Dispatch event for other components (like GA) to listen to
    window.dispatchEvent(new Event('cookie-consent-given'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6 md:w-[400px] z-[100] p-4 md:p-0"
        >
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-6 md:p-6 overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                  <Link to="/privacy-policy" className="text-[var(--primary)] hover:underline ml-1">
                    Read Policy
                  </Link>
                </p>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-sm shadow-[var(--primary)]/20 cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

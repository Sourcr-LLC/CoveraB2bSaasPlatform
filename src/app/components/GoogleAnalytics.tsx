import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-K26HWY81S5';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Defer Google Analytics loading until after page is interactive
    // This prevents blocking the critical rendering path
    const loadGA = () => {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
      
      if (!existingScript) {
        // Create and load gtag.js script with async
        const script = document.createElement('script');
        script.async = true;
        script.defer = true; // Also defer for non-blocking load
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize GA
        script.onload = () => {
          window.gtag('js', new Date());
          window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: location.pathname + location.search,
            send_page_view: true
          });
        };
      }
    };

    // Defer GA loading until after initial render
    // Use requestIdleCallback for best performance, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadGA, { timeout: 5000 });
    } else {
      setTimeout(loadGA, 5000);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        send_page_view: true
      });
    }
  }, [location]);

  return null;
}

// Utility functions for tracking custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

// Common event tracking functions
export const analytics = {
  // Track button clicks
  trackButtonClick: (buttonName: string, locationContext?: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      location: locationContext || window.location.pathname
    });
  },

  // Track form submissions
  trackFormSubmit: (formName: string) => {
    trackEvent('form_submit', {
      form_name: formName
    });
  },

  // Track trial signups
  trackTrialSignup: (plan?: string) => {
    trackEvent('trial_signup', {
      plan: plan || 'standard'
    });
  },

  // Track demo requests
  trackDemoRequest: () => {
    trackEvent('demo_request', {
      page: window.location.pathname
    });
  },

  // Track vendor actions
  trackVendorAction: (action: string, vendorId?: string) => {
    trackEvent('vendor_action', {
      action,
      vendor_id: vendorId
    });
  },

  // Track COI uploads
  trackCOIUpload: (vendorId?: string) => {
    trackEvent('coi_upload', {
      vendor_id: vendorId
    });
  },

  // Track contract uploads
  trackContractUpload: (vendorId?: string) => {
    trackEvent('contract_upload', {
      vendor_id: vendorId
    });
  },

  // Track subscription events
  trackSubscription: (action: string, plan?: string) => {
    trackEvent('subscription', {
      action,
      plan
    });
  },

  // Track navigation
  trackNavigation: (destination: string, source?: string) => {
    trackEvent('navigation', {
      destination,
      source: source || 'unknown'
    });
  },

  // Track search
  trackSearch: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm
    });
  },

  // Track user login
  trackLogin: (method?: string) => {
    trackEvent('login', {
      method: method || 'email'
    });
  },

  // Track user logout
  trackLogout: () => {
    trackEvent('logout');
  }
};
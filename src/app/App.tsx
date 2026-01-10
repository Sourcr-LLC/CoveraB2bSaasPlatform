import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/api';
import { Toaster } from 'sonner';

// Import all components normally (no lazy loading to avoid initialization errors)
import DashboardLayout from './components/DashboardLayoutNew';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import PremiumLoader from './components/PremiumLoader';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';

// Public pages
import ForgotPassword from './components/ForgotPassword';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Security from './components/Security';
import Pricing from './components/Pricing';
import SolutionsPropertyManagement from './components/SolutionsPropertyManagement';
import SolutionsConstruction from './components/SolutionsConstruction';
import FeaturesCOITracking from './components/FeaturesCOITracking';
import IndustriesHealthcare from './components/IndustriesHealthcare';
import IndustriesLogistics from './components/IndustriesLogistics';
import IndustriesFranchise from './components/IndustriesFranchise';
import IndustriesFacilities from './components/IndustriesFacilities';
import IndustriesGovernment from './components/IndustriesGovernment';
import IndustriesEducation from './components/IndustriesEducation';
import IndustriesRetail from './components/IndustriesRetail';
import IndustriesHospitality from './components/IndustriesHospitality';
import AboutUs from './components/AboutUs';
import Sitemap from './components/Sitemap';
import HowToTrackVendorCompliance from './components/HowToTrackVendorCompliance';
import WhatHappensVendorUninsured from './components/WhatHappensVendorUninsured';
import BlogList from './components/BlogList';
import WhatIsCertificateOfInsurance from './components/blogs/WhatIsCertificateOfInsurance';
import TrackVendorInsuranceExpiration from './components/blogs/TrackVendorInsuranceExpiration';
import VendorComplianceChecklist from './components/blogs/VendorComplianceChecklist';
import PropertyManagersVerifyVendorInsurance from './components/blogs/PropertyManagersVerifyVendorInsurance';
import COITrackingSpreadsheetVsSoftware from './components/blogs/COITrackingSpreadsheetVsSoftware';
import ExpiredVendorInsurance from './components/blogs/ExpiredVendorInsurance';
import ConstructionVendorInsuranceRequirements from './components/blogs/ConstructionVendorInsuranceRequirements';
import AdditionalInsuredVsCertificateHolder from './components/blogs/AdditionalInsuredVsCertificateHolder';
import VendorInsuranceTrackingMistakes from './components/blogs/VendorInsuranceTrackingMistakes';
import GeneralLiabilityCoverageLimits from './components/blogs/GeneralLiabilityCoverageLimits';
import AutomateCOICollection from './components/blogs/AutomateCOICollection';
import VendorInsuranceComplianceSmallBusiness from './components/blogs/VendorInsuranceComplianceSmallBusiness';
import SubscriptionSuccess from './components/SubscriptionSuccess';

// Dashboard components
import Dashboard from './components/Dashboard';
import VendorManagement from './components/VendorManagement';
import VendorDetail from './components/VendorDetail';
import InsuranceTracking from './components/InsuranceTracking';
import AlertsReminders from './components/AlertsReminders';
import ComplianceDashboard from './components/ComplianceDashboard';
import ReportsExports from './components/ReportsExports';
import Settings from './components/Settings';
import ContractManagement from './components/ContractManagement';
import AddVendor from './components/AddVendor';
import Billing from './components/Billing';
import VendorPortal from './components/VendorPortal';

function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <DashboardLayout>
      <PageTransition>
        {children}
      </PageTransition>
    </DashboardLayout>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Disable pinch-to-zoom on mobile
  useEffect(() => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Prevent pinch-to-zoom with touch events
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <PremiumLoader fullScreen />;
  }

  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route path="/upload/:token" element={<VendorPortal />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <VendorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <VendorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insurance"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <InsuranceTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AlertsReminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ComplianceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ReportsExports />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            } />
          <Route path="/billing" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Billing />
              </ProtectedRoute>
            } />
          <Route
            path="/contracts"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ContractManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-vendor"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddVendor />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions-property-management" element={<SolutionsPropertyManagement />} />
          <Route path="/solutions-construction" element={<SolutionsConstruction />} />
          <Route path="/features-coi-tracking" element={<FeaturesCOITracking />} />
          <Route path="/industries-healthcare" element={<IndustriesHealthcare />} />
          <Route path="/industries-logistics" element={<IndustriesLogistics />} />
          <Route path="/industries-franchise" element={<IndustriesFranchise />} />
          <Route path="/industries-facilities" element={<IndustriesFacilities />} />
          <Route path="/industries-government" element={<IndustriesGovernment />} />
          <Route path="/industries-education" element={<IndustriesEducation />} />
          <Route path="/industries-retail" element={<IndustriesRetail />} />
          <Route path="/industries-hospitality" element={<IndustriesHospitality />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/how-to-track-vendor-compliance" element={<HowToTrackVendorCompliance />} />
          <Route path="/what-happens-vendor-uninsured" element={<WhatHappensVendorUninsured />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/what-is-certificate-of-insurance" element={<WhatIsCertificateOfInsurance />} />
          <Route path="/blog/track-vendor-insurance-expiration-automatically" element={<TrackVendorInsuranceExpiration />} />
          <Route path="/blog/vendor-compliance-checklist" element={<VendorComplianceChecklist />} />
          <Route path="/blog/property-managers-verify-vendor-insurance" element={<PropertyManagersVerifyVendorInsurance />} />
          <Route path="/blog/coi-tracking-spreadsheet-vs-software" element={<COITrackingSpreadsheetVsSoftware />} />
          <Route path="/blog/expired-vendor-insurance-what-to-do" element={<ExpiredVendorInsurance />} />
          <Route path="/blog/construction-vendor-insurance-requirements" element={<ConstructionVendorInsuranceRequirements />} />
          <Route path="/blog/additional-insured-vs-certificate-holder" element={<AdditionalInsuredVsCertificateHolder />} />
          <Route path="/blog/vendor-insurance-tracking-mistakes" element={<VendorInsuranceTrackingMistakes />} />
          <Route path="/blog/general-liability-coverage-limits" element={<GeneralLiabilityCoverageLimits />} />
          <Route path="/blog/automate-coi-collection" element={<AutomateCOICollection />} />
          <Route path="/blog/vendor-insurance-compliance-small-business" element={<VendorInsuranceComplianceSmallBusiness />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
        <Toaster />
        <ScrollToTop />
        <GoogleAnalytics />
      </BrowserRouter>
    </div>
  );
}
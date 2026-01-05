import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/api';
import { Toaster } from 'sonner';

// Eager load critical components
import DashboardLayout from './components/DashboardLayoutNew';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import PremiumLoader from './components/PremiumLoader';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';

// Lazy load all public pages for better performance
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const Security = lazy(() => import('./components/Security'));
const Pricing = lazy(() => import('./components/Pricing'));
const SolutionsPropertyManagement = lazy(() => import('./components/SolutionsPropertyManagement'));
const SolutionsConstruction = lazy(() => import('./components/SolutionsConstruction'));
const FeaturesCOITracking = lazy(() => import('./components/FeaturesCOITracking'));
const IndustriesHealthcare = lazy(() => import('./components/IndustriesHealthcare'));
const IndustriesLogistics = lazy(() => import('./components/IndustriesLogistics'));
const IndustriesFranchise = lazy(() => import('./components/IndustriesFranchise'));
const IndustriesFacilities = lazy(() => import('./components/IndustriesFacilities'));
const IndustriesGovernment = lazy(() => import('./components/IndustriesGovernment'));
const IndustriesEducation = lazy(() => import('./components/IndustriesEducation'));
const IndustriesRetail = lazy(() => import('./components/IndustriesRetail'));
const IndustriesHospitality = lazy(() => import('./components/IndustriesHospitality'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Sitemap = lazy(() => import('./components/Sitemap'));
const HowToTrackVendorCompliance = lazy(() => import('./components/HowToTrackVendorCompliance'));
const WhatHappensVendorUninsured = lazy(() => import('./components/WhatHappensVendorUninsured'));
const BlogList = lazy(() => import('./components/BlogList'));
const WhatIsCertificateOfInsurance = lazy(() => import('./components/blogs/WhatIsCertificateOfInsurance'));
const TrackVendorInsuranceExpiration = lazy(() => import('./components/blogs/TrackVendorInsuranceExpiration'));
const VendorComplianceChecklist = lazy(() => import('./components/blogs/VendorComplianceChecklist'));
const PropertyManagersVerifyVendorInsurance = lazy(() => import('./components/blogs/PropertyManagersVerifyVendorInsurance'));
const COITrackingSpreadsheetVsSoftware = lazy(() => import('./components/blogs/COITrackingSpreadsheetVsSoftware'));
const ExpiredVendorInsurance = lazy(() => import('./components/blogs/ExpiredVendorInsurance'));
const ConstructionVendorInsuranceRequirements = lazy(() => import('./components/blogs/ConstructionVendorInsuranceRequirements'));
const AdditionalInsuredVsCertificateHolder = lazy(() => import('./components/blogs/AdditionalInsuredVsCertificateHolder'));
const VendorInsuranceTrackingMistakes = lazy(() => import('./components/blogs/VendorInsuranceTrackingMistakes'));
const GeneralLiabilityCoverageLimits = lazy(() => import('./components/blogs/GeneralLiabilityCoverageLimits'));
const AutomateCOICollection = lazy(() => import('./components/blogs/AutomateCOICollection'));
const VendorInsuranceComplianceSmallBusiness = lazy(() => import('./components/blogs/VendorInsuranceComplianceSmallBusiness'));

// Lazy load all other components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const VendorManagement = lazy(() => import('./components/VendorManagement'));
const VendorDetail = lazy(() => import('./components/VendorDetail'));
const InsuranceTracking = lazy(() => import('./components/InsuranceTracking'));
const AlertsReminders = lazy(() => import('./components/AlertsReminders'));
const ComplianceDashboard = lazy(() => import('./components/ComplianceDashboard'));
const ReportsExports = lazy(() => import('./components/ReportsExports'));
const Settings = lazy(() => import('./components/Settings'));
const ContractManagement = lazy(() => import('./components/ContractManagement'));
const AddVendor = lazy(() => import('./components/AddVendor'));
const Billing = lazy(() => import('./components/Billing'));

function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <DashboardLayout>
      <Suspense fallback={<PremiumLoader />}>
        <PageTransition>
          {children}
        </PageTransition>
      </Suspense>
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
          <Route path="/forgot-password" element={<Suspense fallback={<PremiumLoader />}><ForgotPassword /></Suspense>} />
          <Route path="/terms-of-service" element={<Suspense fallback={<PremiumLoader />}><TermsOfService /></Suspense>} />
          <Route path="/privacy-policy" element={<Suspense fallback={<PremiumLoader />}><PrivacyPolicy /></Suspense>} />
          <Route path="/security" element={<Suspense fallback={<PremiumLoader />}><Security /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<PremiumLoader />}><Pricing /></Suspense>} />
          <Route path="/solutions-property-management" element={<Suspense fallback={<PremiumLoader />}><SolutionsPropertyManagement /></Suspense>} />
          <Route path="/solutions-construction" element={<Suspense fallback={<PremiumLoader />}><SolutionsConstruction /></Suspense>} />
          <Route path="/features-coi-tracking" element={<Suspense fallback={<PremiumLoader />}><FeaturesCOITracking /></Suspense>} />
          <Route path="/industries-healthcare" element={<Suspense fallback={<PremiumLoader />}><IndustriesHealthcare /></Suspense>} />
          <Route path="/industries-logistics" element={<Suspense fallback={<PremiumLoader />}><IndustriesLogistics /></Suspense>} />
          <Route path="/industries-franchise" element={<Suspense fallback={<PremiumLoader />}><IndustriesFranchise /></Suspense>} />
          <Route path="/industries-facilities" element={<Suspense fallback={<PremiumLoader />}><IndustriesFacilities /></Suspense>} />
          <Route path="/industries-government" element={<Suspense fallback={<PremiumLoader />}><IndustriesGovernment /></Suspense>} />
          <Route path="/industries-education" element={<Suspense fallback={<PremiumLoader />}><IndustriesEducation /></Suspense>} />
          <Route path="/industries-retail" element={<Suspense fallback={<PremiumLoader />}><IndustriesRetail /></Suspense>} />
          <Route path="/industries-hospitality" element={<Suspense fallback={<PremiumLoader />}><IndustriesHospitality /></Suspense>} />
          <Route path="/about-us" element={<Suspense fallback={<PremiumLoader />}><AboutUs /></Suspense>} />
          <Route path="/sitemap" element={<Suspense fallback={<PremiumLoader />}><Sitemap /></Suspense>} />
          <Route path="/how-to-track-vendor-compliance" element={<Suspense fallback={<PremiumLoader />}><HowToTrackVendorCompliance /></Suspense>} />
          <Route path="/what-happens-vendor-uninsured" element={<Suspense fallback={<PremiumLoader />}><WhatHappensVendorUninsured /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<PremiumLoader />}><BlogList /></Suspense>} />
          <Route path="/blog/what-is-certificate-of-insurance" element={<Suspense fallback={<PremiumLoader />}><WhatIsCertificateOfInsurance /></Suspense>} />
          <Route path="/blog/track-vendor-insurance-expiration-automatically" element={<Suspense fallback={<PremiumLoader />}><TrackVendorInsuranceExpiration /></Suspense>} />
          <Route path="/blog/vendor-compliance-checklist" element={<Suspense fallback={<PremiumLoader />}><VendorComplianceChecklist /></Suspense>} />
          <Route path="/blog/property-managers-verify-vendor-insurance" element={<Suspense fallback={<PremiumLoader />}><PropertyManagersVerifyVendorInsurance /></Suspense>} />
          <Route path="/blog/coi-tracking-spreadsheet-vs-software" element={<Suspense fallback={<PremiumLoader />}><COITrackingSpreadsheetVsSoftware /></Suspense>} />
          <Route path="/blog/expired-vendor-insurance-what-to-do" element={<Suspense fallback={<PremiumLoader />}><ExpiredVendorInsurance /></Suspense>} />
          <Route path="/blog/construction-vendor-insurance-requirements" element={<Suspense fallback={<PremiumLoader />}><ConstructionVendorInsuranceRequirements /></Suspense>} />
          <Route path="/blog/additional-insured-vs-certificate-holder" element={<Suspense fallback={<PremiumLoader />}><AdditionalInsuredVsCertificateHolder /></Suspense>} />
          <Route path="/blog/vendor-insurance-tracking-mistakes" element={<Suspense fallback={<PremiumLoader />}><VendorInsuranceTrackingMistakes /></Suspense>} />
          <Route path="/blog/general-liability-coverage-limits" element={<Suspense fallback={<PremiumLoader />}><GeneralLiabilityCoverageLimits /></Suspense>} />
          <Route path="/blog/automate-coi-collection" element={<Suspense fallback={<PremiumLoader />}><AutomateCOICollection /></Suspense>} />
          <Route path="/blog/vendor-insurance-compliance-small-business" element={<Suspense fallback={<PremiumLoader />}><VendorInsuranceComplianceSmallBusiness /></Suspense>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
        <Toaster />
        <ScrollToTop />
        <GoogleAnalytics />
      </BrowserRouter>
    </div>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './lib/api';
import { Toaster } from 'sonner';

// Import loader for Suspense fallback
import PremiumLoader from './components/PremiumLoader';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';

import AdminDashboard from './components/AdminDashboard';
import DashboardLayout from './components/DashboardLayoutNew';

// Lazy load components to optimize bundle size and performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const PageTransition = lazy(() => import('./components/PageTransition'));

// Public pages
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
const Contact = lazy(() => import('./components/Contact'));
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
const SubscriptionSuccess = lazy(() => import('./components/SubscriptionSuccess'));

// Dashboard components
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
const VendorPortal = lazy(() => import('./components/VendorPortal'));

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
    // Note: Disabling zoom is generally bad for accessibility, but can be useful for 
    // web apps that need to feel like native apps. We're keeping standard viewport 
    // settings for better accessibility per audit recommendations.
    /*
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    */
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
        <Suspense fallback={<PremiumLoader fullScreen />}>
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
              path="/admin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
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
            <Route path="/contact" element={<Contact />} />
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
        </Suspense>
        <Toaster />
        <ScrollToTop />
        <GoogleAnalytics />
      </BrowserRouter>
    </div>
  );
}
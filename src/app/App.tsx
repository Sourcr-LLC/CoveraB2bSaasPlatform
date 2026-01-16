import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './lib/api';
import { Toaster } from 'sonner';

// Import loader for Suspense fallback
import PremiumLoader from './components/PremiumLoader';
import DashboardLoadingFallback from './components/DashboardLoadingFallback';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';

// Lazy load components to optimize bundle size and performance
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const DashboardLayout = lazy(() => import('./components/DashboardLayoutNew'));
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
const ContractDetail = lazy(() => import('./components/ContractDetail'));
const AddVendor = lazy(() => import('./components/AddVendor'));
const Billing = lazy(() => import('./components/Billing'));
const VendorPortal = lazy(() => import('./components/VendorPortal'));

function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <DashboardLayout>
      {/* PageTransition removed for performance optimization */}
      {children}
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
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<PremiumLoader fullScreen />}>
                {isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
              </Suspense>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<PremiumLoader fullScreen />}>
                {isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={() => setIsAuthenticated(true)} />}
              </Suspense>
            } 
          />
          <Route path="/upload/:token" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <VendorPortal />
            </Suspense>
          } />
          
          {/* Protected routes with sidebar */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/vendors"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <VendorManagement />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <VendorDetail />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/insurance"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <InsuranceTracking />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/alerts"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AlertsReminders />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/compliance"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ComplianceDashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/reports"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ReportsExports />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route path="/settings" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/billing" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Billing />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route
            path="/contracts"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ContractManagement />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/contracts/:id"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ContractDetail />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/add-vendor"
            element={
              <Suspense fallback={<DashboardLoadingFallback />}>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AddVendor />
                </ProtectedRoute>
              </Suspense>
            }
          />
          
          {/* Public pages */}
          <Route path="/forgot-password" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/terms-of-service" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <TermsOfService />
            </Suspense>
          } />
          <Route path="/privacy-policy" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/security" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <Security />
            </Suspense>
          } />
          <Route path="/pricing" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <Pricing />
            </Suspense>
          } />
          <Route path="/solutions-property-management" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <SolutionsPropertyManagement />
            </Suspense>
          } />
          <Route path="/solutions-construction" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <SolutionsConstruction />
            </Suspense>
          } />
          <Route path="/features-coi-tracking" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <FeaturesCOITracking />
            </Suspense>
          } />
          <Route path="/industries-healthcare" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesHealthcare />
            </Suspense>
          } />
          <Route path="/industries-logistics" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesLogistics />
            </Suspense>
          } />
          <Route path="/industries-franchise" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesFranchise />
            </Suspense>
          } />
          <Route path="/industries-facilities" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesFacilities />
            </Suspense>
          } />
          <Route path="/industries-government" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesGovernment />
            </Suspense>
          } />
          <Route path="/industries-education" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesEducation />
            </Suspense>
          } />
          <Route path="/industries-retail" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesRetail />
            </Suspense>
          } />
          <Route path="/industries-hospitality" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <IndustriesHospitality />
            </Suspense>
          } />
          <Route path="/about-us" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <AboutUs />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <Contact />
            </Suspense>
          } />
          <Route path="/sitemap" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <Sitemap />
            </Suspense>
          } />
          <Route path="/how-to-track-vendor-compliance" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <HowToTrackVendorCompliance />
            </Suspense>
          } />
          <Route path="/what-happens-vendor-uninsured" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <WhatHappensVendorUninsured />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <BlogList />
            </Suspense>
          } />
          <Route path="/blog/what-is-certificate-of-insurance" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <WhatIsCertificateOfInsurance />
            </Suspense>
          } />
          <Route path="/blog/track-vendor-insurance-expiration-automatically" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <TrackVendorInsuranceExpiration />
            </Suspense>
          } />
          <Route path="/blog/vendor-compliance-checklist" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <VendorComplianceChecklist />
            </Suspense>
          } />
          <Route path="/blog/property-managers-verify-vendor-insurance" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <PropertyManagersVerifyVendorInsurance />
            </Suspense>
          } />
          <Route path="/blog/coi-tracking-spreadsheet-vs-software" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <COITrackingSpreadsheetVsSoftware />
            </Suspense>
          } />
          <Route path="/blog/expired-vendor-insurance-what-to-do" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <ExpiredVendorInsurance />
            </Suspense>
          } />
          <Route path="/blog/construction-vendor-insurance-requirements" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <ConstructionVendorInsuranceRequirements />
            </Suspense>
          } />
          <Route path="/blog/additional-insured-vs-certificate-holder" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <AdditionalInsuredVsCertificateHolder />
            </Suspense>
          } />
          <Route path="/blog/vendor-insurance-tracking-mistakes" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <VendorInsuranceTrackingMistakes />
            </Suspense>
          } />
          <Route path="/blog/general-liability-coverage-limits" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <GeneralLiabilityCoverageLimits />
            </Suspense>
          } />
          <Route path="/blog/automate-coi-collection" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <AutomateCOICollection />
            </Suspense>
          } />
          <Route path="/blog/vendor-insurance-compliance-small-business" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <VendorInsuranceComplianceSmallBusiness />
            </Suspense>
          } />
          <Route path="/subscription-success" element={
            <Suspense fallback={<PremiumLoader fullScreen />}>
              <SubscriptionSuccess />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
        <Toaster />
        <ScrollToTop />
        <GoogleAnalytics />
      </BrowserRouter>
    </div>
  );
}
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Lock } from 'lucide-react';
import { authApi, supabase } from '../lib/api';
import { useSubscription } from '../hooks/useSubscription';
import { useWalkthrough } from '../hooks/useWalkthrough';
import MobileNav from './MobileNav';
import DesktopSidebar from './DesktopSidebar';
import NotificationCenter from './NotificationCenter';
import PremiumLoader from './PremiumLoader';
import PaywallModal from './PaywallModal';
import InteractiveWalkthrough from './InteractiveWalkthrough';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState('My Organization');
  const [userEmail, setUserEmail] = useState('admin@acme.com');
  const [userName, setUserName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const { shouldShowWalkthrough, isChecking: walkthroughChecking, completeWalkthrough, skipWalkthrough } = useWalkthrough(location.pathname);

  // Debug walkthrough rendering
  useEffect(() => {
    console.log('🎬 Dashboard render state:', {
      pathname: location.pathname,
      shouldShowWalkthrough,
      walkthroughChecking,
      willRender: shouldShowWalkthrough && !walkthroughChecking
    });
  }, [location.pathname, shouldShowWalkthrough, walkthroughChecking]);

  const loadProfile = useCallback(async () => {
    try {
      // First verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('⚠️ No session available, skipping profile load');
        return;
      }

      const [profileData, sessionData] = await Promise.all([
        authApi.getProfile(),
        authApi.getSession()
      ]);
      
      if (profileData?.organizationName) {
        setOrganizationName(profileData.organizationName);
      }
      
      if (profileData?.name) {
        setUserName(profileData.name);
      }

      if (profileData?.logoUrl) {
        setLogoUrl(profileData.logoUrl);
      } else {
        setLogoUrl(null);
      }
      
      if (sessionData?.user?.email) {
        setUserEmail(sessionData.user.email);
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      // If it's an auth error, the apiCall helper will handle the redirect
      // For other errors, just log them - don't block the UI
    }
  }, []);

  useEffect(() => {
    loadProfile();
    
    const handleProfileUpdate = () => {
      loadProfile();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [loadProfile]);

  const userInitials = useMemo(() => {
    if (!userName || !userName.trim()) return 'UN';
    const words = userName.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }, [userName]);

  // Check if current route requires premium subscription
  const isPremiumRoute = () => {
    // Free routes that anyone can access: Settings, Billing, and Admin only
    const freeRoutes = ['/settings', '/billing', '/admin'];
    
    // Check if path is exactly one of the free routes OR starts with one of them (e.g. /admin/users)
    const isFreeRoute = freeRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(`${route}/`)
    );
    
    return !isFreeRoute;
  };

  const shouldShowPaywall = !subscriptionLoading && !isPremium && isPremiumRoute();

  if (subscriptionLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <PremiumLoader fullScreen />
      </div>
    );
  }

  if (shouldShowPaywall) {
    return (
      <>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
          {/* Desktop Sidebar */}
          <DesktopSidebar
            organizationName={organizationName}
            userEmail={userEmail}
            userInitials={userInitials}
            logoUrl={logoUrl}
          />

          {/* Mobile Navigation */}
          <MobileNav
            organizationName={organizationName}
            userEmail={userEmail}
            userInitials={userInitials}
            logoUrl={logoUrl}
          />

          {/* Locked Page View */}
          <main className="lg:ml-64 pb-6">
            <div className="min-h-screen p-6 flex items-center justify-center">
              <div className="max-w-md w-full text-center">
                <div 
                  className="rounded-2xl border p-10"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: 'rgba(58, 79, 106, 0.1)' }}
                  >
                    <Lock size={40} style={{ color: 'var(--primary)' }} />
                  </div>
                  
                  <h1 className="text-3xl mb-4" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                    Premium Subscription Required
                  </h1>
                  
                  <p className="text-lg mb-8" style={{ color: 'var(--foreground-muted)' }}>
                    Covera is a premium vendor compliance and insurance tracking platform. Upgrade to Core to unlock full access to all features.
                  </p>

                  <button
                    onClick={() => setIsPaywallOpen(true)}
                    className="w-full px-8 py-4 rounded-lg mb-4 transition-all"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                  >
                    Start 7-Day Free Trial
                  </button>

                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full px-8 py-4 rounded-lg border transition-all"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground-muted)',
                      fontWeight: 500
                    }}
                  >
                    Go to Settings
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Paywall Modal */}
        <PaywallModal 
          isOpen={isPaywallOpen} 
          onClose={() => setIsPaywallOpen(false)}
          feature="all premium features"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        organizationName={organizationName}
        userEmail={userEmail}
        userInitials={userInitials}
        logoUrl={logoUrl}
      />

      {/* Mobile Navigation */}
      <MobileNav
        organizationName={organizationName}
        userEmail={userEmail}
        userInitials={userInitials}
        logoUrl={logoUrl}
      />

      {/* Main Content - with left margin on desktop for sidebar */}
      <main className="lg:ml-64 pb-6">
        {children}
        {shouldShowWalkthrough && !walkthroughChecking && (
          <InteractiveWalkthrough
            onComplete={completeWalkthrough}
            onSkip={skipWalkthrough}
          />
        )}
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileNav from './MobileNav';
import PremiumLoader from './PremiumLoader';

export default function DashboardLoadingFallback() {
  const [organizationName, setOrganizationName] = useState('My Organization');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Try to load cached user data from localStorage for immediate display
    try {
      const cachedProfile = localStorage.getItem('covera-profile-cache');
      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        if (profile.organizationName) setOrganizationName(profile.organizationName);
        if (profile.userEmail) setUserEmail(profile.userEmail);
        if (profile.userName) setUserName(profile.userName);
        if (profile.logoUrl) setLogoUrl(profile.logoUrl);
      }
    } catch (error) {
      console.error('Failed to load cached profile:', error);
    }
  }, []);

  const getUserInitials = () => {
    if (!userName || !userName.trim()) return 'UN';
    const words = userName.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        organizationName={organizationName}
        userEmail={userEmail}
        userInitials={getUserInitials()}
        logoUrl={logoUrl}
      />

      {/* Mobile Navigation */}
      <MobileNav
        organizationName={organizationName}
        userEmail={userEmail}
        userInitials={getUserInitials()}
        logoUrl={logoUrl}
      />

      {/* Loading Content */}
      <main className="lg:ml-64 pb-6">
        <div className="flex h-screen items-center justify-center">
          <PremiumLoader fullScreen={false} />
        </div>
      </main>
    </div>
  );
}

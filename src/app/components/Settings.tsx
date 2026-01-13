import { User, CreditCard, Building2, CheckCircle2, Edit2, Check, X, Upload, Image, Eye, Mail, MessageSquare, Globe, AlertCircle, RefreshCw } from 'lucide-react';
import { projectId } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/api';
import PaywallModal from './PaywallModal';
import { useWalkthrough } from '../hooks/useWalkthrough';
import { useNavigate } from 'react-router-dom';
import { isDemoMode, enableDemoMode, disableDemoMode } from '../lib/demoData';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editingOrg, setEditingOrg] = useState(false);
  const [tempOrgName, setTempOrgName] = useState('');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [domainStatus, setDomainStatus] = useState<'none' | 'pending' | 'verified' | 'failed'>('none');
  const [savingDomain, setSavingDomain] = useState(false);
  const { resetWalkthrough } = useWalkthrough();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionStatus();
    fetchProfile();
    fetchCustomDomain();
    setDemoEnabled(isDemoMode());
  }, []);

  const fetchCustomDomain = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/domain`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.domain) {
          setCustomDomain(data.domain);
          setDomainStatus(data.status || 'pending');
        }
      }
    } catch (error) {
      console.error('Error fetching domain:', error);
    }
  };

  const handleSaveDomain = async (options?: { verify?: boolean }) => {
    if (!customDomain) return;
    const isVerify = options?.verify === true;

    // Basic domain validation regex
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
    if (!domainRegex.test(customDomain)) {
      toast.error("Please enter a valid domain (e.g., portal.yourcompany.com)");
      return;
    }

    setSavingDomain(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/domain`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain: customDomain, verify: isVerify }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDomainStatus(data.status);
        
        if (data.status === 'verified') {
          toast.success('Domain successfully verified!');
        } else if (data.status === 'failed') {
          toast.error(data.message || 'Verification failed. Please check your DNS settings.');
        } else {
          toast.success(data.message || 'Domain saved successfully');
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save domain');
      }
    } catch (error) {
      console.error('Error saving domain:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSavingDomain(false);
    }
  };

  const toggleDemoMode = () => {
    if (demoEnabled) {
      disableDemoMode();
      setDemoEnabled(false);
    } else {
      enableDemoMode();
      setDemoEnabled(true);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/profile`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setTempOrgName(data.organizationName || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSaveOrganization = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizationName: tempOrgName }),
        }
      );

      if (response.ok) {
        toast.success('Organization name updated successfully');
        setProfile({ ...profile, organizationName: tempOrgName });
        setEditingOrg(false);
        
        // Trigger a reload of the sidebar by dispatching a custom event
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        toast.error('Failed to update organization name');
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setTempOrgName(profile?.organizationName || '');
    setEditingOrg(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      setUploadingLogo(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Not authenticated');
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/upload-logo`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success('Company logo updated successfully');
        setProfile({ ...profile, logoUrl: data.logoUrl });
        
        // Trigger a reload of the sidebar
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('An error occurred while uploading. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logoUrl: null }),
        }
      );

      if (response.ok) {
        toast.success('Logo removed successfully');
        setProfile({ ...profile, logoUrl: null });
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        toast.error('Failed to remove logo');
      }
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/subscription-status`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        console.error('Error fetching subscription: Response not OK', response.status);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleUpgrade = () => {
    setIsPaywallOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaywallOpen(false);
    fetchSubscriptionStatus();
    toast.success('Welcome to Covera Core! Your subscription is now active.');
    resetWalkthrough();
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      free: { bg: 'rgba(148, 163, 184, 0.1)', color: '#64748b' },
      core: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
      enterprise: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
    };

    const colors = planColors[plan as keyof typeof planColors] || planColors.free;

    return (
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs"
        style={{
          backgroundColor: colors.bg,
          color: colors.color,
          fontWeight: 600,
        }}
      >
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--foreground-muted)' }}>
            Manage your account and subscription
          </p>
        </div>

        {/* Profile Information Card */}
        {profile && (
          <div
            className="rounded-xl border p-8 mb-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  Account Information
                </h2>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Your profile and organization details
                </p>
              </div>
              <User size={24} style={{ color: 'var(--foreground-muted)' }} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  Name
                </span>
                <span className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                  {profile.name || 'Not set'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  Email
                </span>
                <span className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                  {profile.email || 'Not set'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm flex items-center gap-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  <Building2 size={16} />
                  Organization
                </span>
                {editingOrg ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempOrgName}
                      onChange={(e) => setTempOrgName(e.target.value)}
                      className="border px-3 py-1.5 rounded-lg text-sm"
                      style={{ 
                        borderColor: 'var(--border)', 
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        outline: 'none',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveOrganization}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                      {profile.organizationName || 'Not set'}
                    </span>
                    <button
                      onClick={() => setEditingOrg(true)}
                      className="p-1.5 rounded-lg transition-all hover:bg-opacity-80"
                      style={{ 
                        backgroundColor: 'var(--panel)',
                        color: 'var(--foreground-muted)',
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm flex items-center gap-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  <Image size={16} />
                  Logo
                </span>
                {profile.logoUrl ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={profile.logoUrl}
                      alt="Company Logo"
                      className="w-8 h-8 rounded-full"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="border px-3 py-1.5 rounded-lg text-sm"
                      style={{ 
                        borderColor: 'var(--border)', 
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        outline: 'none',
                        maxWidth: '200px'
                      }}
                    />
                    {uploadingLogo && (
                      <span className="text-sm" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        Uploading...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Custom Domain Card */}
        <div
          className="rounded-xl border p-8 mb-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Custom Domain
              </h2>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Use your own domain (e.g., portal.yourcompany.com) for the vendor portal
              </p>
            </div>
            <Globe size={24} style={{ color: 'var(--foreground-muted)' }} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="portal.yourcompany.com"
                  className="w-full border px-4 py-2.5 rounded-lg text-sm"
                  style={{ 
                    borderColor: 'var(--border)', 
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                  disabled={domainStatus === 'verified'}
                />
              </div>
              <button
                onClick={() => handleSaveDomain({ verify: false })}
                disabled={savingDomain || domainStatus === 'verified' || !customDomain}
                className="px-6 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: domainStatus === 'verified' ? '#10b981' : 'var(--primary)',
                  color: 'white',
                  fontWeight: 500,
                  opacity: savingDomain || (domainStatus === 'verified') ? 0.7 : 1,
                  cursor: (savingDomain || domainStatus === 'verified') ? 'not-allowed' : 'pointer',
                }}
              >
                {savingDomain ? 'Saving...' : domainStatus === 'verified' ? 'Verified' : 'Save Domain'}
              </button>
            </div>

            {/* DNS Instructions */}
            {customDomain && domainStatus !== 'none' && (
              <div 
                className="mt-6 p-4 rounded-lg text-sm"
                style={{
                  backgroundColor: domainStatus === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'var(--panel)',
                  border: `1px solid ${domainStatus === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)'}`,
                }}
              >
                {domainStatus === 'verified' ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Domain Active</h4>
                      <p style={{ color: 'var(--foreground-muted)' }}>Your vendor portal is now accessible at {customDomain}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle size={18} style={{ color: 'var(--primary)' }} />
                      <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>DNS Configuration Required</h4>
                    </div>
                    <p className="mb-3" style={{ color: 'var(--foreground-muted)' }}>
                      Create a CNAME record in your DNS provider with the following values:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded bg-white border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Type</div>
                        <div className="font-mono text-sm">CNAME</div>
                      </div>
                      <div className="p-3 rounded bg-white border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Name / Host</div>
                        <div className="font-mono text-sm">{customDomain.split('.')[0]}</div>
                      </div>
                      <div className="col-span-1 md:col-span-2 p-3 rounded bg-white border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Value / Target</div>
                        <div className="font-mono text-sm">alias.netlify.app</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveDomain({ verify: true })}
                      className="flex items-center gap-2 text-xs font-medium hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      <RefreshCw size={12} />
                      Verify DNS Configuration
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subscription Card */}
        <div
          className="rounded-xl border p-8 mb-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Subscription
              </h2>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Manage your Covera subscription
              </p>
            </div>
            <CreditCard size={24} style={{ color: 'var(--foreground-muted)' }} />
          </div>

          {subscription && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  Current Plan
                </span>
                {getPlanBadge(subscription.plan)}
              </div>

              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
                  Status
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-sm"
                  style={{
                    color: subscription.subscriptionStatus === 'active' ? '#10b981' : 'var(--foreground-muted)',
                    fontWeight: 500,
                  }}
                >
                  {subscription.subscriptionStatus === 'active' && <CheckCircle2 size={16} />}
                  {subscription.subscriptionStatus.charAt(0).toUpperCase() + subscription.subscriptionStatus.slice(1)}
                </span>
              </div>

              {subscription.plan === 'free' && (
                <div className="pt-4">
                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontWeight: 500,
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Processing...' : 'Start 7-Day Free Trial'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Core Plan Features */}
        {subscription?.plan === 'free' && (
          <div
            className="rounded-xl border p-8 mb-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 className="text-lg mb-6" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Core Plan — $399/month
            </h3>

            <div className="space-y-3">
              {[
                'Track up to 150 vendors',
                'Unlimited compliance tracking',
                'Real-time expiry monitoring',
                'Automated alerts & notifications',
                'Certificate of Insurance (COI) management',
                'Activity logs & audit trails',
                'PDF, CSV & Excel exports',
                'Email support',
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}
                  />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Platform Walkthrough */}
        <div
          className="rounded-xl border p-8 mb-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Platform Tour
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Take a guided tour of Covera's features and capabilities
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              const success = await resetWalkthrough();
              if (success) {
                toast.success('Starting platform tour...');
                // Navigate to dashboard where the walkthrough will trigger
                navigate('/dashboard');
                // Dispatch event after a brief delay to ensure dashboard is mounted
                setTimeout(() => {
                  window.dispatchEvent(new Event('showWalkthrough'));
                }, 100);
              } else {
                toast.error('Failed to start tour. Please try again.');
              }
            }}
            className="px-6 py-3 rounded-lg border text-sm transition-all"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              fontWeight: 500,
            }}
          >
            View Walkthrough
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <div
          className="rounded-xl border p-8"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={20} style={{ color: 'var(--primary)' }} />
                <h3 className="text-lg" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  Demo Mode {demoEnabled && <span style={{ color: 'var(--primary)' }}>(Active)</span>}
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Enable demo mode to display realistic sample data across the dashboard, vendors, and contracts pages. Perfect for taking screenshots or presenting the platform.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toggleDemoMode();
              toast.success(demoEnabled ? 'Demo mode disabled' : 'Demo mode enabled - refresh pages to see sample data');
            }}
            className="px-6 py-3 rounded-lg text-sm transition-all"
            style={{
              backgroundColor: demoEnabled ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary)',
              color: demoEnabled ? '#ef4444' : 'var(--primary-foreground)',
              fontWeight: 500,
            }}
          >
            {demoEnabled ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          </button>
        </div>

        {/* Support & Help */}
        <div
          className="rounded-xl border p-8 mt-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="mb-6">
            <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Support & Help
            </h3>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Need assistance? Our team is here to help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Sales Inquiries */}
            <a
              href="mailto:sales@covera.co"
              className="flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--panel)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(58, 79, 106, 0.1)' }}
              >
                <Mail size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  Sales Inquiries
                </h4>
                <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Questions about plans, pricing, or features
                </p>
                <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  sales@covera.co
                </span>
              </div>
            </a>

            {/* Customer Support */}
            <a
              href="mailto:support@covera.co"
              className="flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--panel)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
              >
                <MessageSquare size={20} style={{ color: '#22c55e' }} />
              </div>
              <div>
                <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  Customer Support
                </h4>
                <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Technical help and troubleshooting
                </p>
                <span className="text-xs" style={{ color: '#22c55e', fontWeight: 500 }}>
                  support@covera.co
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
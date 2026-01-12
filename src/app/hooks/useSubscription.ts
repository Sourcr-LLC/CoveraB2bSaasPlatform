import { useState, useEffect } from 'react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';

export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.warn('⚠️ No access token available for subscription check - skipping');
        setLoading(false);
        return;
      }

      // Admin override - always premium (bypass server check)
      if (session?.user?.email === 'admin@covera.co') {
        console.log('👑 Admin user detected - granting premium access immediately');
        setSubscription({
          plan: 'enterprise',
          subscriptionStatus: 'active'
        });
        setLoading(false);
        return;
      }
      
      const stripeMode = (localStorage.getItem('stripe_mode') as 'production' | 'test') || 'production';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/subscription-status`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('🔒 Subscription check failed - session expired, redirecting to login');
        // Clear localStorage directly (don't call signOut API as session is already invalid)
        localStorage.removeItem('sb-gpnvockmgvysulsxxtyi-auth-token');
        sessionStorage.clear();
        // Redirect only once
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return;
      }

      if (response.ok) {
        const data = await response.json();
        
        // Admin override - always premium
        if (session.user.email === 'admin@covera.co') {
          console.log('👑 Admin user detected - granting premium access');
          setSubscription({
            ...data,
            plan: 'enterprise',
            subscriptionStatus: 'active'
          });
          setLoading(false);
          return;
        }

        console.log('✅ Subscription data loaded:', {
          plan: data.plan,
          status: data.subscriptionStatus,
          isPremium: (data.plan === 'essentials' || data.plan === 'core' || data.plan === 'enterprise') && 
                    (data.subscriptionStatus === 'active' || data.subscriptionStatus === 'trialing')
        });
        setSubscription(data);
      } else {
        console.error('❌ Subscription API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = () => {
    // Check if user has an active subscription (including trial)
    if (!subscription) return false;
    
    // Include all paid plans: essentials, core, enterprise
    const hasPaidPlan = subscription.plan === 'essentials' || subscription.plan === 'core' || subscription.plan === 'enterprise';
    const isActive = subscription.subscriptionStatus === 'active' || subscription.subscriptionStatus === 'trialing';
    
    return hasPaidPlan && isActive;
  };

  const isFree = () => {
    return !subscription || subscription?.plan === 'free';
  };

  const canAccessFeature = (feature: 'reports' | 'bulk-operations' | 'advanced-analytics') => {
    if (!subscription) return false;
    
    // Essentials features (basic access)
    if (subscription.plan === 'essentials') {
      // Essentials does not include reports or advanced analytics
      return feature !== 'reports' && feature !== 'advanced-analytics';
    }
    
    // Core and Enterprise have access to all current features
    return isPremium();
  };

  const getMaxVendors = () => {
    if (!subscription) return 5;
    
    // Check for plan-specific limits
    if (subscription.plan === 'essentials') return 50;
    if (subscription.plan === 'core') return 150;
    if (subscription.plan === 'enterprise') return 999999; // Effectively unlimited
    
    // Default/Free plan limit
    return 5;
  };

  return {
    subscription,
    loading,
    isPremium: isPremium(),
    isFree: isFree(),
    canAccessFeature,
    getMaxVendors,
    refresh: fetchSubscription,
  };
}
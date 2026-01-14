import { useState, useEffect } from 'react';
import { CreditCard, Check, AlertCircle, ArrowUpRight, Calendar, CheckCircle2, Zap, RefreshCw, Loader2, Download } from 'lucide-react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';
import { toast } from 'sonner';
import PaywallModal from './PaywallModal';
import StripePaymentForm from './StripePaymentForm';
import ContactSalesModal from './ContactSalesModal';
import PremiumLoader from './PremiumLoader';

const PLAN_DETAILS: Record<string, { monthlyPrice: number; yearlyPrice: number; name: string; features: string[] }> = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    name: 'Free',
    features: [
      'Track up to 15 vendors',
      'Basic compliance tracking',
      'COI uploads'
    ]
  },
  essentials: {
    monthlyPrice: 199,
    yearlyPrice: 1990,
    name: 'Essentials',
    features: [
      'Track up to 50 vendors',
      'Unlimited compliance tracking',
      'Real-time expiry monitoring',
      'Automated alerts & notifications',
      'Certificate of Insurance (COI) management',
      'Standard email support',
    ]
  },
  core: {
    monthlyPrice: 399,
    yearlyPrice: 3990,
    name: 'Core',
    features: [
      'Track up to 150 vendors',
      'Unlimited compliance tracking',
      'Real-time expiry monitoring',
      'Automated alerts & notifications',
      'Certificate of Insurance (COI) management',
      'Activity logs & audit trails',
      'PDF, CSV & Excel exports',
      'Priority email support',
    ]
  },
  enterprise: {
    monthlyPrice: 1200,
    yearlyPrice: 12000,
    name: 'Enterprise',
    features: [
      'Unlimited vendors',
      'Multiple locations / entities',
      'Custom compliance rules',
      'Internal escalations',
      'Dedicated onboarding',
      'Priority support',
      'Security & legal review'
    ]
  }
};

export default function Billing() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [updatePaymentClientSecret, setUpdatePaymentClientSecret] = useState<string | null>(null);
  const [updatePaymentSetupIntentId, setUpdatePaymentSetupIntentId] = useState<string | null>(null);

  // Initialize stripeMode from localStorage
  const stripeMode = (localStorage.getItem('stripe_mode') as 'production' | 'test') || 'production';

  useEffect(() => {
    fetchSubscription();
    fetchPaymentMethod();
    fetchInvoices();
  }, []);

  const fetchSubscription = async () => {
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
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Subscription data received:', data);
        setSubscription(data);
      } else {
        console.error('Error fetching subscription: Response not OK', response.status);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/payment-method`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPaymentMethod(data);
      } else {
        console.error('Error fetching payment method: Response not OK', response.status);
      }
    } catch (error) {
      console.error('Error fetching payment method:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/invoices`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        console.error('Error fetching invoices: Response not OK', response.status);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleUpgrade = () => {
    setIsPaywallOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaywallOpen(false);
    // Reload to refresh subscription status and remove paywall
    window.location.reload();
  };

  const handleUpdatePaymentClick = async () => {
    setShowUpdatePayment(true);
    setIsUpdatingPayment(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Please log in to update payment method');
        setShowUpdatePayment(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/update-payment-method`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initialize payment update');
      }

      const data = await response.json();
      setUpdatePaymentClientSecret(data.clientSecret);
      setUpdatePaymentSetupIntentId(data.setupIntentId);
    } catch (error: any) {
      console.error('Error initiating payment update:', error);
      toast.error(error.message || 'Failed to initialize payment update');
      setShowUpdatePayment(false);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handlePaymentUpdateSuccess = async (setupIntentId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Please log in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/confirm-payment-method-update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Stripe-Mode': stripeMode,
          },
          body: JSON.stringify({ setupIntentId }),
        }
      );

      if (!response.ok) {
        // Fallback: If the API call fails, we still want to show success if the setup intent succeeded
        // The webhook or next polling will catch the update
        console.warn('Payment update confirmation API call failed, but Stripe setup succeeded');
      }

      toast.success('Payment method updated successfully!');
      setShowUpdatePayment(false);
      setUpdatePaymentClientSecret(null);
      setUpdatePaymentSetupIntentId(null);
      
      // Refresh payment method
      await fetchPaymentMethod();
    } catch (error: any) {
      console.error('Error confirming payment update:', error);
      toast.error(error.message || 'Failed to update payment method');
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }

    try {
      setCancellingSubscription(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Please log in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      const data = await response.json();
      toast.success('Subscription cancelled. You will have access until ' + new Date(data.currentPeriodEnd).toLocaleDateString());
      
      // Refresh subscription status
      await fetchSubscription();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleRefreshSubscription = async () => {
    try {
      setIsRefreshing(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Please log in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/refresh-subscription`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh subscription');
      }

      const data = await response.json();
      toast.success('Subscription refreshed successfully!');
      console.log('🔄 Refreshed subscription data:', data);
      
      // Refresh all data
      await fetchSubscription();
      await fetchPaymentMethod();
    } catch (error: any) {
      console.error('Error refreshing subscription:', error);
      toast.error(error.message || 'Failed to refresh subscription');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!subscription) {
    return <PremiumLoader />;
  }

  const isFreePlan = !subscription || subscription.plan === 'free';
  const isActive = subscription?.subscriptionStatus === 'active' || subscription?.subscriptionStatus === 'trialing';
  const currentPlan = subscription?.plan || 'free';
  const interval = subscription?.interval || 'monthly';
  const planInfo = PLAN_DETAILS[currentPlan] || PLAN_DETAILS.core;
  const currentPrice = interval === 'yearly' ? planInfo.yearlyPrice : planInfo.monthlyPrice;

  return (
    <div className="h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div 
        className="border-b px-4 md:px-12 py-6 md:py-8"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        <h1 className="text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--foreground)' }}>
          Billing & Subscription
        </h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
          Manage your subscription and payment information
        </p>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 py-6 md:py-8 max-w-6xl">
        {/* Free Plan Notice */}
        {isFreePlan && (
          <div 
            className="rounded-xl md:rounded-2xl border p-4 md:p-8 mb-6 md:mb-8"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <AlertCircle size={20} className="md:w-6 md:h-6" style={{ color: '#3b82f6', flexShrink: 0 }} />
              <div>
                <h2 className="text-base md:text-lg mb-2" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                  You're on the Free Plan
                </h2>
                <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
                  Upgrade to unlock premium features like Reports & Exports, advanced analytics, and more.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-sm transition-all w-full md:w-auto hover:brightness-110"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontWeight: 500
                  }}
                >
                  View Plans & Pricing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan (only show if not free) */}
        {!isFreePlan && (
          <>
            {/* Cancellation Warning Banner */}
            {subscription?.subscriptionCancelAtPeriodEnd && (
              <div 
                className="rounded-xl md:rounded-2xl border p-4 md:p-6 mb-6"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <AlertCircle size={18} className="md:w-5 md:h-5" style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="mb-1 text-sm md:text-base" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                      Subscription Cancelled
                    </h3>
                    <p className="text-xs md:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      Your subscription will end on{' '}
                      <span style={{ fontWeight: 600 }}>
                        {subscription?.currentPeriodEnd 
                          ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : 'N/A'
                        }
                      </span>
                      . You will have access to all features until then.
                    </p>
                  </div>
                </div>
              </div>
            )}

          <div 
            className="rounded-xl md:rounded-2xl border p-4 md:p-8 mb-6 md:mb-8"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg md:text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                  Current Plan
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
                    You are currently on the {planInfo.name} plan
                  </p>
                  {interval === 'yearly' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Yearly
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm"
                  style={{ 
                    backgroundColor: isActive ? 'var(--status-compliant-bg)' : 'rgba(148, 163, 184, 0.1)',
                    color: isActive ? 'var(--status-compliant)' : '#64748b',
                    border: isActive ? '1px solid var(--status-compliant-border)' : '1px solid rgba(148, 163, 184, 0.2)',
                    fontWeight: 600
                  }}
                >
                  {isActive ? (subscription?.subscriptionStatus === 'trialing' ? 'Trial Active' : 'Active') : 'Inactive'}
                </div>
                <button
                  onClick={handleRefreshSubscription}
                  className="p-2 rounded-lg border transition-all disabled:opacity-50"
                  style={{ 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground-muted)'
                  }}
                  title="Sync subscription from Stripe"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <div className="text-xs md:text-sm mb-2" style={{ color: 'var(--foreground-subtle)' }}>
                  Plan
                </div>
                <div className="text-xl md:text-2xl" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                  {planInfo.name}
                </div>
              </div>
              <div>
                <div className="text-xs md:text-sm mb-2" style={{ color: 'var(--foreground-subtle)' }}>
                  {interval === 'yearly' ? 'Yearly cost' : 'Monthly cost'}
                </div>
                <div className="text-xl md:text-2xl" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                  ${currentPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs md:text-sm mb-2" style={{ color: 'var(--foreground-subtle)' }}>
                  Next billing date
                </div>
                <div className="text-xl md:text-2xl" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                  {subscription?.currentPeriodEnd 
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : 'N/A'
                  }
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-sm md:text-base" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                Plan includes:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {planInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-compliant)' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'var(--foreground)' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Subscription Button */}
            {!subscription?.subscriptionCancelAtPeriodEnd && (
              <div className="pt-4 md:pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm transition-all inline-flex items-center gap-2 disabled:opacity-50 w-full md:w-auto justify-center md:justify-start"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontWeight: 500
                  }}
                >
                  {cancellingSubscription ? 'Cancelling...' : 'Cancel subscription'}
                </button>
                <p className="text-xs mt-2" style={{ color: 'var(--foreground-subtle)' }}>
                  You'll have access until the end of your current billing period
                </p>
              </div>
            )}
          </div>
          </>
        )}

        {/* Upgrade Option */}
        <div 
          className="rounded-xl md:rounded-2xl border p-4 md:p-8 mb-6 md:mb-8"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                Need more?
              </h2>
              <p className="mb-4 md:mb-6 text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
                Upgrade to Enterprise for unlimited vendors and advanced features
              </p>
              
              <div className="space-y-2 md:space-y-3 mb-6">
                {[
                  'Unlimited vendors',
                  'Multiple locations / entities',
                  'Custom compliance rules',
                  'Internal escalations',
                  'Dedicated onboarding',
                  'Priority support',
                  'Security & legal review'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'var(--foreground)' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-sm transition-all inline-flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 500
                }}
                onClick={() => setIsContactSalesOpen(true)}
              >
                Contact sales for Enterprise
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="md:ml-8 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className="flex-1 md:flex-none">
                  <div className="text-xs md:text-sm mb-1 md:mb-2" style={{ color: 'var(--foreground-subtle)' }}>
                    Starting at
                  </div>
                  <div className="text-2xl md:text-3xl mb-0 md:mb-1" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                    $1,200
                  </div>
                </div>
                <div className="text-xs md:text-sm self-end md:self-start" style={{ color: 'var(--foreground-muted)' }}>
                  per month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div 
          className="rounded-xl md:rounded-2xl border p-4 md:p-8 mb-6 md:mb-8"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg md:text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                Payment Method
              </h2>
              <p className="text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
                Manage your payment information
              </p>
            </div>
            <button 
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg border text-sm transition-all w-full md:w-auto"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
              onClick={handleUpdatePaymentClick}
            >
              Update payment
            </button>
          </div>

          <div 
            className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--panel)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            {paymentMethod ? (
              <>
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--foreground-muted)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1 text-sm md:text-base truncate" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                    {paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)} ending in {paymentMethod.last4}
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 text-center py-4">
                <p className="text-xs md:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No payment method on file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        {!isFreePlan && invoices.length > 0 && (
          <div 
            className="rounded-xl md:rounded-2xl border p-4 md:p-8"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 className="text-lg md:text-xl mb-4 md:mb-6" style={{ color: 'var(--foreground)' }}>
              Payment History
            </h2>
            
            <div className="space-y-3">
              {invoices.map((invoice: any, index: number) => (
                <div 
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 md:p-5 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--panel)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex-1">
                    <div className="mb-1 text-sm md:text-base" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                      {invoice.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {invoice.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-base md:text-lg" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                      {invoice.amount}
                    </div>
                    
                    <div 
                      className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ 
                        backgroundColor: invoice.status === 'Paid' ? 'var(--status-compliant-bg)' : 'rgba(148, 163, 184, 0.1)',
                        color: invoice.status === 'Paid' ? 'var(--status-compliant)' : '#64748b',
                        border: invoice.status === 'Paid' ? '1px solid var(--status-compliant-border)' : '1px solid rgba(148, 163, 184, 0.2)',
                        fontWeight: 600
                      }}
                    >
                      {invoice.status}
                    </div>
                    
                    <button 
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Download Invoice"
                      onClick={() => window.open(invoice.pdf, '_blank')}
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onPaymentSuccess={handlePaymentSuccess}
        feature="premium features"
      />
      
      {showUpdatePayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button 
              onClick={() => {
                setShowUpdatePayment(false);
                setUpdatePaymentClientSecret(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <Zap className="w-5 h-5 rotate-45" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">Update Payment Method</h2>
            
            {isUpdatingPayment ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A4F6A] mb-4" />
                <p className="text-slate-500">Initializing secure payment...</p>
              </div>
            ) : updatePaymentClientSecret ? (
              <div className="mb-4">
                <StripePaymentForm 
                  clientSecret={updatePaymentClientSecret}
                  onSuccess={() => handlePaymentUpdateSuccess(updatePaymentSetupIntentId!)}
                  onCancel={() => {
                    setShowUpdatePayment(false);
                    setUpdatePaymentClientSecret(null);
                  }}
                  buttonText="Update Payment Method"
                />
              </div>
            ) : (
              <div className="text-center py-4 text-red-500">
                Failed to load payment form. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
      
      <ContactSalesModal
        isOpen={isContactSalesOpen}
        onClose={() => setIsContactSalesOpen(false)}
      />
    </div>
  );
}
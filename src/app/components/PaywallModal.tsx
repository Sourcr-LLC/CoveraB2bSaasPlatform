import { X, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { PremiumCheck } from './ui/PremiumCheck';
import { useState, useEffect } from 'react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';
import StripePaymentForm from './StripePaymentForm';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  onPaymentSuccess?: () => void;
}

export default function PaywallModal({ isOpen, onClose, feature = 'this feature', onPaymentSuccess }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeMode, setStripeMode] = useState<'production' | 'test'>(() => {
    return (localStorage.getItem('stripe_mode') as 'production' | 'test') || 'production';
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'core' | 'essentials'>('core');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after a tiny delay to ensure transition works
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Reset state when closing
      setTimeout(() => {
        setClientSecret(null);
        setSelectedPlan('core');
        setBillingCycle('yearly');
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleStartCheckout = async () => {
    console.log('Start checkout clicked', { selectedPlan });
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      console.log('Session data:', { hasSession: !!session, hasToken: !!accessToken });
      
      if (!accessToken) {
        console.error('No access token found');
        toast.error('Please sign in to upgrade');
        return;
      }

      console.log('Calling payment intent endpoint...', { stripeMode, selectedPlan });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
          body: JSON.stringify({
            plan: selectedPlan,
            interval: billingCycle,
          }),
        }
      );

      console.log('Response status:', response.status);

      if (response.ok) {
        const { clientSecret } = await response.json();
        console.log('Got client secret:', !!clientSecret);
        setClientSecret(clientSecret);
      } else {
        const error = await response.json();
        console.error('Payment intent error:', error);
        toast.error(error.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh the subscription status
    window.location.reload();
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handleCancel = () => {
    setClientSecret(null);
  };

  const planDetails = {
    essentials: {
      name: 'Essentials',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      vendors: 50,
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
      name: 'Core',
      monthlyPrice: 399,
      yearlyPrice: 3990,
      vendors: 150,
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
    }
  };

  const currentPlan = planDetails[selectedPlan];
  const price = billingCycle === 'yearly' ? Math.round(currentPlan.yearlyPrice / 12) : currentPlan.monthlyPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: isAnimating ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 200ms ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          opacity: isAnimating ? 1 : 0,
          transition: 'all 200ms ease-out',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-start justify-between p-8 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(58, 79, 106, 0.08)',
                border: '1px solid rgba(58, 79, 106, 0.15)'
              }}
            >
              <Shield size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-2xl mb-1" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Upgrade Plan
              </h2>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Unlock {feature} and more premium features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: 'var(--panel)',
              color: 'var(--foreground-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 flex-1">
          {/* Feature being blocked */}
          <div
            className="rounded-xl border p-4 mb-6"
            style={{
              backgroundColor: 'var(--panel)',
              borderColor: 'var(--border)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              <strong style={{ color: 'var(--foreground)' }}>{feature}</strong> is a premium feature available on paid plans.
            </p>
          </div>

          {!clientSecret && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className={`text-sm cursor-pointer transition-colors ${billingCycle === 'monthly' ? 'font-semibold text-foreground' : 'text-foreground-muted'}`} onClick={() => setBillingCycle('monthly')}>Monthly</span>
                <Switch 
                  checked={billingCycle === 'yearly'}
                  onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span className={`text-sm cursor-pointer transition-colors ${billingCycle === 'yearly' ? 'font-semibold text-foreground' : 'text-foreground-muted'}`} onClick={() => setBillingCycle('yearly')}>
                  Yearly <span className="text-emerald-600 text-xs ml-1 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">Save 2 months</span>
                </span>
              </div>

              <Tabs defaultValue="core" value={selectedPlan} onValueChange={(val) => setSelectedPlan(val as 'core' | 'essentials')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="essentials">Essentials</TabsTrigger>
                  <TabsTrigger value="core">Core</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Pricing with Trial Info */}
          <div
            className="rounded-xl border p-6 mb-6 transition-all duration-300"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex justify-between items-start mb-4">
              {/* Trial Badge */}
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontWeight: 500,
                }}
              >
                <PremiumCheck className="w-4 h-4 bg-transparent mt-0" />
                7-Day Free Trial • $0 charged now
              </div>
              
              {selectedPlan === 'core' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Most Popular
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                ${price.toLocaleString()}
              </span>
              <span className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
                / month after trial
              </span>
            </div>
            {billingCycle === 'yearly' && (
               <p className="text-sm text-muted-foreground mb-1">
                 Billed ${currentPlan.yearlyPrice.toLocaleString()} yearly
               </p>
            )}
            {billingCycle === 'yearly' && (
               <p className="text-sm text-emerald-600 font-medium mb-1">
                 You save ${((currentPlan.monthlyPrice * 12) - currentPlan.yearlyPrice).toLocaleString()} per year
               </p>
            )}
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              {selectedPlan === 'core' 
                ? 'Perfect for growing companies managing compliance at scale.' 
                : 'Great for smaller teams just getting started with vendor compliance.'}
              {' '}We'll verify your card but won't charge until your trial ends. Cancel anytime.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {currentPlan.features.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <PremiumCheck />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {clientSecret ? (
            <div className="w-full pb-8">
              <div className="mb-4 text-sm text-center text-muted-foreground">
                Setting up <strong>{currentPlan.name} Plan</strong> trial
                <button 
                  onClick={() => setClientSecret(null)}
                  className="ml-2 text-primary hover:underline"
                >
                  Change Plan
                </button>
              </div>
              <StripePaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
                buttonText={`Start ${currentPlan.name} Trial`}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 pb-8">
              <button
                onClick={handleStartCheckout}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 500,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  `Start ${currentPlan.name} Trial`
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg transition-all text-sm"
                style={{
                  backgroundColor: 'var(--panel)',
                  color: 'var(--foreground-muted)',
                  fontWeight: 500,
                }}
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
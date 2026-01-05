import { X, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';
import StripePaymentForm from './StripePaymentForm';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after a tiny delay to ensure transition works
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartCheckout = async () => {
    console.log('Start checkout clicked');
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

      console.log('Calling payment intent endpoint...', { stripeMode });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92f9f116/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'X-Stripe-Mode': stripeMode,
          },
          body: JSON.stringify({
            plan: 'core',
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
                Upgrade to Core Plan
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
              <strong style={{ color: 'var(--foreground)' }}>{feature}</strong> is a premium feature available on the Core Plan.
            </p>
          </div>

          {/* Pricing with Trial Info */}
          <div
            className="rounded-xl border p-6 mb-6"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Trial Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-sm"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontWeight: 500,
              }}
            >
              <CheckCircle2 size={16} />
              7-Day Free Trial • $0 charged now
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                $399
              </span>
              <span className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
                / month after trial
              </span>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              We'll verify your card but won't charge until your trial ends. Cancel anytime.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {[
                'Track up to 150 vendors',
                'Unlimited compliance tracking',
                'Real-time expiry monitoring',
                'Automated alerts & notifications',
                'Certificate of Insurance (COI) management',
                'Activity logs & audit trails',
                'PDF, CSV & Excel exports',
                'Priority email support',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}
                  />
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
              <StripePaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
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
                  'Start 7-Day Free Trial'
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
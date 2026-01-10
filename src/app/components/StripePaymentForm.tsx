import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';
import { toast } from 'sonner';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
  buttonText?: string;
}

function CheckoutForm({ onSuccess, onCancel, buttonText }: { onSuccess: () => void; onCancel: () => void; buttonText?: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // For SetupIntent (trial with pre-authorization), use confirmSetup instead of confirmPayment
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/#/billing`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Setup error:', error);
        toast.error(error.message || 'Payment method verification failed');
        setIsProcessing(false);
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        // Setup successful - now verify and activate subscription on backend
        setPaymentComplete(true);
        toast.success('Payment method verified! Starting your 7-day trial...');
        
        // Verify setup intent on backend to activate subscription
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        const stripeMode = localStorage.getItem('stripe_mode') || 'production';
        
        if (accessToken) {
          console.log('Verifying setup intent:', setupIntent.id);
          const verifyResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/verify-payment-intent`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Stripe-Mode': stripeMode,
              },
              body: JSON.stringify({ 
                setupIntentId: setupIntent.id,
                paymentMethodId: setupIntent.payment_method 
              }),
            }
          );

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log('Verification response:', verifyData);
            if (verifyData.success) {
              console.log('Subscription activated successfully with trial');
            } else {
              toast.error(verifyData.error || 'Failed to activate subscription');
            }
          } else {
            const errorData = await verifyResponse.json();
            console.error('Verification failed:', errorData);
            toast.error(errorData.error || 'Failed to activate subscription');
          }
        }
        
        // Wait a moment, then call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('An error occurred during payment method verification');
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="text-center py-8">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--status-compliant-bg)' }}
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--status-compliant)' }} />
        </div>
        <h3 className="text-lg mb-2" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
          Payment Successful!
        </h3>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
          Activating your Core subscription...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            fontWeight: 500,
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            buttonText || 'Start 7-Day Free Trial'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-3 rounded-lg transition-all text-sm"
          style={{
            backgroundColor: 'var(--panel)',
            color: 'var(--foreground-muted)',
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentForm({ clientSecret, onSuccess, onCancel, buttonText }: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const stripeMode = (localStorage.getItem('stripe_mode') as 'production' | 'test') || 'production';
        
        console.log('Fetching Stripe publishable key for mode:', stripeMode);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/stripe/config`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-Stripe-Mode': stripeMode,
            },
          }
        );

        if (response.ok) {
          const { publishableKey } = await response.json();
          console.log('Received publishable key:', publishableKey ? `${publishableKey.substring(0, 20)}...` : 'null');
          setStripePromise(loadStripe(publishableKey));
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch Stripe publishable key:', errorData);
          toast.error('Failed to initialize payment system');
        }
      } catch (error) {
        console.error('Error fetching Stripe config:', error);
        toast.error('Failed to initialize payment system');
      } finally {
        setLoading(false);
      }
    };

    fetchStripeKey();
  }, []);

  if (loading || !stripePromise) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#3A4F6A',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} buttonText={buttonText} />
    </Elements>
  );
}
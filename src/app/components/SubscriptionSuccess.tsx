import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from './SEO';

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <SEO 
        title="Subscription Confirmed | Covera" 
        description="Your subscription has been successfully confirmed. Welcome to Covera." 
        canonicalUrl="https://getcovera.co/subscription-success"
      />

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(58, 79, 106, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(58, 79, 106, 0.5) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(58, 79, 106, 0.4), transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(5, 150, 105, 0.3), transparent 70%)' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 p-8 md:p-10 rounded-2xl border bg-white shadow-xl text-center relative z-10"
        style={{ 
          borderColor: 'rgba(58, 79, 106, 0.1)',
          boxShadow: '0 20px 40px -8px rgba(58, 79, 106, 0.12), 0 8px 16px -4px rgba(58, 79, 106, 0.08)'
        }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-semibold mb-3 text-[#1a1a1a]">
          You're all set!
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your 7-day free trial has been activated. We've sent a confirmation email with your account details.
        </p>

        <div className="space-y-4">
          <Link 
            to="/dashboard"
            className="block w-full py-3.5 px-6 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: '#3A4F6A',
              boxShadow: '0 4px 14px rgba(58, 79, 106, 0.25)'
            }}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="text-xs text-gray-400 mt-6">
            Need help getting started? <a href="mailto:support@covera.ai" className="underline hover:text-[#3A4F6A]">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

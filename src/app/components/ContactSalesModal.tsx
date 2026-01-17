import { useState } from 'react';
import { X, Loader2, Send, Mail } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';
import { toast } from 'sonner';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSalesModal({ isOpen, onClose }: ContactSalesModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSending(true);
      
      // Check if user is logged in (optional)
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token || publicAnonKey;

      console.log('Submitting contact sales form:', { name, email, company, messageLength: message.length });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contact-sales`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name,
            email,
            company,
            message 
          }),
        }
      );

      console.log('Contact sales response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Contact sales error response:', errorData);
        throw new Error(errorData.error || `Failed to send inquiry (${response.status})`);
      }

      const data = await response.json();
      console.log('Contact sales success:', data);
      toast.success(data.message || 'Your inquiry has been sent to our sales team!');
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      toast.error(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl border p-6 md:p-8 max-w-lg w-full mx-4"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(58, 79, 106, 0.1)'
              }}
            >
              <Mail className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-xl" style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                Contact Sales
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                Interested in Enterprise?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ 
              color: 'var(--foreground-muted)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label 
                htmlFor="name"
                className="block text-sm mb-2"
                style={{ color: 'var(--foreground)', fontWeight: 500 }}
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="email"
                className="block text-sm mb-2"
                style={{ color: 'var(--foreground)', fontWeight: 500 }}
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="company"
                className="block text-sm mb-2"
                style={{ color: 'var(--foreground)', fontWeight: 500 }}
              >
                Company name
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company"
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="message"
                className="block text-sm mb-2"
                style={{ color: 'var(--foreground)', fontWeight: 500 }}
              >
                Tell us about your needs
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="E.g., number of vendors, locations, specific requirements..."
                required
                className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>

          <div 
            className="rounded-lg p-4 mb-6"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Our sales team will reach out within 1 business day to discuss pricing and custom solutions.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="flex-1 px-6 py-3 rounded-lg border text-sm transition-all disabled:opacity-50"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="flex-1 px-6 py-3 rounded-lg text-sm transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 500
              }}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
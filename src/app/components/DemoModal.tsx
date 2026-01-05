import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    vendors: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting demo request with data:', formData);
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/demo-request`;
      console.log('📍 Request URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit demo request');
      }

      const successData = await response.json();
      console.log('✅ Success response:', successData);

      toast.success('Demo request received! We\'ll contact you within 24 hours.');
      
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        vendors: '',
        message: ''
      });
      onClose();
    } catch (error) {
      console.error('💥 Demo request error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format phone number for US format
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length <= 3) {
        formatted = cleaned;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else if (cleaned.length <= 10) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--card)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-lg transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(100, 116, 139, 0.1)',
            color: 'var(--foreground-muted)'
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="mb-2 text-xl md:text-2xl" style={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Schedule a demo
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
            See how Covera can transform your compliance operations. We'll reach out within 24 hours to schedule a personalized demo.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              Full name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              placeholder="John Smith"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              Work email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              placeholder="john@company.com"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              Company name *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              placeholder="Acme Corp"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              placeholder="(555) 000-0000"
              maxLength={14}
            />
          </div>

          {/* Number of vendors */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              How many vendors do you manage?
            </label>
            <select
              name="vendors"
              value={formData.vendors}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <option value="">Select range</option>
              <option value="1-50">1-50 vendors</option>
              <option value="51-150">51-150 vendors</option>
              <option value="151-500">151-500 vendors</option>
              <option value="500+">500+ vendors</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>
              Tell us about your compliance needs (optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg text-sm border transition-all resize-none"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              placeholder="Tell us what you're looking for..."
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-lg text-sm transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontWeight: 500
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Request demo'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--foreground-subtle)', fontWeight: 400 }}>
            By submitting, you agree to our privacy policy. We'll contact you within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
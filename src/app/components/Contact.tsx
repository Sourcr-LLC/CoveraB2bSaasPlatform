import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, ArrowRight } from 'lucide-react';
import LandingNav from './LandingNav';
import Footer from './Footer';
import SEO from './SEO';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contact`;
      
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        company: formData.company,
        message: formData.message
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to submit message');
      }

      toast.success('Message sent! We\'ll be in touch shortly.');
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] selection:bg-[#3A4F6A] selection:text-white">
      <SEO 
        title="Contact Covera | Vendor Compliance Support"
        description="Get in touch with the Covera team for sales, support, or general inquiries about our vendor compliance platform."
      />
      <LandingNav />

      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-[1.1]">
            Get in touch
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We're here to help you automate your vendor compliance.
          </p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Contact Sales</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  Interested in learning how Covera can help your organization? Our sales team is ready to answer your questions.
                </p>
                <div className="flex items-center gap-3 text-[#3A4F6A] font-medium">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:sales@covera.co" className="hover:underline">sales@covera.co</a>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Customer Support</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  Already a customer? Our support team is available to assist you with any technical issues or account questions.
                </p>
                <div className="flex items-center gap-3 text-[#3A4F6A] font-medium">
                  <MessageSquare className="w-5 h-5" />
                  <a href="mailto:support@covera.co" className="hover:underline">support@covera.co</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-[#3A4F6A]/5">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3A4F6A] focus:ring-1 focus:ring-[#3A4F6A] outline-none" 
                      placeholder="Jane" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3A4F6A] focus:ring-1 focus:ring-[#3A4F6A] outline-none" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-slate-700">Company Name</label>
                  <input 
                    type="text" 
                    id="company" 
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3A4F6A] focus:ring-1 focus:ring-[#3A4F6A] outline-none" 
                    placeholder="Acme Corp" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3A4F6A] focus:ring-1 focus:ring-[#3A4F6A] outline-none" 
                    placeholder="jane@company.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3A4F6A] focus:ring-1 focus:ring-[#3A4F6A] outline-none" 
                    placeholder="How can we help?" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#3A4F6A] text-white font-medium hover:bg-[#2c3e53] shadow-lg shadow-[#3A4F6A]/20 hover:shadow-[#3A4F6A]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
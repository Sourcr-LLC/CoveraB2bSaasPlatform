import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Upload, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { vendorApi } from '../lib/api';
import { useSubscription } from '../hooks/useSubscription';

export default function AddVendor() {
  const navigate = useNavigate();
  const { getMaxVendors, isPremium, loading: subscriptionLoading } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [vendorCount, setVendorCount] = useState(0);
  const [error, setError] = useState('');
  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [isAnalyzingCOI, setIsAnalyzingCOI] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    vendorType: 'contractor',
    site: '',
    notes: '',
    insuranceExpiry: '',
    lastContact: new Date().toISOString()
  });

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const { vendors } = await vendorApi.getAll();
        setVendorCount(vendors.length);
      } catch (err) {
        console.error('Failed to fetch vendor count:', err);
      } finally {
        setCheckingLimit(false);
      }
    };
    
    checkLimit();
  }, []);

  const maxVendors = getMaxVendors();
  const isLimitReached = !checkingLimit && !subscriptionLoading && vendorCount >= maxVendors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkingLimit || subscriptionLoading || isLimitReached) return;
    
    setError('');
    setIsLoading(true);

    try {
      // Determine status based on insurance data
      let status = 'non-compliant'; // Default to non-compliant if no insurance
      
      if (formData.insuranceExpiry) {
        const expiryDate = new Date(formData.insuranceExpiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          status = 'non-compliant'; // Expired
        } else if (daysUntilExpiry <= 30) {
          status = 'at-risk'; // Expiring within 30 days
        } else {
          status = 'compliant'; // Valid and not expiring soon
        }
      }
      
      await vendorApi.create({ ...formData, status });
      navigate('/vendors');
    } catch (err: any) {
      console.error('Failed to create vendor:', err);
      setError(err.message || 'Failed to create vendor. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    let formatted = '';

    if (input.length <= 10) {
      if (input.length > 0) {
        formatted = '(' + input.substring(0, 3);
      }
      if (input.length >= 4) {
        formatted += ') ' + input.substring(3, 6);
      }
      if (input.length >= 7) {
        formatted += '-' + input.substring(6, 10);
      }

      setFormData({
        ...formData,
        phone: formatted
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoiFile(file);
      setIsAnalyzingCOI(true);
      // Simulate COI analysis
      setTimeout(() => {
        setIsAnalyzingCOI(false);
        // Update insurance expiry date based on analysis
        setFormData({
          ...formData,
          insuranceExpiry: '2024-12-31' // Example expiry date
        });
      }, 2000);
    }
  };

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
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
          <Link to="/vendors">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--foreground-muted)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--foreground)' }}>
              Add New Vendor
            </h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
              Complete vendor information for compliance tracking
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 md:px-12 py-6 md:py-8 max-w-4xl">
        {isLimitReached && (
          <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Vendor Limit Reached</h3>
              <p className="text-sm">
                You have reached the limit of {maxVendors} vendors for your current plan. 
                Please <Link to="/billing" className="underline font-medium hover:text-amber-900">upgrade your plan</Link> to add more vendors.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {error && (
            <div 
              className="rounded-xl border p-4 mb-6"
              style={{ 
                backgroundColor: 'var(--status-high-risk-bg)',
                borderColor: 'var(--status-high-risk-border)',
                color: 'var(--status-high-risk)'
              }}
            >
              {error}
            </div>
          )}
          
          <div 
            className="rounded-2xl border p-4 md:p-8 mb-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 className="text-lg md:text-xl mb-4 md:mb-6" style={{ color: 'var(--foreground)' }}>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="vendorName" className="block mb-2 text-sm">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  id="vendorName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Enter vendor name"
                />
              </div>

              <div>
                <label htmlFor="vendorType" className="block mb-2 text-sm">
                  Vendor Type *
                </label>
                <select
                  id="vendorType"
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="contractor">Contractor</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="supplier">Supplier</option>
                  <option value="service-provider">Service Provider</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactName" className="block mb-2 text-sm">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Primary contact name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="contact@vendor.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="site" className="block mb-2 text-sm">
                  Primary Site
                </label>
                <input
                  type="text"
                  id="site"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="e.g., Downtown Plaza"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="address" className="block mb-2 text-sm">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Street address"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="notes" className="block mb-2 text-sm">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--input-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Additional notes about this vendor..."
                />
              </div>
            </div>
          </div>

          {/* Insurance Documents Section */}
          <div 
            className="rounded-2xl border p-4 md:p-8 mb-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 className="text-lg md:text-xl mb-4 md:mb-6" style={{ color: 'var(--foreground)' }}>
              Insurance Documents
            </h2>
            
            <div 
              className="border-2 border-dashed rounded-xl p-6 md:p-12 text-center"
              style={{ borderColor: coiFile ? 'var(--status-compliant)' : 'var(--border)' }}
            >
              <input
                type="file"
                id="coi-file-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {isAnalyzingCOI ? (
                <div>
                  <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" style={{ color: 'var(--primary)' }} />
                  <p className="mb-2" style={{ color: 'var(--foreground)' }}>
                    Analyzing COI with AI...
                  </p>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    Extracting insurance details automatically
                  </p>
                </div>
              ) : coiFile ? (
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mb-2" style={{ color: 'var(--foreground)' }}>
                    {coiFile.name}
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    File uploaded • Click to change
                  </p>
                  <label 
                    htmlFor="coi-file-input"
                    className="px-5 py-2.5 rounded-lg border transition-colors cursor-pointer inline-block"
                    style={{
                      backgroundColor: 'var(--panel)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    Change File
                  </label>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--foreground-muted)' }} />
                  <p className="mb-2" style={{ color: 'var(--foreground)' }}>
                    Upload Certificate of Insurance
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Drag and drop or click to browse • AI will extract insurance details
                  </p>
                  <label 
                    htmlFor="coi-file-input"
                    className="px-5 py-2.5 rounded-lg border transition-colors cursor-pointer inline-block"
                    style={{
                      backgroundColor: 'var(--panel)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    Select Files
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
            <Link to="/vendors" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full px-6 py-3 rounded-xl border transition-colors flex items-center justify-center"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading || isLimitReached || checkingLimit || subscriptionLoading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl transition-colors flex items-center justify-center ${
                (isLoading || isLimitReached || checkingLimit || subscriptionLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
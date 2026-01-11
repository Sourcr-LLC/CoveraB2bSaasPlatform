import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, Shield, Building2, User, Phone, Mail, MapPin, Loader2, FileCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3`;

export default function VendorPortal() {
  const { token } = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [organizationName, setOrganizationName] = useState('Covera');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Upload states
  const [isUploadingCOI, setIsUploadingCOI] = useState(false);
  const [isUploadingW9, setIsUploadingW9] = useState(false);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        // Check if this is a demo token
        if (token?.startsWith('demo-'))  {
          // Create mock vendor data for demo
          const mockVendor = {
            id: 'demo-vendor-1',
            name: 'Quick Silver Towing Inc.',
            email: 'contact@quicksilvertowing.com',
            phone: '(555) 123-4567',
            address: '456 Road Ave, Los Angeles, CA 90025',
            contactName: 'John Smith',
            vendorType: 'Towing Service',
            status: 'non-compliant',
            insuranceExpiry: '2025-12-31',
            insurancePolicies: [],
            missingDocs: ['COI', 'W9'],
            documents: [],
            w9Uploaded: false
          };
          
          setVendor(mockVendor);
          setOrganizationName('Covera Demo Client');
          setFormData({
            name: mockVendor.name,
            contactName: mockVendor.contactName || '',
            email: mockVendor.email,
            phone: mockVendor.phone,
            address: mockVendor.address || ''
          });
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/vendor-portal/${token}`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('Link expired or invalid');
          if (response.status === 401) throw new Error('Link expired');
          throw new Error('Failed to load portal');
        }
        
        const data = await response.json();
        
        setVendor(data.vendor);
        setOrganizationName(data.organizationName || 'Covera');
        
        setFormData({
          name: data.vendor.name || '',
          contactName: data.vendor.contactName || '',
          email: data.vendor.email || '',
          phone: data.vendor.phone || '',
          address: data.vendor.address || ''
        });
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadVendorData();
    }
  }, [token]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Handle demo mode
      if (token?.startsWith('demo-')) {
        setTimeout(() => {
          toast.success('Information updated successfully (Demo Mode)');
          setVendor((prev: any) => ({ ...prev, ...formData }));
          setIsSaving(false);
        }, 1000);
        return;
      }
      
      const response = await fetch(`${API_URL}/vendor-portal/${token}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to update information');
      
      const data = await response.json();
      setVendor(data.vendor); // Update local state
      toast.success('Information updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'coi' | 'w9') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }

    const endpoint = type === 'coi' ? 'upload-coi' : 'upload-w9';
    const setIsUploading = type === 'coi' ? setIsUploadingCOI : setIsUploadingW9;

    setIsUploading(true);
    
    // Handle demo mode
    if (token?.startsWith('demo-')) {
      setTimeout(() => {
        toast.success(`${type === 'coi' ? 'Certificate of Insurance' : 'W9 Form'} uploaded successfully! (Demo Mode)`);
        if (type === 'w9') {
          setVendor((prev: any) => ({ ...prev, w9Uploaded: true }));
        }
        setIsUploading(false);
        e.target.value = '';
      }, 2000);
      return;
    }
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/vendor-portal/${token}/${endpoint}`, {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      if (type === 'coi' && data.extractedData) {
        toast.success(`COI uploaded! ${data.extractedData.policies?.length || 0} policies detected.`);
        // Update vendor with new data from server
        if (data.vendor) {
          setVendor(data.vendor);
        }
      } else if (type === 'w9') {
        toast.success('W9 uploaded successfully!');
        setVendor((prev: any) => ({ ...prev, w9Uploaded: true }));
      }
      
    } catch (err: any) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'text-[var(--status-compliant)] bg-[var(--status-compliant-bg)] border-[var(--status-compliant-border)]';
      case 'at-risk': return 'text-[var(--status-at-risk)] bg-[var(--status-at-risk-bg)] border-[var(--status-at-risk-border)]';
      case 'non-compliant': return 'text-[var(--status-non-compliant)] bg-[var(--status-non-compliant-bg)] border-[var(--status-non-compliant-border)]';
      default: return 'text-[var(--foreground-muted)] bg-gray-50 border-[var(--border)]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="max-w-md w-full bg-[var(--card)] rounded-2xl shadow-lg p-8 text-center border border-[var(--border)]">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[var(--status-non-compliant)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)] mb-2">Access Denied</h1>
          <p className="text-[var(--foreground-muted)] mb-6">{error}</p>
          <p className="text-sm text-[var(--foreground-subtle)]">Please contact {organizationName} if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Covera Logo */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C18.1217 24 20.0566 23.1571 21.5 21.7929" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="3" fill="white"/>
            </svg>
            <div>
              <div className="text-xs text-gray-500 font-medium">Vendor Portal</div>
              <div className="text-sm font-semibold text-gray-900">{organizationName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Secure Connection</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {vendor.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Please review your information and ensure your compliance documents are up to date.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <FileCheck className="w-5 h-5 text-gray-500" />
            Compliance Status
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Overall Status - Compact Badge */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2">Overall Status</div>
              <div className="flex items-center gap-2">
                {vendor.status === 'compliant' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Compliant
                  </span>
                )}
                {vendor.status === 'at-risk' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Clock className="w-4 h-4" />
                    At Risk
                  </span>
                )}
                {vendor.status === 'non-compliant' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    Non Compliant
                  </span>
                )}
              </div>
            </div>

            {/* Insurance Expiry */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2">Insurance Expiry</div>
              <div className="text-sm font-semibold text-gray-900">
                {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not on file'}
              </div>
            </div>
            
            {/* W9 Status */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2">W9 Status</div>
              <div className="flex items-center gap-2">
                {vendor.w9Uploaded ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    On File
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    Missing
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2 text-gray-900">
              <Upload className="w-5 h-5 text-gray-500" />
              Upload Documents
            </h2>
            
            <div className="space-y-5">
              {/* COI Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Certificate of Insurance (COI)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    Drag & drop or click to upload PDF/Image
                  </p>
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
                    {isUploadingCOI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Select COI File'
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'coi')}
                      disabled={isUploadingCOI}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Our system will automatically scan your certificate for coverage limits and dates.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* W9 Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  W9 Form
                </label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vendor.w9Uploaded ? 'W9_Form.pdf' : 'No W9 uploaded'}
                    </span>
                  </div>
                  <label className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                    {isUploadingW9 ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'w9')}
                      disabled={isUploadingW9}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2 text-gray-900">
              <User className="w-5 h-5 text-gray-500" />
              Vendor Information
            </h2>
            
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="Quick Silver Towing Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Person
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      placeholder="contact@qstow.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                    placeholder="456 Road Ave, Los Angeles, CA 90025"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
          Powered by Covera • {new Date().getFullYear()}
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, Shield, Building2, User, Phone, Mail, MapPin, Loader2, FileCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

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
        
        const response = await fetch(`${API_URL}/vendor-portal/${token}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
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
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
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
            <svg className="w-24 h-5" viewBox="0 0 800 168" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M159.604 34.5625L146.615 44.2488C139.571 35.0027 131.077 28.0132 121.134 23.2801C111.191 18.547 100.275 16.1805 88.3874 16.1805C75.3256 16.1805 63.2544 19.2992 52.1739 25.5366C41.0934 31.774 32.4894 40.1578 26.3621 50.6879C20.2348 61.2181 17.1712 73.0875 17.1711 86.2961C17.1711 106.182 23.9956 122.198 37.6444 134.342C51.2933 146.487 68.5012 152.559 89.268 152.559C112.163 152.559 131.279 143.607 146.615 125.702L159.604 135.498C151.458 145.845 141.295 153.843 129.114 159.494C116.933 165.144 103.357 167.969 88.3874 167.969C59.7688 167.969 37.2042 158.466 20.6934 139.461C6.89781 123.39 0 105.192 0 84.8652C0 61.0163 8.38378 40.9099 25.1513 24.5459C41.9189 8.18198 62.8875 0 88.0572 0C103.32 0 117.098 3.02697 129.389 9.0809C141.68 15.1348 151.752 23.6287 159.604 34.5625ZM246.67 40.066C265.236 40.066 280.646 46.7804 292.9 60.2091C303.981 72.5371 309.521 87.1033 309.521 103.908C309.521 120.712 303.651 135.406 291.91 147.991C280.169 160.576 265.089 166.868 246.67 166.868C228.178 166.868 213.08 160.576 201.376 147.991C189.672 135.406 183.819 120.712 183.819 103.908C183.819 87.1766 189.36 72.6472 200.44 60.3192C212.695 46.8171 228.105 40.066 246.67 40.066ZM246.67 55.2559C233.829 55.2559 222.785 60.0257 213.539 69.5652C204.293 79.1047 199.67 90.6255 199.67 104.128C199.67 112.86 201.779 121.024 205.999 128.619C210.218 136.214 215.924 142.047 223.115 146.12C230.306 150.193 238.158 152.229 246.67 152.229C255.329 152.229 263.236 150.193 270.391 146.12C277.545 142.047 283.214 136.214 287.397 128.619C291.579 121.024 293.671 112.86 293.671 104.128C293.671 90.6255 289.048 79.1047 279.802 69.5652C270.556 60.0257 259.512 55.2559 246.67 55.2559ZM326.692 46.23H343.203L383.599 134.067L423.665 46.23H440.286L385.03 166.979H382.278L326.692 46.23ZM565.548 123.83L578.536 130.765C574.353 139.204 569.437 145.992 563.786 151.128C558.136 156.265 551.789 160.172 544.744 162.851C537.699 165.529 529.738 166.868 520.859 166.868C501.192 166.868 485.819 160.429 474.739 147.551C463.658 134.673 458.118 120.125 458.118 103.908C458.118 88.5709 462.814 74.922 472.207 62.9609C484.095 47.6977 500.055 40.066 520.088 40.066C540.561 40.066 556.962 47.8811 569.29 63.5113C578.022 74.5184 582.425 88.2407 582.499 104.678H474.078C474.372 118.767 478.848 130.306 487.507 139.296C496.166 148.285 506.843 152.779 519.538 152.779C525.702 152.779 531.682 151.697 537.479 149.532C543.276 147.367 548.211 144.524 552.284 141.002C556.357 137.479 560.778 131.756 565.548 123.83ZM565.548 91.3594C563.493 83.0673 560.484 76.4447 556.522 71.4915C552.559 66.5382 547.312 62.539 540.781 59.4937C534.251 56.4483 527.389 54.9257 520.198 54.9257C508.384 54.9257 498.22 58.7415 489.708 66.3731C483.544 71.9501 478.885 80.2788 475.729 91.3594H565.548ZM605.504 111.502V96.973C606.678 89.7083 608.365 83.8011 610.567 79.2515C615.704 66.63 622.601 57.384 631.26 51.5135C639.919 45.643 647.111 42.7078 652.834 42.7078C657.09 42.7078 661.64 44.102 666.483 46.8905L658.448 59.8789C651.624 57.384 644.854 59.402 638.14 65.9329C631.425 72.4638 626.784 79.5817 624.216 87.2867C622.308 94.1112 621.354 106.916 621.354 125.702V166.538H605.504V111.502ZM736.709 40.066C755.274 40.066 770.684 46.7804 782.939 60.2091C794.24 72.4638 799.89 87.0299 799.89 103.908C800.037 145.588 800.037 166.758 799.89 167.419H783.489V140.011C774.904 156.008 759.31 164.961 736.709 166.868C718.217 166.868 703.119 160.576 691.414 147.991C679.71 135.406 673.858 120.712 673.858 103.908C673.858 87.1766 679.398 72.6472 690.479 60.3192C702.733 46.8171 718.143 40.066 736.709 40.066ZM736.709 55.2559C723.867 55.2559 712.823 60.0257 703.577 69.5652C694.331 79.1047 689.708 90.6255 689.708 104.128C689.708 112.86 692.075 121.262 696.808 129.334C701.541 137.406 709.558 144.23 720.859 149.807C749.184 156.118 769.327 143.24 781.288 111.172C781.948 100.899 780.848 91.0658 777.986 81.6731C775.931 77.417 773.106 73.381 769.51 69.5652C760.484 60.0257 749.551 55.2559 736.709 55.2559Z" fill="#3A4F6A"/>
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
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <FileCheck className="w-5 h-5 text-gray-500" />
            Compliance Status
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Overall Status - Compact Badge */}
            <div className="bg-gray-50 rounded-xl border border-slate-200 p-4">
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
            <div className="bg-gray-50 rounded-xl border border-slate-200 p-4">
              <div className="text-xs text-gray-500 mb-2">Insurance Expiry</div>
              <div className="text-sm font-semibold text-gray-900">
                {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not on file'}
              </div>
            </div>
            
            {/* W9 Status */}
            <div className="bg-gray-50 rounded-xl border border-slate-200 p-4">
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
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100">
                  <FileText className="w-8 h-8 text-[#3A4F6A] mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    Drag & drop or click to upload PDF/Image
                  </p>
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-[#3A4F6A] text-white text-sm font-medium rounded-lg hover:bg-[#2c3e53] cursor-pointer shadow-sm">
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
                  <label className="text-sm text-[#3A4F6A] font-medium cursor-pointer hover:text-[#2c3e53]">
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
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] text-sm"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] text-sm"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] text-sm"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] text-sm"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] text-sm resize-none"
                    placeholder="456 Road Ave, Los Angeles, CA 90025"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#3A4F6A] text-white font-medium py-2.5 rounded-lg hover:bg-[#2c3e53] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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
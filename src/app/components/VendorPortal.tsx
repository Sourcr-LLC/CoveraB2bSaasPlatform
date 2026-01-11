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
            <svg className="w-24 h-5" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="#3A4F6A"/>
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
                  <FileText className="w-8 h-8 text-[#3A4F6A] mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    Drag & drop or click to upload PDF/Image
                  </p>
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-[#3A4F6A] text-white text-sm font-medium rounded-lg hover:bg-[#2c3e53] transition-colors cursor-pointer shadow-sm">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] transition-all text-sm"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] transition-all text-sm"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] transition-all text-sm"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] transition-all text-sm"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3A4F6A]/20 focus:border-[#3A4F6A] transition-all text-sm resize-none"
                    placeholder="456 Road Ave, Los Angeles, CA 90025"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#3A4F6A] text-white font-medium py-2.5 rounded-lg hover:bg-[#2c3e53] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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
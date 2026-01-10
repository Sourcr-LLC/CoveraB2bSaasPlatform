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
    if (token) {
      loadVendorData();
    }
  }, [token]);

  const loadVendorData = async () => {
    try {
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

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/vendor-portal/${token}/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      if (type === 'coi' && data.extractedData) {
        toast.success(`COI uploaded! ${data.extractedData.policies?.length || 0} policies detected.`);
      } else {
        toast.success(`${type === 'coi' ? 'Certificate' : 'W9'} uploaded successfully!`);
      }
      
      // Reload to see new docs
      loadVendorData();
      
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
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[var(--border-subtle)] transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Vendor Portal</div>
              <div className="text-sm md:text-base font-semibold text-[var(--foreground)]">{organizationName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Secure Connection</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            Welcome, {vendor.name}
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Please review your information and ensure your compliance documents are up to date.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--foreground)]">
            <FileCheck className="w-5 h-5 text-[var(--foreground-muted)]" />
            Compliance Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-xl border p-5 ${getStatusColor(vendor.status)}`}>
              <div className="text-sm font-medium opacity-80 mb-1">Overall Status</div>
              <div className="text-2xl font-bold capitalize flex items-center gap-2">
                {vendor.status === 'compliant' && <CheckCircle2 className="w-6 h-6" />}
                {vendor.status === 'at-risk' && <Clock className="w-6 h-6" />}
                {vendor.status === 'non-compliant' && <AlertCircle className="w-6 h-6" />}
                {vendor.status.replace('-', ' ')}
              </div>
            </div>

            <div className="p-5 bg-[var(--panel)] rounded-xl border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--foreground-muted)] mb-1">Insurance Expiry</div>
              <div className="text-xl font-semibold text-[var(--foreground)]">
                {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString() : 'None on file'}
              </div>
            </div>
            
            <div className="p-5 bg-[var(--panel)] rounded-xl border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--foreground-muted)] mb-1">W9 Status</div>
              <div className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                {vendor.w9Uploaded ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[var(--status-compliant)]" />
                    <span className="text-[var(--status-compliant)]">On File</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-[var(--status-at-risk)]" />
                    <span className="text-[var(--status-at-risk)]">Missing</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Upload Section */}
          <div className="space-y-6">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8 shadow-sm h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--foreground)]">
                <Upload className="w-5 h-5 text-[var(--foreground-muted)]" />
                Upload Documents
              </h2>
              
              <div className="space-y-6">
                {/* COI Upload */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Certificate of Insurance (COI)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[var(--primary)] rounded-lg border-2 border-dashed border-[var(--primary)] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" />
                    <div className="p-6 text-center relative z-10">
                      <FileText className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
                      <p className="text-sm text-[var(--foreground-muted)] mb-4">
                        Drag & drop or click to upload PDF/Image
                      </p>
                      <label className="inline-flex items-center justify-center px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors cursor-pointer w-full sm:w-auto shadow-sm">
                        {isUploadingCOI ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Select COI File
                            <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                          </>
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
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">
                    Our system will automatically scan your certificate for coverage limits and dates.
                  </p>
                </div>

                <div className="h-px bg-[var(--border-subtle)]" />

                {/* W9 Upload */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    W9 Form
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[var(--panel)] rounded-lg border border-[var(--border-subtle)] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[var(--foreground-muted)]" />
                        <span className="text-sm text-[var(--foreground-muted)]">
                          {vendor.w9Uploaded ? 'W9_Form.pdf' : 'No W9 uploaded'}
                        </span>
                      </div>
                      <label className="text-sm text-[var(--primary)] font-medium cursor-pointer hover:underline">
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
            </div>
          </div>

          {/* Contact Info Form */}
          <div className="space-y-6">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8 shadow-sm h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--foreground)]">
                <User className="w-5 h-5 text-[var(--foreground-muted)]" />
                Vendor Information
              </h2>
              
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--foreground)]"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--foreground)]"
                      placeholder="Primary Contact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--foreground)]"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--foreground)]"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-[var(--foreground-muted)]" />
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--foreground)]"
                      placeholder="Business Address"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-[var(--primary)] text-white font-medium py-2.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
        </div>
        
        <div className="text-center text-sm text-[var(--foreground-muted)] py-8">
          Powered by Covera • {new Date().getFullYear()}
        </div>
      </main>
    </div>
  );
}
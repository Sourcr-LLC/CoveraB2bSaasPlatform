import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Clock, Upload, FileText, ExternalLink, Send, Copy, X, FileUp, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { vendorApi } from '../lib/api';
import { toast } from 'sonner';
import { isDemoMode, demoVendors } from '../lib/demoData';

// Standard coverage requirements for "AI Verification"
const REQUIRED_LIMITS: Record<string, { occurrence?: number; aggregate?: number }> = {
  generalLiability: { occurrence: 1000000, aggregate: 2000000 }, // $1M / $2M
  workersComp: { occurrence: 500000 }, // $500k
  autoLiability: { occurrence: 1000000 } // $1M
};

// Helper to normalize policy type from AI to our keys
const normalizePolicyType = (type: string) => {
  if (!type) return null;
  const lower = type.toLowerCase();
  if (lower.includes('general liability')) return 'generalLiability';
  if (lower.includes('workers') || lower.includes('work comp')) return 'workersComp';
  if (lower.includes('auto') || lower.includes('vehicle')) return 'autoLiability';
  return null;
};

// Helper function to calculate vendor status client-side
function calculateVendorStatus(insuranceExpiry: string | undefined): string {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return 'non-compliant';
  }
  
  const expiryDate = new Date(insuranceExpiry);
  
  if (isNaN(expiryDate.getTime())) {
    return 'non-compliant';
  }
  
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'non-compliant';
  } else if (daysUntilExpiry <= 30) {
    return 'at-risk';
  } else {
    return 'compliant';
  }
}

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingCOI, setIsUploadingCOI] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadVendorData();
    }
  }, [id]);

  const loadVendorData = async () => {
    try {
      console.log('Loading vendor with ID:', id);
      
      // Check for demo mode
      if (isDemoMode()) {
        const demoVendor = demoVendors.find(v => v.id === id);
        if (demoVendor) {
          // Add some fake activities for demo
          const demoActivities = [
            {
              id: 'act-1',
              action: 'reminder_sent',
              detail: 'Reminder email sent to vendor',
              timestamp: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
            },
            {
              id: 'act-2',
              action: 'document_uploaded',
              detail: 'Certificate of Insurance uploaded',
              timestamp: new Date(Date.now() - 86400000 * 15).toISOString() // 15 days ago
            }
          ];
          
          setVendor(demoVendor);
          setActivities(demoActivities);
          setError(null);
          setIsLoading(false);
          return;
        }
      }

      const [vendorResponse, activitiesResponse] = await Promise.all([
        vendorApi.getOne(id!),
        vendorApi.getActivities(id!).catch(err => {
          console.error('Failed to load activities:', err);
          return { activities: [] };
        })
      ]);
      
      console.log('Vendor response:', vendorResponse);
      
      if (!vendorResponse || !vendorResponse.vendor) {
        console.error('Vendor not found in response');
        setError('Vendor not found');
        setIsLoading(false);
        return;
      }
      
      // Recalculate status
      const vendorWithStatus = {
        ...vendorResponse.vendor,
        status: calculateVendorStatus(vendorResponse.vendor.insuranceExpiry)
      };
      
      setVendor(vendorWithStatus);
      setActivities(activitiesResponse.activities || []);
      setError(null);
    } catch (error: any) {
      if (error.message === 'Vendor not found') {
        // Vendor might have been deleted
        setError('Vendor not found');
      } else {
        console.error('Failed to load vendor data:', error);
        setError(error.message || 'Failed to load vendor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!id) return;
    
    setIsSendingReminder(true);
    
    // Simulate delay for demo mode or real network
    if (isDemoMode()) {
      setTimeout(() => {
        toast.success('Reminder sent successfully! (Demo Mode)');
        setIsSendingReminder(false);
        // Add a mock activity to the list
        const newActivity = {
          id: `act-${Date.now()}`,
          action: 'reminder_sent',
          detail: 'Reminder email sent to vendor',
          timestamp: new Date().toISOString()
        };
        setActivities(prev => [newActivity, ...prev]);
      }, 1500);
      return;
    }

    try {
      console.log('📧 Attempting to send reminder for vendor:', id);
      const result = await vendorApi.sendReminder(id);
      console.log('✅ Reminder sent successfully:', result);
      toast.success('Reminder sent successfully! The vendor will receive an email notification.');
      
      // Reload activities to show the new activity
      const activitiesResponse = await vendorApi.getActivities(id);
      setActivities(activitiesResponse.activities || []);
    } catch (error: any) {
      console.error('❌ Failed to send reminder:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        vendorId: id
      });
      toast.error(error.message || 'Failed to send reminder. Please check console for details.');
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleGenerateUploadLink = async () => {
    if (!id) return;
    
    setIsGeneratingLink(true);
    
    if (isDemoMode()) {
      setTimeout(() => {
        // Use current origin instead of hardcoding covera.co for better demo experience
        const demoToken = `demo-token-${Math.random().toString(36).substring(7)}`;
        setUploadLink(`${window.location.origin}/upload/${demoToken}`);
        setShowLinkModal(true);
        setIsGeneratingLink(false);
        // Add mock activity
        const newActivity = {
          id: `act-${Date.now()}`,
          action: 'upload_link_generated',
          detail: 'Upload link generated',
          timestamp: new Date().toISOString()
        };
        setActivities(prev => [newActivity, ...prev]);
      }, 1000);
      return;
    }

    try {
      const response = await vendorApi.generateUploadLink(id);
      setUploadLink(response.uploadLink);
      setShowLinkModal(true);
      
      // Reload activities to show the new activity
      const activitiesResponse = await vendorApi.getActivities(id);
      setActivities(activitiesResponse.activities || []);
    } catch (error: any) {
      console.error('Failed to generate upload link:', error);
      toast.error(error.message || 'Failed to generate upload link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadLink) {
      navigator.clipboard.writeText(uploadLink);
      toast.success('Upload link copied to clipboard!');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or image file (PNG, JPG)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadCOI = async () => {
    if (!selectedFile || !id) return;
    
    setIsUploadingCOI(true);
    
    if (isDemoMode()) {
      setTimeout(() => {
        toast.success(`Certificate of Insurance "${selectedFile.name}" uploaded successfully! (Demo Mode)`);
        setIsUploadingCOI(false);
        setSelectedFile(null);
        
        // Add mock document locally
        const newDoc = {
          name: selectedFile.name,
          type: selectedFile.type.includes('pdf') ? 'PDF' : 'Image',
          size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
          uploaded: new Date().toISOString(),
          path: `demo-doc-${Date.now()}`
        };
        
        setVendor((prev: any) => ({
          ...prev,
          documents: [...(prev.documents || []), newDoc]
        }));
        
        // Add mock activity
        const newActivity = {
          id: `act-${Date.now()}`,
          action: 'document_uploaded',
          detail: `Certificate of Insurance "${selectedFile.name}" uploaded`,
          timestamp: new Date().toISOString()
        };
        setActivities(prev => [newActivity, ...prev]);
        
      }, 2000);
      return;
    }

    try {
      toast.info('Uploading and analyzing document with AI...');
      const response = await vendorApi.uploadCOI(id, selectedFile);
      
      if (response.extractedData) {
        const policiesCount = response.extractedData.policies?.length || 0;
        toast.success(`COI processed successfully! ${policiesCount} insurance ${policiesCount === 1 ? 'policy' : 'policies'} extracted and updated.`);
      } else {
        toast.success('Certificate of Insurance uploaded successfully!');
      }
      
      setSelectedFile(null);
      
      // Reload vendor data to show the new document and updated policies
      await loadVendorData();
    } catch (error) {
      console.error('Failed to upload COI:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploadingCOI(false);
    }
  };

  const handleViewDocument = (doc: any) => {
    if (isDemoMode()) {
      // In demo mode, just show a placeholder since we don't have real files
      window.open('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000', '_blank');
      return;
    }
    setViewingDocument(doc);
  };

  const handleDeleteDocument = async (doc: any, docIndex: number) => {
    if (!id) return;
    
    if (!confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeletingDocument(doc.path);
    
    if (isDemoMode()) {
      setTimeout(() => {
        toast.success('Document deleted successfully! (Demo Mode)');
        
        setVendor((prev: any) => ({
          ...prev,
          documents: prev.documents.filter((d: any) => d.path !== doc.path)
        }));
        
        setIsDeletingDocument(null);
      }, 1000);
      return;
    }

    try {
      const response = await vendorApi.deleteCOI(id, doc.path);
      
      if (response.policiesCleared) {
        toast.success('Document deleted and insurance policies cleared!');
      } else {
        toast.success('Document deleted successfully!');
      }
      
      // Reload vendor data to reflect the deletion
      await loadVendorData();
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document. Please try again.');
    } finally {
      setIsDeletingDocument(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'compliant') {
      return {
        icon: CheckCircle2,
        label: 'Compliant',
        bg: 'var(--status-compliant-bg)',
        color: 'var(--status-compliant)',
        border: 'var(--status-compliant-border)'
      };
    } else if (status === 'at-risk') {
      return {
        icon: Clock,
        label: 'At Risk',
        bg: 'var(--status-at-risk-bg)',
        color: 'var(--status-at-risk)',
        border: 'var(--status-at-risk-border)'
      };
    } else if (status === 'missing') {
      return {
        icon: AlertCircle,
        label: 'Missing',
        bg: 'var(--status-non-compliant-bg)',
        color: 'var(--status-non-compliant)',
        border: 'var(--status-non-compliant-border)'
      };
    } else {
      return {
        icon: AlertCircle,
        label: 'Non-Compliant',
        bg: 'var(--status-non-compliant-bg)',
        color: 'var(--status-non-compliant)',
        border: 'var(--status-non-compliant-border)'
      };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  const formatActionName = (action: string) => {
    // Convert snake_case to Title Case
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center h-full">
        <div style={{ color: 'var(--foreground-muted)' }}>Loading vendor details...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-4 md:p-8 lg:p-12">
        <Link 
          to="/vendors"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors"
          style={{ color: 'var(--foreground-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vendors
        </Link>
        <div style={{ color: 'var(--foreground-muted)' }}>Vendor not found</div>
      </div>
    );
  }

  const vendorStatusBadge = getStatusBadge(vendor.status);
  const StatusIcon = vendorStatusBadge.icon;
  
  // Parse insurance policies from vendor data
  const insurancePolicies = vendor.insurancePolicies || [];

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Back Button */}
      <Link 
        to="/vendors"
        className="inline-flex items-center gap-2 mb-6 md:mb-8 text-sm transition-colors"
        style={{ color: 'var(--foreground-muted)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to vendors
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="mb-4 text-2xl md:text-3xl font-semibold text-gray-900">{vendor.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[200px]">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{vendor.phone}</span>
            </div>
            {vendor.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{vendor.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            className="flex-1 sm:flex-none px-6 py-3 rounded-lg border transition-all text-sm inline-flex items-center justify-center gap-2"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)' 
            }}
            onClick={handleGenerateUploadLink}
            disabled={isGeneratingLink}
          >
            <Upload className="w-4 h-4" />
            {isGeneratingLink ? 'Generating...' : 'Generate upload link'}
          </button>
          <button
            className="flex-1 sm:flex-none px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
            onClick={handleSendReminder}
            disabled={isSendingReminder}
          >
            <Send className="w-4 h-4" />
            {isSendingReminder ? 'Sending...' : 'Send reminder'}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content - Left 2/3 */}
        <div className="col-span-2 space-y-8">
          {/* Vendor Overview */}
          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Vendor overview</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Status</div>
                <div
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap"
                  style={{
                    backgroundColor: vendorStatusBadge.bg,
                    color: vendorStatusBadge.color,
                    borderColor: vendorStatusBadge.border
                  }}
                >
                  <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {vendorStatusBadge.label}
                </div>
              </div>

              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Next expiration</div>
                <div style={{ color: 'var(--foreground)' }}>
                  {vendor.nextExpiry ? (
                    <div>
                      {formatDate(vendor.nextExpiry)}
                      <div className="text-xs mt-1" style={{ color: getDaysUntil(vendor.nextExpiry) < 30 ? 'var(--status-non-compliant)' : 'var(--foreground-muted)' }}>
                        ({getDaysUntil(vendor.nextExpiry)} days)
                      </div>
                    </div>
                  ) : 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Site / Project</div>
                <div style={{ color: 'var(--foreground)' }}>{vendor.site || 'N/A'}</div>
              </div>

              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Address</div>
                <div style={{ color: 'var(--foreground)' }}>
                  {vendor.address ? (
                    <div className="break-words">{vendor.address}</div>
                  ) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div
            className="rounded-2xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 className="text-xl mb-2" style={{ color: 'var(--foreground)' }}>Compliance checklist</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              Required insurance coverage vs current status
            </p>

            <div className="space-y-4">
              {insurancePolicies.length > 0 ? (
                insurancePolicies.map((policy: any, index: number) => {
                  const policyStatus = getStatusBadge(policy.status || 'compliant');
                  const PolicyIcon = policyStatus.icon;

                  // --- AI VERIFICATION LOGIC ---
                  const normalizedType = normalizePolicyType(policy.type);
                  const required = normalizedType ? REQUIRED_LIMITS[normalizedType] : null;
                  
                  let gapWarning = null;
                  let limitDisplay = 'N/A';
                  
                  // Handle new "limits" structure or fallback to old "coverageLimit"
                  const eachOccurrence = policy.limits?.eachOccurrence || policy.coverageLimit;
                  const aggregate = policy.limits?.aggregate;
                  
                  // Check for gaps against standard
                  if (required && eachOccurrence) {
                    if (required.occurrence && eachOccurrence < required.occurrence) {
                      gapWarning = `Limit too low (< ${formatCurrency(required.occurrence)})`;
                    } else if (required.aggregate && aggregate && aggregate < required.aggregate) {
                      gapWarning = `Aggregate too low (< ${formatCurrency(required.aggregate)})`;
                    }
                  }

                  // Format the display string (e.g. "$1,000,000 / $2,000,000")
                  if (eachOccurrence) {
                    limitDisplay = formatCurrency(eachOccurrence);
                    if (aggregate) {
                      limitDisplay += ` / ${formatCurrency(aggregate)}`;
                    }
                  }
                  // -----------------------------
                  
                  return (
                    <div
                      key={index}
                      className="border rounded-xl p-6"
                      style={{
                        borderColor: gapWarning ? '#fee2e2' : 'var(--border)', // Red border if gap
                        backgroundColor: gapWarning ? '#fef2f2' : 'var(--background)' // Red bg if gap
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
                          {policy.type}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border"
                            style={{
                              backgroundColor: policyStatus.bg,
                              color: policyStatus.color,
                              borderColor: policyStatus.border
                            }}
                          >
                            <PolicyIcon className="w-3.5 h-3.5" />
                            {policyStatus.label}
                          </div>

                          {/* Warning Badge */}
                          {gapWarning && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="hidden sm:inline">Coverage Gap</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                        <div>
                          <div className="mb-1 text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Coverage limit</div>
                          <div className="text-sm font-medium" style={{ color: gapWarning ? '#b91c1c' : 'var(--foreground)' }}>
                            {limitDisplay}
                          </div>
                          {gapWarning && (
                            <div className="text-xs text-red-600 mt-1">
                              {gapWarning}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mb-1 text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Expiry date</div>
                          <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                            {policy.expiryDate ? formatDate(policy.expiryDate) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Carrier</div>
                          <div className="text-sm" style={{ color: 'var(--foreground)' }}>{policy.carrier || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--foreground-muted)' }}>
                  No insurance policies on file
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl" style={{ color: 'var(--foreground)' }}>Certificates of Insurance (COI)</h2>
            </div>

            {/* Upload COI Section */}
            <div 
              className="border-2 border-dashed rounded-xl p-6 mb-6"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)'
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-4">
                <label
                  htmlFor="coi-upload"
                  className="w-full flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'rgba(58, 79, 106, 0.08)',
                        border: '1px solid rgba(58, 79, 106, 0.15)'
                      }}
                    >
                      <FileUp className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {selectedFile ? (
                        <>
                          <div className="text-sm mb-1 truncate" style={{ color: 'var(--foreground)' }}>
                            {selectedFile.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                            Upload Certificate of Insurance
                          </div>
                          <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                            PDF, PNG, or JPG • Max 10MB
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    id="coi-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                  />
                </label>
                {selectedFile && (
                  <button
                    onClick={handleUploadCOI}
                    disabled={isUploadingCOI}
                    className="w-full md:w-auto px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      opacity: isUploadingCOI ? 0.7 : 1,
                      cursor: isUploadingCOI ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingCOI ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              {vendor.documents && vendor.documents.length > 0 ? (
                vendor.documents.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 rounded-lg border transition-all hover:shadow-sm"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--background)'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 shrink-0" style={{ color: 'var(--foreground-muted)' }} />
                      <div className="min-w-0">
                        <div className="text-sm truncate" style={{ color: 'var(--foreground)' }}>{doc.name}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--foreground-muted)' }}>
                          {doc.type} • Uploaded {doc.uploaded || 'recently'} • {doc.size || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                        style={{ color: 'var(--foreground-muted)' }}
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc, index)}
                        disabled={isDeletingDocument === doc.path}
                        className="p-2 rounded-lg transition-colors hover:bg-red-50"
                        style={{ 
                          color: isDeletingDocument === doc.path ? 'var(--foreground-subtle)' : '#EF4444',
                          cursor: isDeletingDocument === doc.path ? 'not-allowed' : 'pointer',
                          opacity: isDeletingDocument === doc.path ? 0.5 : 1
                        }}
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--foreground-muted)' }}>
                  No documents uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="space-y-8">
          {/* Activity Log */}
          <div
            className="rounded-2xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 className="text-xl mb-6" style={{ color: 'var(--foreground)' }}>Activity log</h2>

            <div className="space-y-6">
              {activities.length > 0 ? (
                <>
                  {activities.slice(0, 15).map((item, index) => (
                    <div key={index} className="relative pl-6">
                      <div
                        className="absolute left-0 top-1 w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            item.status === 'positive'
                              ? 'var(--status-compliant)'
                              : item.status === 'warning'
                              ? 'var(--status-at-risk)'
                              : 'var(--foreground-muted)'
                        }}
                      />
                      <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>{formatActionName(item.action)}</div>
                      <div className="text-xs mb-1" style={{ color: 'var(--foreground-muted)' }}>{item.detail}</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{getTimeAgo(item.timestamp)}</div>
                    </div>
                  ))}
                  {activities.length > 15 && (
                    <div className="text-center pt-2" style={{ color: 'var(--foreground-muted)' }}>
                      <div className="text-xs">
                        Showing 15 of {activities.length} activities
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--foreground-muted)' }}>
                  No activity yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Link Modal */}
      {showLinkModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowLinkModal(false)}
        >
          <div 
            className="rounded-2xl border p-8 max-w-2xl w-full"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: 'var(--foreground)' }}>Upload Link Generated</h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: 'var(--foreground-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              Share this secure link with <strong>{vendor.name}</strong> to allow them to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-1 text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
              <li>Upload their own Certificates of Insurance (COI)</li>
              <li>Submit W9 tax forms</li>
              <li>Update their company contact information</li>
            </ul>
            <div className="text-xs mb-6" style={{ color: 'var(--foreground-muted)', opacity: 0.7 }}>
              The link will expire in 7 days.
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <input
                type="text"
                value={uploadLink || ''}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg border text-sm"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
              <button
                className="px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                className="px-6 py-3 rounded-lg border transition-all text-sm"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                onClick={() => setShowLinkModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setViewingDocument(null)}
        >
          <div 
            className="rounded-2xl border max-w-6xl w-full h-[90vh] flex flex-col"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-xl mb-1" style={{ color: 'var(--foreground)' }}>{viewingDocument.name}</h2>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  {viewingDocument.type} • {viewingDocument.size}
                </p>
              </div>
              <button
                onClick={() => setViewingDocument(null)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: 'var(--foreground-muted)' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {viewingDocument.type === 'PDF' ? (
                <iframe
                  src={viewingDocument.url}
                  className="w-full h-full rounded-lg"
                  title={viewingDocument.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={viewingDocument.url}
                    alt={viewingDocument.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <a
                href={viewingDocument.url}
                download={viewingDocument.name}
                className="px-6 py-3 rounded-lg border transition-all text-sm inline-flex items-center gap-2"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Download
              </a>
              <button
                className="px-6 py-3 rounded-lg transition-all text-sm"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                onClick={() => setViewingDocument(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
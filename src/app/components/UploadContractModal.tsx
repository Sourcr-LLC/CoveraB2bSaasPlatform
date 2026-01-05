import { X, Upload, FileText, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { vendorApi, contractApi } from '../lib/api';

interface UploadContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadContractModal({ isOpen, onClose, onSuccess }: UploadContractModalProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [selectedVendor, setSelectedVendor] = useState('');
  const [contractType, setContractType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [value, setValue] = useState('');
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadVendors();
    }
  }, [isOpen]);

  const loadVendors = async () => {
    try {
      const { vendors: vendorData } = await vendorApi.getAll();
      setVendors(vendorData || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    // Automatically analyze the document
    await analyzeDocument(selectedFile);
  };

  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    setError('');

    try {
      console.log('🔍 Analyzing contract document with AI...');
      const response = await contractApi.analyzeContract(file);
      
      if (response.extractedData) {
        const data = response.extractedData;
        console.log('✅ Contract analysis complete:', data);
        
        // Auto-fill form fields with extracted data
        if (data.contractType) {
          // Try to match with our predefined types
          const typeMapping: { [key: string]: string } = {
            'SERVICE AGREEMENT': 'Service Agreement',
            'MASTER SERVICE AGREEMENT': 'Master Service Agreement',
            'MSA': 'Master Service Agreement',
            'NON-DISCLOSURE AGREEMENT': 'Non-Disclosure Agreement',
            'NDA': 'Non-Disclosure Agreement',
            'CONFIDENTIALITY AGREEMENT': 'Non-Disclosure Agreement',
            'PURCHASE ORDER': 'Purchase Order',
            'PO': 'Purchase Order',
            'CONSULTING AGREEMENT': 'Consulting Agreement',
            'MAINTENANCE CONTRACT': 'Maintenance Contract',
            'SOFTWARE LICENSE': 'Software License',
            'LICENSE AGREEMENT': 'Software License',
          };
          
          const matchedType = typeMapping[data.contractType.toUpperCase()] || data.contractType;
          
          // Check if it matches one of our predefined options
          const validTypes = [
            'Service Agreement',
            'Master Service Agreement',
            'Non-Disclosure Agreement',
            'Purchase Order',
            'Consulting Agreement',
            'Maintenance Contract',
            'Software License',
            'Other'
          ];
          
          if (validTypes.includes(matchedType)) {
            setContractType(matchedType);
          } else {
            setContractType('Other');
          }
        }
        
        if (data.startDate) {
          setStartDate(data.startDate);
        }
        
        if (data.endDate) {
          setEndDate(data.endDate);
        }
        
        if (data.value) {
          setValue(data.value.toString());
        }
        
        if (data.autoRenewal !== undefined) {
          setAutoRenewal(data.autoRenewal);
        }
        
        if (data.description) {
          setDescription(data.description);
        }
      }
    } catch (err: any) {
      console.error('Document analysis error:', err);
      // Don't show error to user - they can fill in manually
      // The extraction is a helpful feature but not required
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedVendor || !contractType || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const vendor = vendors.find(v => v.id === selectedVendor);
      
      // Calculate status based on end date
      const now = new Date();
      const endDateObj = new Date(endDate);
      const daysUntilExpiry = Math.ceil((endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: 'active' | 'expiring-soon' | 'expired';
      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring-soon';
      } else {
        status = 'active';
      }

      const contractData = {
        vendorName: vendor?.name || '',
        vendorId: selectedVendor,
        contractType,
        startDate,
        endDate,
        value: value ? `$${parseFloat(value.replace(/[^0-9.]/g, '')).toLocaleString()}` : '$0',
        status,
        autoRenewal,
        description,
        lastReviewed: new Date().toISOString().split('T')[0]
      };

      // If file is attached, upload with file; otherwise create without file
      if (file) {
        await contractApi.uploadContract(file, contractData);
      } else {
        await contractApi.create(contractData);
      }

      // Reset form
      resetForm();

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      console.error('Create contract error:', err);
      setError(err.message || 'Failed to create contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedVendor('');
    setContractType('');
    setStartDate('');
    setEndDate('');
    setValue('');
    setAutoRenewal(false);
    setDescription('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-xl border max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-xl mb-1">Upload Contract Document</h2>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Upload a contract and we'll automatically extract the details using AI
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ color: 'var(--foreground-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div 
              className="p-4 rounded-lg text-sm"
              style={{ 
                backgroundColor: 'var(--status-non-compliant-bg)',
                color: 'var(--status-non-compliant)'
              }}
            >
              {error}
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
              Contract Document <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
            </label>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center transition-all"
              style={{ borderColor: file ? 'var(--status-compliant)' : 'var(--border)' }}
            >
              <input
                type="file"
                id="contract-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="contract-upload"
                className="cursor-pointer"
              >
                {isAnalyzing ? (
                  <div>
                    <Sparkles className="w-10 h-10 mx-auto mb-3 animate-pulse" style={{ color: 'var(--primary)' }} />
                    <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      Analyzing document with AI...
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Extracting contract details automatically
                    </div>
                  </div>
                ) : file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8" style={{ color: 'var(--status-compliant)' }} />
                    <div className="text-left">
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>{file.name}</div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--foreground-muted)' }} />
                    <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      PDF, JPG, or PNG (max 10MB) • AI will extract contract details
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Extracted/Manual Fields */}
          {file && (
            <>
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ 
                  backgroundColor: 'var(--status-compliant-bg)',
                  borderColor: 'var(--status-compliant)'
                }}
              >
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--status-compliant)' }}>
                  <Sparkles className="w-4 h-4" />
                  <span>Review and edit the extracted information below</span>
                </div>
              </div>

              {/* Vendor Selection */}
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  Vendor <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  Contract Type <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="">Select contract type</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Master Service Agreement">Master Service Agreement</option>
                  <option value="Non-Disclosure Agreement">Non-Disclosure Agreement</option>
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Consulting Agreement">Consulting Agreement</option>
                  <option value="Maintenance Contract">Maintenance Contract</option>
                  <option value="Software License">Software License</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                    Start Date <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                    End Date <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
              </div>

              {/* Contract Value */}
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  Contract Value
                </label>
                <div className="relative">
                  <span 
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--foreground-muted)' }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border transition-all text-sm"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
              </div>

              {/* Auto-Renewal */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoRenewalUpload"
                  checked={autoRenewal}
                  onChange={(e) => setAutoRenewal(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: 'var(--primary)'
                  }}
                />
                <label 
                  htmlFor="autoRenewalUpload" 
                  className="text-sm cursor-pointer"
                  style={{ color: 'var(--foreground)' }}
                >
                  Auto-renewal enabled
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  Description / Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional contract details..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border transition-all text-sm resize-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </>
          )}

          {/* Actions */}
          {file && (
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border text-sm transition-all"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isAnalyzing}
                className="flex-1 px-6 py-3 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  opacity: (isSubmitting || isAnalyzing) ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Saving Contract...' : 'Save Contract'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
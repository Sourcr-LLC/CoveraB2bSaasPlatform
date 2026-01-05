import { X, Upload, FileText, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { vendorApi, insuranceApi } from '../lib/api';

interface UploadCOIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadCOIModal({ isOpen, onClose, onSuccess }: UploadCOIModalProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      console.log('🔍 Analyzing COI document with AI...');
      const response = await vendorApi.analyzeCOI(file);
      
      if (response.extractedData) {
        const data = response.extractedData;
        console.log('✅ COI analysis complete:', data);
        
        // Auto-fill form fields with extracted data
        if (data.expirationDate) {
          setExpirationDate(data.expirationDate);
        }
        
        if (data.policies && data.policies.length > 0) {
          const firstPolicy = data.policies[0];
          
          // Map policy type
          if (firstPolicy.type) {
            // Try to match with our predefined types
            const typeMapping: { [key: string]: string } = {
              'COMMERCIAL GENERAL LIABILITY': 'General Liability',
              'GENERAL LIABILITY': 'General Liability',
              'WORKERS COMPENSATION': 'Workers Compensation',
              'WORKERS COMP': 'Workers Compensation',
              'AUTOMOBILE LIABILITY': 'Auto Liability',
              'AUTO LIABILITY': 'Auto Liability',
              'PROFESSIONAL LIABILITY': 'Professional Liability',
              'UMBRELLA LIAB': 'Umbrella Coverage',
              'UMBRELLA': 'Umbrella Coverage',
              'PROPERTY': 'Property Insurance',
            };
            
            const matchedType = typeMapping[firstPolicy.type.toUpperCase()] || firstPolicy.type;
            setPolicyType(matchedType);
          }
          
          if (firstPolicy.policyNumber) {
            setPolicyNumber(firstPolicy.policyNumber);
          }
          
          if (firstPolicy.carrier) {
            setInsuranceProvider(firstPolicy.carrier);
          }
          
          if (firstPolicy.coverageLimit) {
            setCoverageAmount(`$${parseInt(firstPolicy.coverageLimit).toLocaleString()}`);
          }
          
          if (firstPolicy.expiryDate) {
            setExpirationDate(firstPolicy.expiryDate);
          }
        }
        
        // Set effective date to today if not provided
        if (!effectiveDate) {
          setEffectiveDate(new Date().toISOString().split('T')[0]);
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

    if (!selectedVendor || !policyType || !expirationDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create insurance record
      const insuranceData = {
        vendorId: selectedVendor,
        policyType,
        policyNumber,
        insuranceProvider,
        coverageAmount,
        effectiveDate,
        expirationDate,
        fileName: file?.name || 'manual-entry',
        status: 'active'
      };

      await insuranceApi.create(insuranceData);

      // Update vendor with insurance expiry
      await vendorApi.update(selectedVendor, {
        insuranceExpiry: expirationDate,
        status: 'compliant'
      });

      // Reset form
      setSelectedVendor('');
      setPolicyType('');
      setPolicyNumber('');
      setInsuranceProvider('');
      setCoverageAmount('');
      setEffectiveDate('');
      setExpirationDate('');
      setFile(null);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      console.error('Upload COI error:', err);
      setError(err.message || 'Failed to upload COI. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
            <h2 className="text-xl mb-1">Upload Certificate of Insurance</h2>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Add a new COI to your vendor's compliance records
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

          {/* File Upload - First so AI can analyze */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
              Upload COI Document
            </label>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center transition-all"
              style={{ borderColor: file ? 'var(--status-compliant)' : 'var(--border)' }}
            >
              <input
                type="file"
                id="coi-file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="coi-file-upload"
                className="cursor-pointer"
              >
                {isAnalyzing ? (
                  <div>
                    <Sparkles className="w-10 h-10 mx-auto mb-3 animate-pulse" style={{ color: 'var(--primary)' }} />
                    <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      Analyzing COI with AI...
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Extracting policy details automatically
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
                      PDF, JPG, or PNG (max 10MB) • AI will extract insurance details
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {file && !isAnalyzing && (
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: 'var(--status-compliant-bg)',
                borderColor: 'var(--status-compliant)'
              }}
            >
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--status-compliant)' }}>
                <Sparkles className="w-4 h-4" />
                <span>AI extracted the information below - please review and edit if needed</span>
              </div>
            </div>
          )}

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

          {/* Policy Type */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
              Policy Type <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
            </label>
            <select
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <option value="">Select policy type</option>
              <option value="General Liability">General Liability</option>
              <option value="Workers Compensation">Workers Compensation</option>
              <option value="Auto Liability">Auto Liability</option>
              <option value="Professional Liability">Professional Liability</option>
              <option value="Umbrella Coverage">Umbrella Coverage</option>
              <option value="Property Insurance">Property Insurance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Policy Number */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                Policy Number
              </label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="POL-123456"
                className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Insurance Provider */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                Insurance Provider
              </label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="State Farm, Allstate, etc."
                className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>

          {/* Coverage Amount */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
              Coverage Amount
            </label>
            <input
              type="text"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              placeholder="$1,000,000"
              className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Effective Date */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all text-sm"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                Expiration Date <span style={{ color: 'var(--status-non-compliant)' }}>*</span>
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
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

          {/* Actions */}
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
              {isSubmitting ? 'Uploading...' : 'Upload COI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
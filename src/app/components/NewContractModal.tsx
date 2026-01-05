import { X, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { vendorApi, contractApi } from '../lib/api';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewContractModal({ isOpen, onClose, onSuccess }: NewContractModalProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [contractType, setContractType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [value, setValue] = useState('');
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [description, setDescription] = useState('');
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

      await contractApi.create(contractData);

      // Reset form
      setSelectedVendor('');
      setContractType('');
      setStartDate('');
      setEndDate('');
      setValue('');
      setAutoRenewal(false);
      setDescription('');

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
            <h2 className="text-xl mb-1">Create New Contract</h2>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Add a new contract to your vendor management system
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
              id="autoRenewal"
              checked={autoRenewal}
              onChange={(e) => setAutoRenewal(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{
                accentColor: 'var(--primary)'
              }}
            />
            <label 
              htmlFor="autoRenewal" 
              className="text-sm cursor-pointer"
              style={{ color: 'var(--foreground)' }}
            >
              Auto-renewal enabled
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
              Description
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

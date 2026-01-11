import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { vendorApi } from '../lib/api';
import { isDemoMode, demoVendors } from '../lib/demoData';
import { useSubscription } from '../hooks/useSubscription';

// Helper function to calculate vendor status client-side
function calculateVendorStatus(insuranceExpiry: string | undefined): string {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return 'non-compliant'; // No insurance or invalid date = non-compliant
  }
  
  const expiryDate = new Date(insuranceExpiry);
  
  // Check if date is valid
  if (isNaN(expiryDate.getTime())) {
    return 'non-compliant'; // Invalid date = non-compliant
  }
  
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'non-compliant'; // Expired
  } else if (daysUntilExpiry <= 30) {
    return 'at-risk'; // Expiring within 30 days
  } else {
    return 'compliant'; // Valid and not expiring soon
  }
}

export default function VendorManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadVendors = useCallback(async () => {
    try {
      const { vendors: fetchedVendors } = isDemoMode() ? { vendors: demoVendors } : await vendorApi.getAll();
      // Recalculate status for each vendor to ensure accuracy
      const vendorsWithUpdatedStatus = (fetchedVendors || []).map(vendor => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const getStatusBadge = useCallback((status: string) => {
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
    } else {
      return {
        icon: AlertCircle,
        label: 'Non-Compliant',
        bg: 'var(--status-non-compliant-bg)',
        color: 'var(--status-non-compliant)',
        border: 'var(--status-non-compliant-border)'
      };
    }
  }, []);

  // Memoize filtered vendors to avoid recalculating on every render
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || vendor.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [vendors, searchTerm, filterStatus]);

  // Memoize stats calculation
  const stats = useMemo(() => ({
    total: vendors.length,
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length
  }), [vendors]);

  const maxVendors = getMaxVendors();
  const isLimitReached = !isLoading && !subscriptionLoading && vendors.length >= maxVendors;

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {isLimitReached && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              You have reached your plan limit of {maxVendors} vendors.
            </p>
          </div>
          <Link to="/billing" className="text-sm font-semibold hover:underline whitespace-nowrap">
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="mb-3 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Vendors</h1>
          <p className="text-base" style={{ color: 'var(--foreground-muted)' }}>
            Manage and monitor all vendor relationships and compliance status
          </p>
        </div>
        <Link to={isLimitReached ? "#" : "/add-vendor"} onClick={(e) => isLimitReached && e.preventDefault()}>
          <button 
            data-tour="add-vendor-button"
            disabled={isLimitReached}
            className={`px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center gap-2 w-full md:w-auto justify-center ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Plus className="w-4 h-4" />
            Add vendor
          </button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div 
          className="rounded-xl border px-6 py-5"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Total Vendors</div>
          <div className="text-3xl tracking-tight" style={{ color: 'var(--foreground)' }}>{stats.total}</div>
        </div>
        <div 
          className="rounded-xl border px-6 py-5"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Compliant</div>
          <div className="text-3xl tracking-tight" style={{ color: 'var(--status-compliant)' }}>{stats.compliant}</div>
        </div>
        <div 
          className="rounded-xl border px-6 py-5"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>At Risk</div>
          <div className="text-3xl tracking-tight" style={{ color: 'var(--status-at-risk)' }}>{stats.atRisk}</div>
        </div>
        <div 
          className="rounded-xl border px-6 py-5"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Non-Compliant</div>
          <div className="text-3xl tracking-tight" style={{ color: 'var(--status-non-compliant)' }}>{stats.nonCompliant}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div 
        className="rounded-xl border p-4 md:p-6 mb-6"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--foreground-subtle)' }} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="hidden md:flex items-center gap-2 border rounded-lg p-1" style={{ borderColor: 'var(--border)' }}>
            {['all', 'compliant', 'at-risk', 'non-compliant'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className="px-4 py-2 rounded-md text-sm transition-all capitalize whitespace-nowrap"
                style={{
                  backgroundColor: filterStatus === status ? 'var(--panel)' : 'transparent',
                  color: filterStatus === status ? 'var(--foreground)' : 'var(--foreground-muted)'
                }}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Mobile Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="md:hidden px-4 py-3 rounded-lg border text-sm transition-all"
            style={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          >
            <option value="all">All Status</option>
            <option value="compliant">Compliant</option>
            <option value="at-risk">At Risk</option>
            <option value="non-compliant">Non-Compliant</option>
          </select>

          <button 
            className="hidden md:inline-flex px-4 py-3 rounded-lg border text-sm items-center gap-2 transition-all"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden md:block rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--panel)' }}>
              <th className="px-8 py-4 text-left text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                Vendor Name
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                Insurance Expiry
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                Site / Project
              </th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                Last Contact
              </th>
              <th className="px-6 py-4 text-right text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)' }}>
                
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => {
              const statusBadge = getStatusBadge(vendor.status);
              const StatusIcon = statusBadge.icon;
              
              return (
                <tr 
                  key={vendor.id}
                  className="border-t transition-colors hover:bg-opacity-50"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <td className="px-8 py-6">
                    <div>
                      <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                        {vendor.name}
                      </div>
                      {vendor.missingDocs > 0 && (
                        <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                          {vendor.missingDocs} missing document{vendor.missingDocs > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        border: `1px solid ${statusBadge.border}`
                      }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                      {new Date(vendor.insuranceExpiry).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {vendor.site}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {vendor.lastContact ? new Date(vendor.lastContact).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric'
                      }) : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Link 
                      to={`/vendors/${vendor.id}`}
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      View details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredVendors.map((vendor) => {
          const statusBadge = getStatusBadge(vendor.status);
          const StatusIcon = statusBadge.icon;
          
          return (
            <Link
              key={vendor.id}
              to={`/vendors/${vendor.id}`}
              className="block rounded-xl border p-4 transition-all"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                    {vendor.name}
                  </div>
                  {vendor.missingDocs > 0 && (
                    <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                      {vendor.missingDocs} missing document{vendor.missingDocs > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    backgroundColor: statusBadge.bg,
                    color: statusBadge.color,
                    border: `1px solid ${statusBadge.border}`
                  }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusBadge.label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--foreground-subtle)' }}>Insurance Expiry</span>
                  <span style={{ color: 'var(--foreground)' }}>
                    {new Date(vendor.insuranceExpiry).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--foreground-subtle)' }}>Site / Project</span>
                  <span style={{ color: 'var(--foreground-muted)' }}>{vendor.site}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--foreground-subtle)' }}>Last Contact</span>
                  <span style={{ color: 'var(--foreground-muted)' }}>
                    {vendor.lastContact ? new Date(vendor.lastContact).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric'
                    }) : 'Never'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--primary)' }}>
                  View details
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
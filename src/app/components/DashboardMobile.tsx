import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Bell, AlertCircle, Clock } from 'lucide-react';
import { vendorApi } from '../lib/api';
import { toast } from 'sonner';
import PremiumLoader from './PremiumLoader';

// Helper function to calculate vendor status
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

export default function Dashboard() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const vendorData = await vendorApi.getAll();
      const vendorsWithUpdatedStatus = (vendorData.vendors || []).map(vendor => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysLeft = (insuranceExpiry: string | undefined) => {
    if (!insuranceExpiry || insuranceExpiry === 'Invalid Date') {
      return null;
    }
    const expiry = new Date(insuranceExpiry);
    if (isNaN(expiry.getTime())) {
      return null;
    }
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const stats = {
    total: vendors.length,
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length
  };

  const highRiskVendors = vendors
    .filter(v => v.status === 'at-risk' || v.status === 'non-compliant')
    .slice(0, 3);

  const upcomingExpirations = {
    within7Days: vendors.filter(v => {
      const days = calculateDaysLeft(v.insuranceExpiry);
      return days !== null && days >= 0 && days <= 7;
    }).length,
    within14Days: vendors.filter(v => {
      const days = calculateDaysLeft(v.insuranceExpiry);
      return days !== null && days > 7 && days <= 14;
    }).length,
    within30Days: vendors.filter(v => {
      const days = calculateDaysLeft(v.insuranceExpiry);
      return days !== null && days > 14 && days <= 30;
    }).length,
  };

  if (isLoading) {
    return <PremiumLoader fullScreen />;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Dashboard
            </h1>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Real-time overview of your vendor compliance status
            </p>
          </div>
          <button className="p-2 lg:hidden" style={{ color: 'var(--foreground-muted)' }}>
            <Bell className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs mt-2" style={{ color: 'var(--foreground-subtle)' }}>
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* At Risk */}
        <div 
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.03)',
            borderColor: 'rgba(245, 158, 11, 0.2)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center mb-1.5 h-5">
            <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--foreground-muted)', opacity: 0.8, letterSpacing: '0.05em' }}>
              AT RISK
            </div>
            {stats.atRisk > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold h-5 px-1.5 rounded-full" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <TrendingDown className="w-3 h-3" />
                {stats.atRisk}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <div className="tracking-tighter" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--foreground)' }}>
              {stats.atRisk}
            </div>
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--foreground-subtle)' }}>
            expiring within 30 days
          </div>
        </div>

        {/* Non-Compliant */}
        <div 
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.03)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center mb-1.5 h-5">
            <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--foreground-muted)', opacity: 0.8, letterSpacing: '0.05em' }}>
              NON-COMPLIANT
            </div>
            {stats.nonCompliant > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold h-5 px-1.5 rounded-full" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <TrendingDown className="w-3 h-3" />
                {stats.nonCompliant}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <div className="tracking-tighter" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--foreground)' }}>
              {stats.nonCompliant}
            </div>
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--foreground-subtle)' }}>
            of total vendors
          </div>
        </div>

        {/* Compliant */}
        <div 
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.03)',
            borderColor: 'rgba(16, 185, 129, 0.2)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center mb-1.5 h-5">
            <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--foreground-muted)', opacity: 0.8, letterSpacing: '0.05em' }}>
              COMPLIANT
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <div className="tracking-tighter" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--foreground)' }}>
              {stats.compliant}
            </div>
            <span className="text-sm font-medium relative -top-1" style={{ color: 'var(--foreground-subtle)' }}>
              / {stats.total}
            </span>
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--foreground-subtle)' }}>
            of total vendors
          </div>
        </div>

        {/* Total Vendors */}
        <div 
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center mb-1.5 h-5">
            <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--foreground-muted)', opacity: 0.8, letterSpacing: '0.05em' }}>
              TOTAL VENDORS
            </div>
            {stats.total > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold h-5 px-1.5 rounded-full" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <TrendingUp className="w-3 h-3" />
                +{stats.total}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <div className="tracking-tighter" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--foreground)' }}>
              {stats.total}
            </div>
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--foreground-subtle)' }}>
            active vendors
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* High-risk vendors */}
        <div 
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
            High-risk vendors
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
            Vendors requiring immediate attention
          </p>

          {highRiskVendors.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--foreground-subtle)' }}>
              No high-risk vendors
            </p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b text-xs" style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)', fontWeight: 500 }}>
                <div>VENDOR</div>
                <div>STATUS</div>
              </div>
              {highRiskVendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  to={`/vendors/${vendor.id}`}
                  className="grid grid-cols-2 gap-4 py-3 border-b hover:bg-opacity-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                    {vendor.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: vendor.status === 'non-compliant' ? '#ef4444' : '#f59e0b'
                      }}
                    />
                    <span className="text-sm" style={{ color: 'var(--foreground-subtle)' }}>
                      {vendor.status === 'non-compliant' ? 'Expired' : 'Expiring Soon'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming expirations */}
        <div 
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 className="text-lg mb-6" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
            Upcoming expirations
          </h2>

          <div className="space-y-4">
            {/* Within 7 days */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <div>
                  <div className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                    Within 7 days
                  </div>
                </div>
              </div>
              <div className="text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {upcomingExpirations.within7Days}
              </div>
            </div>

            {/* Within 14 days */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                <div>
                  <div className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                    Within 14 days
                  </div>
                </div>
              </div>
              <div className="text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {upcomingExpirations.within14Days}
              </div>
            </div>

            {/* Within 30 days */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                <div>
                  <div className="text-sm" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                    Within 30 days
                  </div>
                </div>
              </div>
              <div className="text-2xl" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {upcomingExpirations.within30Days}
              </div>
            </div>

            <Link
              to="/vendors"
              className="block text-center mt-6 py-2 text-sm"
              style={{ color: 'var(--primary)', fontWeight: 500 }}
            >
              View all vendors →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

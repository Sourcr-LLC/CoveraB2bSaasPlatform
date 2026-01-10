import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, AlertTriangle, CheckCircle2, Bell, Send, ArrowUpRight, Mail, Phone, Building2, Calendar, Clock, XCircle, RefreshCw, AlertCircle, Minus, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PaywallModal from './PaywallModal';
import ContactSalesModal from './ContactSalesModal';
import { toast } from 'sonner';
import { supabase, vendorApi } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { useSubscription } from '../hooks/useSubscription';
import { isDemoMode, demoVendors, getDemoStats } from '../lib/demoData';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [vendors, setVendors] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if demo mode is enabled
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data');
        setVendors(demoVendors);
        
        // Generate alerts from demo vendors
        const newAlerts = demoVendors
          .filter((v: any) => v.status === 'at-risk' || v.status === 'non-compliant')
          .map((v: any) => {
            const expiryDate = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
            const daysUntilExpiry = expiryDate 
              ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : -999;

            // Generate alert message
            let message = '';
            if (v.status === 'non-compliant') {
              if (daysUntilExpiry < -1) {
                message = `${v.name} insurance expired ${Math.abs(daysUntilExpiry)} days ago`;
              } else if (daysUntilExpiry === -1) {
                message = `${v.name} insurance expired 1 day ago`;
              } else {
                message = `${v.name} insurance has expired`;
              }
            } else if (v.status === 'at-risk') {
              if (daysUntilExpiry === 0) {
                message = `${v.name} insurance expires today`;
              } else if (daysUntilExpiry === 1) {
                message = `${v.name} insurance expires in 1 day`;
              } else {
                message = `${v.name} insurance expires in ${daysUntilExpiry} days`;
              }
            }

            return {
              id: v.id,
              vendorName: v.name,
              type: v.status === 'non-compliant' ? 'expired' : 'expiring',
              daysUntilExpiry,
              insuranceExpiry: v.insuranceExpiry,
              category: v.category,
              riskLevel: v.riskLevel || 'medium',
              status: v.status,
              message
            };
          });

        setAlerts(newAlerts);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      // Fetch vendors from API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/vendors`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }

      const data = await response.json();
      const vendorData = data.vendors || [];
      
      console.log('🔍 RAW vendors from API:', vendorData);
      // Recalculate status for each vendor to ensure accuracy
      const vendorsWithUpdatedStatus = vendorData.map((vendor: any) => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      console.log('✅ RECALCULATED vendors:', vendorsWithUpdatedStatus);
      console.log('📊 Status values:', vendorsWithUpdatedStatus.map((v: any) => v.status));
      setVendors(vendorsWithUpdatedStatus);

      // Generate alerts from vendors
      const newAlerts = vendorsWithUpdatedStatus
        .filter((v: any) => v.status === 'at-risk' || v.status === 'non-compliant')
        .map((v: any) => {
          const expiryDate = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
          const daysUntilExpiry = expiryDate 
            ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : -999;

          // Generate alert message
          let message = '';
          if (v.status === 'non-compliant') {
            if (daysUntilExpiry < -1) {
              message = `${v.name} insurance expired ${Math.abs(daysUntilExpiry)} days ago`;
            } else if (daysUntilExpiry === -1) {
              message = `${v.name} insurance expired 1 day ago`;
            } else {
              message = `${v.name} insurance has expired`;
            }
          } else if (v.status === 'at-risk') {
            if (daysUntilExpiry === 0) {
              message = `${v.name} insurance expires today`;
            } else if (daysUntilExpiry === 1) {
              message = `${v.name} insurance expires in 1 day`;
            } else {
              message = `${v.name} insurance expires in ${daysUntilExpiry} days`;
            }
          }

          return {
            id: v.id,
            vendorName: v.name,
            type: v.status === 'non-compliant' ? 'expired' : 'expiring',
            daysUntilExpiry,
            insuranceExpiry: v.insuranceExpiry,
            category: v.category,
            riskLevel: v.riskLevel,
            status: v.status,
            message
          };
        });

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleSendReminder = async (vendorId: string, vendorName: string) => {
    // Check if user has premium access
    if (!isPremium) {
      setIsPaywallOpen(true);
      return;
    }

    setSendingReminderId(vendorId);
    try {
      console.log('📧 Sending reminder to vendor:', vendorId);
      const result = await vendorApi.sendReminder(vendorId);
      console.log('✅ Reminder sent successfully:', result);
      toast.success(`Reminder sent to ${vendorName}!`);
      
      // Reload data to update activity log
      await loadData();
    } catch (error: any) {
      console.error('❌ Failed to send reminder:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        vendorId
      });
      toast.error(error.message || 'Failed to send reminder. Please check console for details.');
    } finally {
      setSendingReminderId(null);
    }
  };

  // Calculate stats from real data - memoized to prevent recalculation
  const stats = useMemo(() => ({
    total: vendors.length,
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length
  }), [vendors]);

  // Helper function to format status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'compliant': 'Compliant',
      'at-risk': 'At Risk',
      'non-compliant': 'Non-Compliant'
    };
    return labels[status] || status;
  };

  // Helper function to calculate days until expiry
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

  // Get high risk vendors (at-risk + non-compliant) with calculated properties - memoized
  const highRiskVendors = useMemo(() => vendors
    .filter(v => v.status === 'at-risk' || v.status === 'non-compliant')
    .slice(0, 5)
    .map(v => {
      const daysLeft = calculateDaysLeft(v.insuranceExpiry);
      return {
        ...v,
        statusLabel: getStatusLabel(v.status),
        expiryDate: v.insuranceExpiry && v.insuranceExpiry !== 'Invalid Date' 
          ? new Date(v.insuranceExpiry).toLocaleDateString() 
          : 'No date',
        daysLeft: daysLeft
      };
    }), [vendors]);

  // Calculate upcoming expirations - memoized
  const expirations = useMemo(() => {
    const now = new Date();
    return {
      sevenDays: vendors.filter(v => {
        if (!v.insuranceExpiry) return false;
        const expiry = new Date(v.insuranceExpiry);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 7;
      }).length,
      fourteenDays: vendors.filter(v => {
        if (!v.insuranceExpiry) return false;
        const expiry = new Date(v.insuranceExpiry);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 7 && days <= 14;
      }).length,
      thirtyDays: vendors.filter(v => {
        if (!v.insuranceExpiry) return false;
        const expiry = new Date(v.insuranceExpiry);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 14 && days <= 30;
      }).length
    };
  }, [vendors]);

  const kpiCards = useMemo(() => [
    {
      label: 'Total Vendors',
      value: stats.total.toString(),
      change: stats.total > 0 ? '+12%' : '0%',
      trend: stats.total > 0 ? 'up' : 'neutral',
      subtitle: 'active vendors',
      percentageColor: stats.total > 0 ? '#10b981' : 'var(--foreground-muted)' // Green for active, gray for none
    },
    {
      label: 'Compliant',
      value: stats.compliant.toString(),
      change: stats.total > 0 ? `${((stats.compliant / stats.total) * 100).toFixed(1)}%` : '0.0%',
      trend: stats.compliant > 0 ? 'up' : 'neutral',
      subtitle: 'of total vendors',
      percentageColor: stats.compliant > 0 ? '#10b981' : 'var(--foreground-muted)' // Green when compliant, gray when 0
    },
    {
      label: 'At Risk',
      value: stats.atRisk.toString(),
      change: stats.total > 0 ? `${((stats.atRisk / stats.total) * 100).toFixed(1)}%` : '0.0%',
      trend: stats.atRisk > 0 ? 'neutral' : 'neutral',
      subtitle: 'expiring within 30 days',
      percentageColor: stats.atRisk > 0 ? '#f59e0b' : 'var(--foreground-muted)' // Orange/warning when at risk, gray when 0
    },
    {
      label: 'Non-Compliant',
      value: stats.nonCompliant.toString(),
      change: stats.total > 0 ? `${((stats.nonCompliant / stats.total) * 100).toFixed(1)}%` : '0.0%',
      trend: stats.nonCompliant > 0 ? 'down' : 'up',
      subtitle: 'of total vendors',
      percentageColor: stats.nonCompliant > 0 ? '#ef4444' : '#10b981' // Red when non-compliant, green when 0 (good!)
    },
  ], [stats]);

  const upcomingExpirations = [
    { count: expirations.sevenDays, label: '7 days', color: 'var(--status-non-compliant)' },
    { count: expirations.fourteenDays, label: '14 days', color: 'var(--status-at-risk)' },
    { count: expirations.thirtyDays, label: '30 days', color: 'var(--status-at-risk)' },
  ];

  if (isPaywallOpen) {
    return <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 min-h-screen" style={{ 
      backgroundColor: 'var(--background)',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(58, 79, 106, 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(58, 79, 106, 0.03) 0px, transparent 50%)' 
    }}>
      {/* Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="mb-2 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
            Real-time overview of your vendor compliance status
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="rounded-xl border p-6 md:p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-card, var(--shadow-md))'
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-xs uppercase tracking-wider mb-4 font-semibold" style={{ color: 'var(--foreground-subtle)', letterSpacing: '0.08em' }}>
              {card.label}
            </div>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="tracking-tighter" style={{ color: 'var(--foreground)', fontSize: '2.5rem', fontWeight: 600, lineHeight: 1 }}>
                {card.value}
              </div>
              {card.change && (
                <div 
                  className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full bg-opacity-10"
                  style={{ 
                    color: card.percentageColor,
                    fontWeight: 600,
                    backgroundColor: `${card.percentageColor}15`
                  }}
                >
                  {card.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {card.trend === 'down' && <TrendingUp className="w-3 h-3" />}
                  {card.trend === 'neutral' && <Minus className="w-3 h-3" />}
                  <span>{card.change}</span>
                </div>
              )}
            </div>
            <div className="text-sm" style={{ color: 'var(--foreground-subtle)', fontWeight: 400 }}>
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* High-risk Vendors Table */}
        <div className="lg:col-span-7">
          <div
            className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="px-6 md:px-8 py-6 border-b flex justify-between items-start" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="text-lg font-semibold tracking-tight mb-1">High-risk vendors</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Vendors requiring immediate attention
                </p>
              </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--panel)' }}>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground-subtle)' }}>
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground-subtle)' }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground-subtle)' }}>
                      Expiry
                    </th>
                    <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground-subtle)' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskVendors.map((vendor, index) => (
                    <tr 
                      key={index}
                      className="border-t transition-colors hover:bg-slate-50/50"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-8 py-5">
                        <div>
                          <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>
                            {vendor.name}
                          </div>
                          {vendor.missing > 0 && (
                            <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                              {vendor.missing} missing document{vendor.missing > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: vendor.status === 'at-risk' 
                              ? 'var(--status-at-risk-bg)' 
                              : 'var(--status-non-compliant-bg)',
                            color: vendor.status === 'at-risk'
                              ? 'var(--status-at-risk)'
                              : 'var(--status-non-compliant)',
                            borderColor: vendor.status === 'at-risk' 
                              ? 'var(--status-at-risk-border)' 
                              : 'var(--status-non-compliant-border)'
                          }}
                        >
                          {vendor.status === 'at-risk' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {vendor.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {vendor.expiryDate}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                          {vendor.daysLeft === null 
                            ? 'No insurance' 
                            : vendor.daysLeft < 0 
                            ? `${Math.abs(vendor.daysLeft)} days overdue` 
                            : `${vendor.daysLeft} days left`}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          className="text-sm px-4 py-2 rounded-lg border transition-all hover:bg-white hover:shadow-sm"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                          onClick={() => handleSendReminder(vendor.id, vendor.name)}
                          disabled={sendingReminderId === vendor.id}
                        >
                          {sendingReminderId === vendor.id ? 'Sending...' : 'Send reminder'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {highRiskVendors.map((vendor, index) => (
                <div 
                  key={index}
                  className="p-4"
                >
                  {/* Row 1: Vendor Name & Vendor Type */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                        {vendor.name}
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-center text-xs px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0" style={{ 
                      backgroundColor: 'var(--panel)', 
                      color: 'var(--foreground-subtle)' 
                    }}>
                      {vendor.vendorType === 'general-contractor' ? 'General' :
                       vendor.vendorType === 'property-maintenance' ? 'Maintenance' :
                       vendor.vendorType === 'healthcare-provider' ? 'Healthcare' :
                       vendor.vendorType === 'logistics-transport' ? 'Logistics' :
                       vendor.vendorType}
                    </div>
                  </div>

                  {/* Row 2: Expiry Date & Days Remaining */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Expires {vendor.expiryDate}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--foreground-subtle)' }}>
                        Days remaining
                      </div>
                      <div 
                        className="text-xl font-semibold tracking-tight"
                        style={{ 
                          color: vendor.daysLeft === null 
                            ? 'var(--foreground-muted)' 
                            : vendor.daysLeft < 0 
                            ? 'var(--status-non-compliant)' 
                            : vendor.daysLeft <= 7
                            ? 'var(--status-non-compliant)'
                            : 'var(--status-at-risk)'
                        }}
                      >
                        {vendor.daysLeft === null ? 'N/A' : vendor.daysLeft < 0 ? Math.abs(vendor.daysLeft) : vendor.daysLeft}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Contact, Status Badge & Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs truncate" style={{ color: 'var(--foreground-subtle)' }}>
                        Contact: {vendor.contact || 'N/A'}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: vendor.status === 'at-risk' 
                            ? 'var(--status-at-risk-bg)' 
                            : 'var(--status-non-compliant-bg)',
                          color: vendor.status === 'at-risk'
                            ? 'var(--status-at-risk)'
                            : 'var(--status-non-compliant)',
                          border: `1px solid ${vendor.status === 'at-risk' 
                            ? 'var(--status-at-risk-border)' 
                            : 'var(--status-non-compliant-border)'}`
                        }}
                      >
                        {vendor.status === 'at-risk' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {vendor.statusLabel}
                      </span>
                    </div>
                    <button 
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap flex-shrink-0"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--card)'
                      }}
                      onClick={() => handleSendReminder(vendor.id, vendor.name)}
                      disabled={sendingReminderId === vendor.id}
                    >
                      {sendingReminderId === vendor.id ? 'Sending...' : 'Send reminder'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Expirations & Quick Actions */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          {/* Upcoming Expirations */}
          <div
            className="rounded-xl border p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-lg font-semibold tracking-tight mb-6">Upcoming expirations</h3>
            <div className="space-y-4">
              {upcomingExpirations.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Within {item.label}
                    </span>
                  </div>
                  <div className="text-xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <Link to="/insurance">
                <button 
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:bg-opacity-80"
                  style={{ 
                    backgroundColor: 'var(--panel)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)'
                  }}
                >
                  View all expirations
                  <ArrowUpRight className="w-4 h-4 ml-2 opacity-50" />
                </button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="rounded-xl border p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-lg font-semibold tracking-tight mb-6">Quick actions</h3>
            <div className="space-y-4">
              {isPremium ? (
                <>
                  <Link to="/add-vendor">
                    <button 
                      className="w-full py-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center px-4 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        boxShadow: '0 4px 6px -1px rgba(58, 79, 106, 0.2)'
                      }}
                    >
                      Add new vendor
                    </button>
                  </Link>
                  <Link to="/insurance">
                    <button 
                      className="w-full py-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center px-4 hover:bg-slate-50"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      Upload COI
                    </button>
                  </Link>
                  <Link to="/reports">
                    <button 
                      className="w-full py-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center px-4 hover:bg-slate-50"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      Export compliance report
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    className="w-full py-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center px-4 grayscale opacity-70 cursor-not-allowed"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                    onClick={() => setIsPaywallOpen(true)}
                  >
                    Add new vendor
                    <Lock className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </button>
                  <button 
                    className="w-full py-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center px-4 opacity-60 cursor-not-allowed"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                    onClick={() => setIsPaywallOpen(true)}
                  >
                    Upload COI
                    <Lock className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </button>
                  <button 
                    className="w-full py-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center px-4 opacity-60 cursor-not-allowed"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                    onClick={() => setIsPaywallOpen(true)}
                  >
                    Export compliance report
                    <Lock className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div
            className="rounded-xl border p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h4 className="text-lg font-semibold tracking-tight mb-6">Recent alerts</h4>
            <div className="space-y-4">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-at-risk)' }} />
                  <span style={{ color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                    {alert.message}
                  </span>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-green-50/50 border border-green-100">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-compliant)' }} />
                  <span style={{ color: 'var(--foreground-muted)' }}>
                    No active alerts. All systems operational.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
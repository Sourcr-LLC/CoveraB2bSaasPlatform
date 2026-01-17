import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle2, Bell, Send, ArrowUpRight, Mail, Phone, Building2, Calendar, Clock, XCircle, RefreshCw, AlertCircle, Minus, Lock, FileText, FileCheck, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import PaywallModal from './PaywallModal';
import ContactSalesModal from './ContactSalesModal';
import { toast } from 'sonner';
import { supabase, vendorApi, contractApi } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { useSubscription } from '../hooks/useSubscription';
import { isDemoMode, demoVendors, demoContracts, getDemoStats } from '../lib/demoData';
import { KpiCard } from './dashboard/KpiCard';

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

// Helper function to calculate contract status client-side
function calculateContractStatus(endDate: string | undefined): string {
  if (!endDate || endDate === 'Invalid Date' || endDate.trim() === '') {
    return 'active'; // Assume active if no end date? Or maybe 'active' is default.
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return 'active';
  }

  const today = new Date();
  const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 60) { // Contracts often have longer lead times
    return 'expiring';
  } else {
    return 'active';
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [vendors, setVendors] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'insurance' | 'contracts'>('insurance');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if demo mode is enabled
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data');
        setVendors(demoVendors);
        setContracts(demoContracts);
        
        // Generate alerts from demo vendors and contracts
        const vendorAlerts = demoVendors
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
              message,
              source: 'insurance'
            };
          });

        const contractAlerts = demoContracts
          .filter((c: any) => c.status === 'expiring' || c.status === 'expired')
          .map((c: any) => {
             const expiryDate = c.endDate ? new Date(c.endDate) : null;
             const daysUntilExpiry = expiryDate 
               ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
               : -999;
             
             let message = '';
             if (c.status === 'expired') {
               message = `${c.contractName} expired ${Math.abs(daysUntilExpiry)} days ago`;
             } else {
               message = `${c.contractName} expires in ${daysUntilExpiry} days`;
             }
             
             return {
               id: c.id,
               vendorName: c.vendorName,
               type: c.status === 'expired' ? 'expired' : 'expiring',
               daysUntilExpiry,
               category: 'Contract',
               status: c.status === 'expired' ? 'non-compliant' : 'at-risk',
               message,
               source: 'contract'
             };
          });

        setAlerts([...vendorAlerts, ...contractAlerts]);
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
      
      // Fetch contracts from API
      let contractData = [];
      try {
        const contractResponse = await contractApi.getAll();
        contractData = contractResponse.contracts || [];
      } catch (err) {
        console.warn('Failed to fetch contracts, might not be implemented yet:', err);
      }
      
      // Calculate contract status
      const contractsWithStatus = contractData.map((contract: any) => ({
        ...contract,
        status: contract.status || calculateContractStatus(contract.endDate)
      }));
      setContracts(contractsWithStatus);

      console.log('🔍 RAW vendors from API:', vendorData);
      // Recalculate status for each vendor to ensure accuracy
      const vendorsWithUpdatedStatus = vendorData.map((vendor: any) => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);

      // Generate alerts from vendors
      const vendorAlerts = vendorsWithUpdatedStatus
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
            message,
            source: 'insurance'
          };
        });

      // Simple alerts for contracts (assuming we had real data)
      // For now just using vendors
      setAlerts(vendorAlerts);
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

  // Calculate stats from real data - memoized
  const stats = useMemo(() => ({
    total: vendors.length,
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length,
    // Contract stats
    activeContracts: contracts.filter(c => c.status === 'active').length,
    expiringContracts: contracts.filter(c => c.status === 'expiring').length,
    expiredContracts: contracts.filter(c => c.status === 'expired').length
  }), [vendors, contracts]);

  // Helper function to format status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'compliant': 'Compliant',
      'at-risk': 'At Risk',
      'non-compliant': 'Non-Compliant',
      'active': 'Active',
      'expiring': 'Expiring',
      'expired': 'Expired'
    };
    return labels[status] || status;
  };

  // Helper function to calculate days until expiry
  const calculateDaysLeft = (dateString: string | undefined) => {
    if (!dateString || dateString === 'Invalid Date') {
      return null;
    }
    const expiry = new Date(dateString);
    if (isNaN(expiry.getTime())) {
      return null;
    }
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Get high risk vendors (at-risk + non-compliant) - memoized
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

  // Get high risk contracts - memoized
  const highRiskContracts = useMemo(() => contracts
    .filter(c => c.status === 'expiring' || c.status === 'expired')
    .slice(0, 5)
    .map(c => {
      const daysLeft = calculateDaysLeft(c.endDate);
      return {
        ...c,
        name: c.contractName, // Map for table consistency
        vendorName: c.vendorName,
        statusLabel: getStatusLabel(c.status),
        expiryDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'No date',
        daysLeft: daysLeft
      };
    }), [contracts]);

  // Calculate upcoming expirations - memoized
  const expirations = useMemo(() => {
    const now = new Date();
    const allItems = [
      ...vendors.map(v => ({ date: v.insuranceExpiry, type: 'insurance' })),
      ...contracts.map(c => ({ date: c.endDate, type: 'contract' }))
    ];

    return {
      sevenDays: allItems.filter(item => {
        if (!item.date) return false;
        const expiry = new Date(item.date);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 7;
      }).length,
      fourteenDays: allItems.filter(item => {
        if (!item.date) return false;
        const expiry = new Date(item.date);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 7 && days <= 14;
      }).length,
      thirtyDays: allItems.filter(item => {
        if (!item.date) return false;
        const expiry = new Date(item.date);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 14 && days <= 30;
      }).length
    };
  }, [vendors, contracts]);

  const kpiCards = useMemo(() => {
    // Helper for small totals
    const showDeltas = stats.total >= 5;

    return [
      {
        label: 'Compliance Risk',
        value: stats.atRisk.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'expiring within 30 days',
        percentageColor: stats.atRisk > 0 ? '#f59e0b' : 'var(--foreground-muted)',
        bgTint: stats.atRisk > 0 ? 'rgba(245, 158, 11, 0.03)' : 'var(--card)',
        borderColor: stats.atRisk > 0 ? 'rgba(245, 158, 11, 0.2)' : 'var(--border)',
        isAtRisk: stats.atRisk > 0,
        icon: Shield
      },
      {
        label: 'Non-Compliant',
        value: stats.nonCompliant.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'expired policies',
        percentageColor: stats.nonCompliant > 0 ? '#ef4444' : 'var(--foreground-muted)',
        bgTint: stats.nonCompliant > 0 ? 'rgba(239, 68, 68, 0.03)' : 'var(--card)',
        borderColor: stats.nonCompliant > 0 ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)',
        icon: stats.nonCompliant > 0 ? AlertTriangle : undefined
      },
      {
        label: 'Active Contracts',
        value: stats.activeContracts.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'managed agreements',
        percentageColor: 'var(--primary)',
        bgTint: 'rgba(37, 99, 235, 0.03)',
        borderColor: 'rgba(37, 99, 235, 0.2)',
        icon: FileText
      },
      {
        label: 'Upcoming Milestones',
        value: stats.expiringContracts.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'contract renewals due',
        percentageColor: stats.expiringContracts > 0 ? '#f59e0b' : 'var(--foreground-muted)',
        bgTint: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        icon: Calendar
      },
    ];
  }, [stats]);

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
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.03) 0px, transparent 50%)' 
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
          <KpiCard
            key={index}
            label={card.label}
            value={card.value}
            change={card.change}
            trend={card.trend as 'up' | 'down' | 'neutral'}
            percentageColor={card.percentageColor}
            bgTint={card.bgTint}
            borderColor={card.borderColor}
            subtext={card.subtitle}
            isAtRisk={card.isAtRisk}
            icon={card.icon}
          />
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
            <div className="px-6 md:px-8 py-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="text-lg font-semibold tracking-tight mb-1">Attention Items</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Items requiring immediate action
                </p>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-[var(--panel)] p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'insurance' 
                      ? 'bg-white text-[var(--foreground)] shadow-sm' 
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Insurance
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'contracts' 
                      ? 'bg-white text-[var(--foreground)] shadow-sm' 
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Contracts
                </button>
              </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--panel)' }}>
                    <th className="px-8 py-5 text-left text-xs uppercase tracking-wider font-semibold whitespace-nowrap" style={{ color: 'var(--foreground-subtle)' }}>
                      {activeTab === 'insurance' ? 'Vendor' : 'Contract Name'}
                    </th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-wider font-semibold whitespace-nowrap" style={{ color: 'var(--foreground-subtle)' }}>
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-wider font-semibold whitespace-nowrap" style={{ color: 'var(--foreground-subtle)' }}>
                      Deadline
                    </th>
                    <th className="px-6 py-5 text-right text-xs uppercase tracking-wider font-semibold whitespace-nowrap" style={{ color: 'var(--foreground-subtle)' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'insurance' ? highRiskVendors : highRiskContracts).map((item, index) => (
                    <tr 
                      key={index}
                      className="border-t transition-colors hover:bg-slate-50/50"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>
                            {activeTab === 'insurance' ? item.name : item.contractName}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                            {activeTab === 'insurance' 
                              ? (item.missing > 0 ? `${item.missing} missing document${item.missing > 1 ? 's' : ''}` : item.category)
                              : item.vendorName
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk-bg)' 
                              : 'var(--status-non-compliant-bg)',
                            color: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk)'
                              : 'var(--status-non-compliant)',
                            borderColor: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk-border)' 
                              : 'var(--status-non-compliant-border)'
                          }}
                        >
                          {item.status === 'at-risk' || item.status === 'expiring' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {item.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {item.expiryDate}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                          {item.daysLeft === null 
                            ? 'No date' 
                            : item.daysLeft < 0 
                            ? `${Math.abs(item.daysLeft)} days overdue` 
                            : `${item.daysLeft} days left`}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right whitespace-nowrap">
                        <button 
                          className="text-sm px-4 py-2 rounded-lg border transition-all hover:bg-white hover:shadow-sm"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                          onClick={() => activeTab === 'insurance' ? handleSendReminder(item.id, item.name) : navigate(`/contracts/${item.id}`)}
                          disabled={activeTab === 'insurance' && sendingReminderId === item.id}
                        >
                          {activeTab === 'insurance' 
                            ? (sendingReminderId === item.id ? 'Sending...' : 'Send reminder')
                            : 'View Details'
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === 'insurance' ? highRiskVendors : highRiskContracts).length === 0 && (
                     <tr className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <td colSpan={4} className="px-8 py-12 text-center text-[var(--foreground-muted)]">
                           <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                           <p>No high-risk items found. You're all caught up!</p>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {(activeTab === 'insurance' ? highRiskVendors : highRiskContracts).map((item, index) => (
                <div 
                  key={index}
                  className="p-4"
                >
                  {/* Row 1: Name & Type */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                        {activeTab === 'insurance' ? item.name : item.contractName}
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)]">
                         {activeTab === 'insurance' ? item.vendorType : item.vendorName}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Expiry Date & Days Remaining */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Expires {item.expiryDate}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--foreground-subtle)' }}>
                        Days remaining
                      </div>
                      <div 
                        className="text-xl font-semibold tracking-tight"
                        style={{ 
                          color: item.daysLeft === null 
                            ? 'var(--foreground-muted)' 
                            : item.daysLeft < 0 
                            ? 'var(--status-non-compliant)' 
                            : item.daysLeft <= 7
                            ? 'var(--status-non-compliant)'
                            : 'var(--status-at-risk)'
                        }}
                      >
                        {item.daysLeft === null ? 'N/A' : item.daysLeft < 0 ? Math.abs(item.daysLeft) : item.daysLeft}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Actions */}
                  <div className="flex items-center justify-between gap-2">
                     <span
                          className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border"
                          style={{
                            backgroundColor: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk-bg)' 
                              : 'var(--status-non-compliant-bg)',
                            color: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk)'
                              : 'var(--status-non-compliant)',
                            borderColor: item.status === 'at-risk' || item.status === 'expiring'
                              ? 'var(--status-at-risk-border)' 
                              : 'var(--status-non-compliant-border)'
                          }}
                        >
                        {item.statusLabel}
                     </span>
                    <button 
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap flex-shrink-0"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--card)'
                      }}
                      onClick={() => activeTab === 'insurance' ? handleSendReminder(item.id, item.name) : navigate(`/contracts/${item.id}`)}
                      disabled={activeTab === 'insurance' && sendingReminderId === item.id}
                    >
                      {activeTab === 'insurance' 
                        ? (sendingReminderId === item.id ? 'Sending...' : 'Send reminder')
                        : 'View Details'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Deadlines & Quick Actions */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          {/* Upcoming Deadlines */}
          <div
            className="rounded-xl border p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-xl font-semibold tracking-tight mb-6">Upcoming Deadlines</h3>
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
            
            <div className="mt-8 pt-6 border-t flex gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <Link to="/insurance" className="flex-1">
                <button 
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:bg-opacity-80 border"
                  style={{ 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  Insurance View
                </button>
              </Link>
              <Link to="/contracts" className="flex-1">
                <button 
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:bg-opacity-80 border"
                  style={{ 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  Contracts View
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
            <h3 className="text-xl font-semibold tracking-tight mb-6">Quick actions</h3>
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
import { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle2, Bell, Send, ArrowUpRight, Mail, Phone, Building2, Calendar, Clock, XCircle, RefreshCw, AlertCircle, Minus, Lock, FileText, FileCheck, Shield, BarChart3, Plus, MoreHorizontal, CheckSquare, Square, Download, Check, ListChecks } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import PaywallModal from './PaywallModal';
import ContactSalesModal from './ContactSalesModal';
import { toast } from 'sonner';
import { supabase, vendorApi, contractApi, authApi } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { useSubscription } from '../hooks/useSubscription';
import { isDemoMode, demoVendors, demoContracts, getDemoStats } from '../lib/demoData';
import { KpiCard } from './dashboard/KpiCard';

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

// Helper function to calculate contract status client-side
function calculateContractStatus(endDate: string | undefined): string {
  if (!endDate || endDate === 'Invalid Date' || endDate.trim() === '') {
    return 'active'; 
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return 'active';
  }

  const today = new Date();
  const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 60) { 
    return 'expiring';
  } else {
    return 'active';
  }
}

// Helper to generate consistent colors for avatars based on name
function getAvatarColor(name: string) {
  // Neutral colors to reduce visual pollution (using slate/gray scales with consistent dark text)
  // Instead of random colors, we'll return a consistent neutral style
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [highlightAttentionItems, setHighlightAttentionItems] = useState(false);
  const attentionItemsRef = useRef<HTMLDivElement>(null);
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set());

  const [isAutomatedRemindersEnabled, setIsAutomatedRemindersEnabled] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterClick = (filterType: string, tab: 'insurance' | 'contracts', e?: React.MouseEvent | any) => {
    e?.stopPropagation?.();
    if (activeFilter === filterType) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterType);
      setActiveTab(tab);
    }
    setSelectedVendorIds(new Set()); // Clear selection on filter change
  };

  const handleSelectAll = () => {
    if (selectedVendorIds.size === filteredVendors.length && filteredVendors.length > 0) {
      setSelectedVendorIds(new Set());
    } else {
      setSelectedVendorIds(new Set(filteredVendors.map(v => v.id)));
    }
  };

  const handleSelectVendor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedVendorIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVendorIds(newSelected);
  };

  const handleBulkReminders = async () => {
    if (!isPremium) {
      setIsPaywallOpen(true);
      return;
    }
    if (selectedVendorIds.size === 0) return;
    
    const count = selectedVendorIds.size;
    toast.message(`Sending reminders to ${count} vendors...`);
    
    try {
      const promises = Array.from(selectedVendorIds).map(id => vendorApi.sendReminder(id));
      await Promise.allSettled(promises);
      toast.success(`Successfully sent ${count} reminders`);
      setSelectedVendorIds(new Set());
      
      // Refresh data to update activity feed
      loadData();
    } catch (error) {
      console.error("Bulk reminder error:", error);
      toast.error("Some reminders failed to send");
    }
  };

  const handleExport = () => {
    const dataToExport = filteredVendors.filter(v => selectedVendorIds.has(v.id));
    if (dataToExport.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Status,Expiry Date,Days Left\n"
        + dataToExport.map(v => `"${v.name}","${v.status}","${v.expiryDate}",${v.daysLeft}`).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export started");
  };

  const onboardingProgress = useMemo(() => {
    let completedSteps = 1; // Step 1: Account Created (Done)
    if (vendors.length > 0) completedSteps++; // Step 2: Add Vendor
    if (contracts.length > 0) completedSteps++; // Step 3: Add Contract
    
    const totalSteps = 3;
    return Math.round((completedSteps / totalSteps) * 100);
  }, [vendors, contracts]);

  const handleAutomateReminders = async () => {
    setIsAutomatedRemindersEnabled(true);
    toast.success('Automatic reminders enabled! Vendors will be notified 30 days before expiry.');
    
    if (isDemoMode()) {
      localStorage.setItem('covera_demo_automated_reminders', 'true');
    } else {
       try {
         await authApi.updateProfile({ automatedReminders: true });
       } catch (e) {
         console.error("Failed to save preference", e);
       }
    }
  };

  const loadData = async () => {
    try {
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data');
        if (localStorage.getItem('covera_demo_automated_reminders') === 'true') {
           setIsAutomatedRemindersEnabled(true);
        }
        setVendors(demoVendors);
        setContracts(demoContracts);
        
        const vendorAlerts = demoVendors
          .filter((v: any) => v.status === 'at-risk' || v.status === 'non-compliant')
          .map((v: any) => {
            const expiryDate = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
            const daysUntilExpiry = expiryDate 
              ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : -999;

            let message = '';
            if (v.status === 'non-compliant') {
                message = `${v.name} insurance expired`;
            } else if (v.status === 'at-risk') {
                message = `${v.name} insurance expires soon`;
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
              subtext: "Covera flagged this automatically and logged the issue for compliance records",
              source: 'insurance'
            };
          });

        const contractAlerts = demoContracts
          .filter((c: any) => c.status === 'expiring' || c.status === 'expired')
          .map((c: any) => {
             let message = '';
             if (c.status === 'expired') {
               message = `${c.contractName} expired`;
             } else {
               message = `${c.contractName} expires soon`;
             }
             
             return {
               id: c.id,
               vendorName: c.vendorName,
               type: c.status === 'expired' ? 'expired' : 'expiring',
               daysUntilExpiry: 0, 
               category: 'Contract',
               status: c.status === 'expired' ? 'non-compliant' : 'at-risk',
               message,
               subtext: "Covera flagged this automatically and logged the issue for compliance records",
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

      try {
         const profile = await authApi.getProfile();
         if (profile && profile.automatedReminders) {
           setIsAutomatedRemindersEnabled(true);
         }
      } catch (e) {
         console.warn("Failed to load profile (non-critical):", e);
      }

      const data = await vendorApi.getAll().catch(e => {
        console.warn('Failed to fetch vendors:', e);
        return { vendors: [] };
      });
      const vendorData = data.vendors || [];
      
      let contractData = [];
      try {
        const contractResponse = await contractApi.getAll();
        contractData = contractResponse.contracts || [];
      } catch (err) {
        console.warn('Failed to fetch contracts:', err);
      }
      
      const contractsWithStatus = contractData.map((contract: any) => ({
        ...contract,
        status: contract.status || calculateContractStatus(contract.endDate)
      }));
      setContracts(contractsWithStatus);

      const vendorsWithUpdatedStatus = vendorData.map((vendor: any) => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);

      const vendorAlerts = vendorsWithUpdatedStatus
        .filter((v: any) => v.status === 'at-risk' || v.status === 'non-compliant')
        .map((v: any) => {
          const expiryDate = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
          const daysUntilExpiry = expiryDate 
            ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : -999;

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

      setAlerts(vendorAlerts);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleSendReminder = async (vendorId: string, vendorName: string) => {
    if (!isPremium) {
      setIsPaywallOpen(true);
      return;
    }

    setSendingReminderId(vendorId);
    try {
      const result = await vendorApi.sendReminder(vendorId);
      toast.success(`Reminder sent to ${vendorName}!`);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reminder.');
    } finally {
      setSendingReminderId(null);
    }
  };

  const stats = useMemo(() => ({
    total: vendors.length,
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    expiringContracts: contracts.filter(c => c.status === 'expiring').length,
    expiredContracts: contracts.filter(c => c.status === 'expired').length
  }), [vendors, contracts]);

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

  const filteredVendors = useMemo(() => {
    let data = vendors;
    
    if (activeFilter === 'non-compliant') {
      data = data.filter(v => v.status === 'non-compliant');
    } else if (activeFilter === 'risk') {
      data = data.filter(v => v.status === 'at-risk');
    } else {
      // Default view: Show top 5 problematic first, then others if space
      data = data
        .sort((a, b) => {
          const statusOrder = { 'non-compliant': 0, 'at-risk': 1, 'compliant': 2 };
          return (statusOrder[a.status as keyof typeof statusOrder] || 2) - (statusOrder[b.status as keyof typeof statusOrder] || 2);
        })
        .slice(0, 6);
    }
    
    return data.map(v => ({
      ...v,
      statusLabel: getStatusLabel(v.status),
      expiryDate: v.insuranceExpiry && v.insuranceExpiry !== 'Invalid Date' ? new Date(v.insuranceExpiry).toLocaleDateString() : 'No date',
      daysLeft: calculateDaysLeft(v.insuranceExpiry)
    }));
  }, [vendors, activeFilter]);

  const filteredContracts = useMemo(() => {
    let data = contracts;

    if (activeFilter === 'active-contracts') {
      data = data.filter(c => c.status === 'active');
    } else if (activeFilter === 'upcoming') {
      data = data.filter(c => c.status === 'expiring' || c.status === 'expired');
    } else {
      data = data
        .sort((a, b) => {
          const statusOrder = { 'expired': 0, 'expiring': 1, 'active': 2 };
          return (statusOrder[a.status as keyof typeof statusOrder] || 2) - (statusOrder[b.status as keyof typeof statusOrder] || 2);
        })
        .slice(0, 6);
    }

    return data.map(c => ({
      ...c,
      name: c.contractName,
      vendorName: c.vendorName,
      statusLabel: getStatusLabel(c.status),
      expiryDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'No date',
      daysLeft: calculateDaysLeft(c.endDate)
    }));
  }, [contracts, activeFilter]);

  const kpiCards = useMemo(() => {
    return [
      {
        id: 'risk',
        label: 'Compliance Risk',
        value: stats.atRisk.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: stats.atRisk > 0 
          ? 'Acting now prevents coverage gaps' 
          : 'You’re protected from last-minute issues',
        percentageColor: stats.atRisk > 0 ? '#f59e0b' : '#059669',
        bgTint: stats.atRisk > 0 ? 'rgba(245, 158, 11, 0.03)' : 'var(--card)',
        borderColor: stats.atRisk > 0 ? 'rgba(245, 158, 11, 0.2)' : 'var(--border)',
        isAtRisk: stats.atRisk > 0,
        icon: Shield,
        targetTab: 'insurance' as const
      },
      {
        id: 'non-compliant',
        label: 'Non-Compliant',
        value: stats.nonCompliant.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: stats.nonCompliant > 0 
          ? 'Resolve to eliminate liability exposure' 
          : 'No gaps in coverage detected',
        percentageColor: stats.nonCompliant > 0 ? '#ef4444' : '#059669',
        bgTint: stats.nonCompliant > 0 ? 'rgba(239, 68, 68, 0.03)' : 'var(--card)',
        borderColor: stats.nonCompliant > 0 ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)',
        icon: stats.nonCompliant > 0 ? AlertTriangle : CheckCircle2,
        targetTab: 'insurance' as const
      },
      {
        id: 'active-contracts',
        label: 'Active Contracts',
        value: stats.activeContracts.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'Track contracts to avoid disputes',
        percentageColor: 'var(--primary)',
        bgTint: 'rgba(37, 99, 235, 0.03)',
        borderColor: 'rgba(37, 99, 235, 0.2)',
        icon: FileText,
        targetTab: 'contracts' as const
      },
      {
        id: 'upcoming',
        label: 'Upcoming Milestones',
        value: stats.expiringContracts.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: stats.expiringContracts > 0 
          ? 'Renewals requiring your review' 
          : 'No renewals or obligations due soon',
        percentageColor: stats.expiringContracts > 0 ? '#f59e0b' : 'var(--foreground-muted)',
        bgTint: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        icon: Calendar,
        targetTab: 'contracts' as const
      },
    ];
  }, [stats]);

  const riskDistribution = useMemo(() => {
    const counts = {
      low: vendors.filter(v => v.status === 'compliant').length,
      medium: vendors.filter(v => v.status === 'at-risk').length,
      high: vendors.filter(v => v.status === 'non-compliant').length,
    };

    return [
      { name: 'Compliant', value: counts.low, color: '#10b981', filterKey: 'compliant' }, 
      { name: 'At Risk', value: counts.medium, color: '#f59e0b', filterKey: 'risk' }, 
      { name: 'Non-Compliant', value: counts.high, color: '#ef4444', filterKey: 'non-compliant' }, 
    ].filter(item => item.value > 0);
  }, [vendors]);

  const complianceTrendData = useMemo(() => {
    if (vendors.length === 0) return [];
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date);
    }
    return months.map((date, index) => {
      const monthName = date.toLocaleString('default', { month: 'short' });
      const isCurrentMonth = index === months.length - 1;
      let compliantCount = 0;
      if (isCurrentMonth) {
        compliantCount = vendors.filter(v => v.status === 'compliant').length;
      } else {
        compliantCount = vendors.filter(v => {
          if (!v.insuranceExpiry || v.insuranceExpiry === 'Invalid Date') return false;
          const expiry = new Date(v.insuranceExpiry);
          return expiry > date; 
        }).length;
      }
      const rate = vendors.length > 0 ? Math.round((compliantCount / vendors.length) * 100) : 100;
      return { name: monthName, value: rate };
    });
  }, [vendors]);

  const trendColor = useMemo(() => {
    if (complianceTrendData.length === 0) return '#10b981';
    const lastValue = complianceTrendData[complianceTrendData.length - 1]?.value || 0;
    if (lastValue < 80) return '#ef4444';
    if (lastValue < 90) return '#f59e0b';
    return '#10b981';
  }, [complianceTrendData]);

  if (isPaywallOpen) {
    return <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />;
  }

  return (
    <div 
      onClick={() => activeFilter && setActiveFilter(null)}
      className="flex flex-col p-6 md:p-10 lg:p-12 min-h-screen pb-20 selection:bg-blue-100" 
      style={{ 
        backgroundColor: '#F9FAFB', // very light gray-blue
      }}
    >
      {/* Header */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex-none mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <h1 className="mb-2 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-base">
            Overview of your vendor compliance status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/add-vendor')} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#3A4F6A] text-white hover:bg-[#2c3e53] shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Action Banner */}
      {stats.nonCompliant > 0 && (
        <div onClick={(e) => e.stopPropagation()} className="flex-none mb-6 p-5 rounded-2xl bg-white border border-red-100 flex items-center justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {stats.nonCompliant} {stats.nonCompliant === 1 ? 'vendor is' : 'vendors are'} non-compliant
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resolve this now to reduce exposure and maintain audit readiness.
                </p>
              </div>
           </div>
           <button 
             onClick={(e) => handleFilterClick('non-compliant', 'insurance', e)}
             className="text-xs font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
           >
             Resolve issue →
           </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="flex-none grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpiCards.map((card, index) => (
          <button
            key={index}
            onClick={(e) => handleFilterClick(card.id, card.targetTab, e)}
            className={`text-left transition-all duration-300 rounded-2xl relative ${
              activeFilter === card.id 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:opacity-100'
            }`}
          >
            <KpiCard
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
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex-none grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 h-auto lg:h-[360px]">
         {/* Main Chart */}
         <div onClick={(e) => e.stopPropagation()} className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-7 flex flex-col hover:shadow-md transition-all duration-300 overflow-hidden z-0 h-[360px] lg:h-full group">
            <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="font-bold text-slate-900 text-lg">Compliance Trends</h3>
                 <p className="text-sm text-slate-500 mt-1 font-medium">6-month compliance rate history</p>
               </div>
            </div>
            <div className="flex-1 w-full min-h-[200px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={trendColor} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: trendColor, fontWeight: 700 }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="value" stroke={trendColor} strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Secondary Widget (Risk Distribution Donut) */}
         <div onClick={(e) => e.stopPropagation()} className="bg-white border border-slate-100 rounded-2xl p-7 flex flex-col hover:shadow-md transition-all duration-300 overflow-hidden z-0 h-[360px] lg:h-full group">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Risk Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px] lg:min-h-0 min-w-0">
               {riskDistribution.length > 0 ? (
                 <div className="flex flex-col w-full h-full gap-2">
                   <div className="flex-1 h-full min-h-[160px] min-w-0 -mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={riskDistribution}
                           innerRadius={70}
                           outerRadius={85}
                           paddingAngle={4}
                           dataKey="value"
                           stroke="none"
                           onClick={(data) => handleFilterClick(data.filterKey, 'insurance')}
                           className="cursor-pointer focus:outline-none"
                         >
                           {riskDistribution.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                           ))}
                           <Label
                             value={stats.total}
                             position="center"
                             className="text-3xl font-bold fill-slate-800 tracking-tighter"
                             dy={-10}
                           />
                           <Label
                             value="Vendors"
                             position="center"
                             className="text-xs fill-slate-400 font-bold uppercase tracking-widest"
                             dy={15}
                           />
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-6 pb-2">
                     {riskDistribution.map((item, index) => (
                       <div key={index} className="flex flex-col items-center text-center">
                         <div className="w-1.5 h-1.5 rounded-full mb-1.5" style={{ backgroundColor: item.color }} />
                         <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{item.name}</span>
                         <span className="font-bold text-slate-800 text-lg leading-none">{item.value}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                    <div className="w-20 h-20 rounded-full border-2 border-slate-100 flex items-center justify-center bg-slate-50/50">
                        <BarChart3 className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No distribution data</p>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Bottom Section: Table and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:h-[600px]">
        {/* High-risk Vendors Table */}
        <div className="w-full lg:col-span-2 lg:h-full lg:min-h-0">
          <div
            id="attention-items"
            ref={attentionItemsRef}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 bg-white flex flex-col h-full z-0 hover:shadow-md ${highlightAttentionItems ? 'ring-4 ring-red-100 border-red-300 shadow-lg scale-[1.01]' : 'border-slate-100'}`}
            style={{
              borderColor: highlightAttentionItems ? '#fca5a5' : undefined,
            }}
          >
            <div className="flex-none px-6 py-5 border-b border-slate-100 flex justify-between items-center relative">
              {selectedVendorIds.size > 0 && activeTab === 'insurance' ? (
                <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-6 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#3A4F6A] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {selectedVendorIds.size} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button
                       onClick={handleBulkReminders}
                       className="flex items-center gap-2 px-4 py-2 bg-[#3A4F6A] text-white text-xs font-bold rounded-xl hover:bg-[#2c3e53] transition-colors shadow-sm"
                     >
                       <Send className="w-3.5 h-3.5" />
                       Send Reminders
                     </button>
                     <button
                       onClick={handleExport}
                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                     >
                       <Download className="w-3.5 h-3.5" />
                       Export
                     </button>
                     <button
                       onClick={() => setSelectedVendorIds(new Set())}
                       className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1"
                     >
                       <XCircle className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">Attention Items</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Items requiring your immediate review
                </p>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'insurance' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Insurance
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'contracts' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Contracts
                </button>
              </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto flex-1 min-h-0">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {activeTab === 'insurance' && (
                      <th className="w-10 px-6 py-4">
                        <button 
                          onClick={handleSelectAll}
                          className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                           {selectedVendorIds.size === filteredVendors.length && filteredVendors.length > 0 ? (
                             <div className="bg-[#3A4F6A] rounded text-white"><CheckSquare className="w-4 h-4" /></div>
                           ) : (
                             <Square className="w-4 h-4" />
                           )}
                        </button>
                      </th>
                    )}
                    <th className={`${activeTab === 'insurance' ? 'pl-0 pr-6' : 'px-6'} py-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500`}>
                      {activeTab === 'insurance' ? 'Vendor' : 'Contract Name'}
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'insurance' ? filteredVendors : filteredContracts).map((item, index) => (
                    <tr 
                      key={item.id || index}
                      className={`group hover:bg-slate-50/80 transition-colors ${selectedVendorIds.has(item.id) ? 'bg-blue-50/40' : ''}`}
                    >
                      {activeTab === 'insurance' && (
                        <td className="w-10 px-6 py-4">
                           <button 
                             onClick={(e) => handleSelectVendor(item.id, e)}
                             className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                           >
                              {selectedVendorIds.has(item.id) ? (
                                <div className="bg-[#3A4F6A] rounded text-white"><CheckSquare className="w-4 h-4" /></div>
                              ) : (
                                <Square className="w-4 h-4 group-hover:text-slate-500" />
                              )}
                           </button>
                        </td>
                      )}
                      <td className={`${activeTab === 'insurance' ? 'pl-0 pr-6' : 'px-6'} py-4 whitespace-nowrap`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getAvatarColor(activeTab === 'insurance' ? item.name : item.vendorName)}`}>
                            {getInitials(activeTab === 'insurance' ? item.name : item.vendorName)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 mb-0.5">
                              {activeTab === 'insurance' ? item.name : item.contractName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {activeTab === 'insurance' 
                                ? item.category
                                : item.vendorName
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            item.status === 'compliant' || item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : item.status === 'at-risk' || item.status === 'expiring'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}
                        >
                          {item.status === 'compliant' || item.status === 'active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : item.status === 'at-risk' || item.status === 'expiring' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {item.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">
                            {item.expiryDate}
                          </span>
                          <span className={`text-[10px] ${
                             item.daysLeft !== null && item.daysLeft < 0 ? 'text-rose-500' : 
                             item.daysLeft !== null && item.daysLeft <= 30 ? 'text-amber-500' : 
                             'text-slate-400'
                          }`}>
                            {item.daysLeft === null 
                              ? '' 
                              : item.daysLeft < 0 
                              ? `${Math.abs(item.daysLeft)} days overdue` 
                              : `${item.daysLeft} days left`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          className="group/btn relative inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          onClick={() => activeTab === 'insurance' ? handleSendReminder(item.id, item.name) : navigate(`/contracts/${item.id}`)}
                          disabled={activeTab === 'insurance' && sendingReminderId === item.id}
                        >
                          {activeTab === 'insurance' 
                            ? (sendingReminderId === item.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send reminder</span>
                                </>
                              ))
                            : (
                              <>
                                <span>View Details</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </>
                            )
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === 'insurance' ? filteredVendors : filteredContracts).length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                           <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                             <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                           </div>
                           <p className="font-bold text-slate-900 mb-1 text-base">
                             All clear!
                           </p>
                           <p className="text-sm text-slate-500">
                             {activeTab === 'insurance' ? "No vendors require your attention right now." : "No contracts require your attention right now."}
                           </p>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {(activeTab === 'insurance' ? filteredVendors : filteredContracts).map((item, index) => (
                <div key={index} className="p-4 bg-white">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getAvatarColor(activeTab === 'insurance' ? item.name : item.vendorName)}`}>
                          {getInitials(activeTab === 'insurance' ? item.name : item.vendorName)}
                       </div>
                       <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {activeTab === 'insurance' ? item.name : item.contractName}
                          </div>
                          <div className="text-xs text-slate-500">
                             {activeTab === 'insurance' ? item.vendorType : item.vendorName}
                          </div>
                       </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                        item.status === 'compliant' || item.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : item.status === 'at-risk' || item.status === 'expiring'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pl-12">
                     <div className="text-xs text-slate-500">
                        Expires <span className="font-medium text-slate-700">{item.expiryDate}</span>
                     </div>
                     <button 
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => activeTab === 'insurance' ? handleSendReminder(item.id, item.name) : navigate(`/contracts/${item.id}`)}
                     >
                        {activeTab === 'insurance' ? 'Send reminder' : 'View Details'} &rarr;
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed - Right Column */}
        <div className="w-full lg:col-span-1 lg:h-full flex flex-col gap-6 lg:min-h-0">
          <div
            className="rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-all duration-300 overflow-hidden flex-1 flex flex-col min-h-0"
            style={{ borderColor: undefined }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-none px-6 py-5 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-bold text-slate-900 text-base">Recent Activity</h3>
               <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-lg">
                 <MoreHorizontal className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
               {alerts.map((alert, i) => (
                 <div key={i} className="p-4 hover:bg-slate-50 transition-colors group cursor-default">
                    <div className="flex gap-3">
                       <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          alert.type === 'expired' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                       }`}>
                          {alert.type === 'expired' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" /> }
                       </div>
                       <div>
                          <p className="text-sm font-medium text-slate-800 leading-snug mb-0.5">
                             {alert.message}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">
                             {alert.subtext}
                          </p>
                       </div>
                    </div>
                 </div>
               ))}
               {alerts.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                     <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                     <p className="text-sm">No recent activity</p>
                  </div>
               )}
            </div>
            <div className="flex-none bg-slate-50 p-3 border-t border-slate-100 text-center">
               <button 
                 onClick={() => navigate('/alerts')}
                 className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
               >
                  View all activity
               </button>
            </div>
          </div>

          {/* Tips Card or Onboarding */}
          {onboardingProgress < 100 ? (
            <div onClick={(e) => e.stopPropagation()} className="flex-none rounded-2xl bg-white border border-slate-100 p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="font-bold text-slate-900 mb-1">Account Setup</h4>
                   <p className="text-xs text-slate-500">Complete these steps to get full value.</p>
                 </div>
                 <div className="bg-blue-50 text-blue-700 font-bold text-xs px-2 py-1 rounded-full">
                   {onboardingProgress}%
                 </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm">
                   <div className="flex-none w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <Check className="w-3 h-3" />
                   </div>
                   <span className="text-slate-600 line-through">Create account</span>
                 </div>
                 
                 <div className={`flex items-center gap-3 text-sm ${vendors.length > 0 ? 'opacity-50' : ''}`}>
                   <div className={`flex-none w-5 h-5 rounded-full flex items-center justify-center ${vendors.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                     {vendors.length > 0 ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                   </div>
                   <span className={vendors.length > 0 ? 'text-slate-600 line-through' : 'text-slate-900 font-medium'}>
                     Add your first vendor
                   </span>
                 </div>

                 <div className={`flex items-center gap-3 text-sm ${contracts.length > 0 ? 'opacity-50' : ''}`}>
                   <div className={`flex-none w-5 h-5 rounded-full flex items-center justify-center ${contracts.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                     {contracts.length > 0 ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                   </div>
                   <span className={contracts.length > 0 ? 'text-slate-600 line-through' : 'text-slate-900 font-medium'}>
                     Add a contract
                   </span>
                 </div>
               </div>
               
               {(vendors.length === 0 || contracts.length === 0) && (
                 <button 
                   onClick={() => navigate(vendors.length === 0 ? '/add-vendor' : '/add-contract')}
                   className="mt-5 w-full py-2.5 bg-[#3A4F6A] text-white text-xs font-bold rounded-xl hover:bg-[#2c3e53] transition-colors flex items-center justify-center gap-2 shadow-sm"
                 >
                   Continue Setup <ArrowUpRight className="w-3 h-3" />
                 </button>
               )}
            </div>
          ) : (
          <div onClick={(e) => e.stopPropagation()} className="flex-none rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-md border border-blue-100 p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            {/* Background blobs to match design */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-blue-100/30 group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-indigo-100/30 group-hover:scale-105 transition-transform duration-700 delay-100"></div>
            
            <div className="relative z-10">
              <h4 className="font-semibold text-base mb-3 flex items-center gap-2.5 text-slate-800">
                 <Shield className="w-5 h-5 text-blue-600" /> 
                 Pro Tip
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                 Vendors with expiring insurance are 3x more likely to lapse if not reminded 30 days prior.
              </p>
              <button 
                onClick={handleAutomateReminders}
                disabled={isAutomatedRemindersEnabled}
                className={`text-sm font-medium w-full py-2.5 rounded-lg transition-all duration-200 border ${
                  isAutomatedRemindersEnabled 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 cursor-default' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                }`}
              >
                {isAutomatedRemindersEnabled ? 'Reminders Active' : 'Automate Reminders'}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
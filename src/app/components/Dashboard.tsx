import { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle2, Bell, Send, ArrowUpRight, Mail, Phone, Building2, Calendar, Clock, XCircle, RefreshCw, AlertCircle, Minus, Lock, FileText, FileCheck, Shield, BarChart3, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [highlightAttentionItems, setHighlightAttentionItems] = useState(false);
  const attentionItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveClick = () => {
    // Try by ref first, then fallback to ID
    if (attentionItemsRef.current) {
      attentionItemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightAttentionItems(true);
      setTimeout(() => setHighlightAttentionItems(false), 2000);
    } else {
      const element = document.getElementById('attention-items');
      if (element) {
         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

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
             // ... logic ...
             
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
               daysUntilExpiry: 0, // Placeholder
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
      console.log('📧 Sending reminder to vendor:', vendorId);
      const result = await vendorApi.sendReminder(vendorId);
      console.log('✅ Reminder sent successfully:', result);
      toast.success(`Reminder sent to ${vendorName}!`);
      
      await loadData();
    } catch (error: any) {
      console.error('❌ Failed to send reminder:', error);
      toast.error(error.message || 'Failed to send reminder. Please check console for details.');
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

  const highRiskContracts = useMemo(() => contracts
    .filter(c => c.status === 'expiring' || c.status === 'expired')
    .slice(0, 5)
    .map(c => {
      const daysLeft = calculateDaysLeft(c.endDate);
      return {
        ...c,
        name: c.contractName,
        vendorName: c.vendorName,
        statusLabel: getStatusLabel(c.status),
        expiryDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'No date',
        daysLeft: daysLeft
      };
    }), [contracts]);

  const kpiCards = useMemo(() => {
    return [
      {
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
        icon: Shield
      },
      {
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
        icon: stats.nonCompliant > 0 ? AlertTriangle : CheckCircle2
      },
      {
        label: 'Active Contracts',
        value: stats.activeContracts.toString(),
        change: undefined,
        trend: 'neutral',
        subtitle: 'Track contracts to avoid disputes',
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
        subtitle: stats.expiringContracts > 0 
          ? 'Renewals requiring your review' 
          : 'No renewals or obligations due soon',
        percentageColor: stats.expiringContracts > 0 ? '#f59e0b' : 'var(--foreground-muted)',
        bgTint: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        icon: Calendar
      },
    ];
  }, [stats]);

  // Calculate Risk Distribution - memoized
  const riskDistribution = useMemo(() => {
    const total = vendors.length || 1; 
    const counts = {
      low: vendors.filter(v => v.status === 'compliant').length,
      medium: vendors.filter(v => v.status === 'at-risk').length,
      high: vendors.filter(v => v.status === 'non-compliant').length,
    };

    return [
      { label: 'Low Risk', count: counts.low, color: 'bg-emerald-500', width: `${(counts.low / total) * 100}%` },
      { label: 'Medium Risk', count: counts.medium, color: 'bg-yellow-500', width: `${(counts.medium / total) * 100}%` },
      { label: 'High Risk', count: counts.high, color: 'bg-red-500', width: `${(counts.high / total) * 100}%` },
    ].filter(item => item.count > 0 || item.label === 'Low Risk');
  }, [vendors]);

  // Calculate Compliance Trends based on insurance expiry dates
  const complianceTrendData = useMemo(() => {
    if (vendors.length === 0) return [];

    const months = [];
    const today = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date);
    }

    return months.map((date, index) => {
      const monthName = date.toLocaleString('default', { month: 'short' });
      const isCurrentMonth = index === months.length - 1;
      
      let compliantCount = 0;

      if (isCurrentMonth) {
        // For current month, use the actual calculated status to ensure it matches KPIs
        compliantCount = vendors.filter(v => v.status === 'compliant').length;
      } else {
        // For past months, check against the date
        compliantCount = vendors.filter(v => {
          if (!v.insuranceExpiry || v.insuranceExpiry === 'Invalid Date') return false;
          const expiry = new Date(v.insuranceExpiry);
          // A vendor is compliant in a past month if their insurance hadn't expired yet
          return expiry > date; 
        }).length;
      }

      const rate = vendors.length > 0 ? Math.round((compliantCount / vendors.length) * 100) : 100;

      return {
        name: monthName,
        value: rate
      };
    });
  }, [vendors]);

  if (isPaywallOpen) {
    return <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 min-h-screen" style={{ 
      backgroundColor: 'var(--background)',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.03) 0px, transparent 50%)' 
    }}>
      {/* Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
            Real-time overview of your vendor compliance status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/add-vendor')} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#3A4F6A] text-white hover:bg-[#2c3e53] shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Action Banner */}
      {stats.nonCompliant > 0 && (
        <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">
                  {stats.nonCompliant} {stats.nonCompliant === 1 ? 'vendor is' : 'vendors are'} non-compliant
                </p>
                <p className="text-xs text-red-700">
                  Resolve this now to reduce exposure and maintain audit readiness.
                </p>
              </div>
           </div>
           <button 
             onClick={handleResolveClick}
             className="text-xs font-semibold bg-white text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
           >
             Resolve issue →
           </button>
        </div>
      )}

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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 h-auto lg:h-[320px]">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-white border border-[#e7e5e4] rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="font-bold text-slate-900">Compliance Trends</h3>
                 <p className="text-xs text-slate-500 mt-1">6-month compliance rate history</p>
               </div>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Secondary Widget (Risk Distribution) */}
         <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 flex flex-col shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Risk Distribution</h3>
            <div className="flex-1 flex items-center justify-center relative min-h-[200px] lg:min-h-0">
               <div className="w-full space-y-5">
                  {riskDistribution.map((item, index) => (
                    <RiskBar 
                      key={index}
                      label={item.label} 
                      count={item.count} 
                      color={item.color} 
                      width={item.width} 
                    />
                  ))}
                  {riskDistribution.length === 0 && (
                     <div className="text-center text-sm text-slate-400">No data available</div>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* High-risk Vendors Table */}
        <div className="lg:col-span-7">
          <div
            id="attention-items"
            ref={attentionItemsRef}
            className={`rounded-xl border overflow-hidden transition-all duration-500 ${highlightAttentionItems ? 'ring-4 ring-red-100 border-red-300 shadow-lg scale-[1.01]' : 'hover:shadow-lg'}`}
            style={{
              backgroundColor: 'var(--card)',
              borderColor: highlightAttentionItems ? '#fca5a5' : 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="px-6 md:px-8 py-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="text-lg font-semibold tracking-tight mb-1">Attention Items</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Items that could expose your organization to risk if left unresolved
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
                        {activeTab === 'insurance' && (
                          <div className="text-[10px] text-slate-400 mt-1.5 font-medium">
                            Automated follow-up logged
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(activeTab === 'insurance' ? highRiskVendors : highRiskContracts).length === 0 && (
                     <tr className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <td colSpan={4} className="px-8 py-12 text-center text-[var(--foreground-muted)]">
                           <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                           <p className="font-medium mb-1">
                             {activeTab === 'insurance' ? "You're not tracking any high-risk vendors." : "You're not tracking any expiring contracts."}
                           </p>
                           <p className="text-sm opacity-70">
                             {activeTab === 'insurance' ? "Uploading vendors helps prevent missed renewals and scope disputes." : "Covera will alert you automatically when something changes."}
                           </p>
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
                    
                    <div className="text-xs font-medium" style={{ 
                      color: item.daysLeft !== null && item.daysLeft < 0 ? 'var(--status-non-compliant)' : 
                             item.daysLeft !== null && item.daysLeft <= 30 ? 'var(--status-at-risk)' : 'var(--foreground-subtle)'
                    }}>
                      {item.daysLeft === null 
                        ? 'No date' 
                        : item.daysLeft < 0 
                        ? `${Math.abs(item.daysLeft)} days overdue` 
                        : `${item.daysLeft} days left`}
                    </div>
                  </div>

                  {/* Row 3: Status Badge & Action Button */}
                  <div className="flex items-center justify-between gap-3 mt-3">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
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

                    <button 
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-white hover:shadow-sm"
                      style={{ 
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                      onClick={() => activeTab === 'insurance' ? handleSendReminder(item.id, item.name) : navigate(`/contracts/${item.id}`)}
                      disabled={activeTab === 'insurance' && sendingReminderId === item.id}
                    >
                       {activeTab === 'insurance' 
                          ? (sendingReminderId === item.id ? 'Sending...' : 'Remind')
                          : 'Details'
                        }
                    </button>
                  </div>
                </div>
              ))}
              {(activeTab === 'insurance' ? highRiskVendors : highRiskContracts).length === 0 && (
                 <div className="p-8 text-center text-[var(--foreground-muted)]">
                   <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                   <p className="text-sm">No high-risk items found</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-5">
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="px-6 md:px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
               <div>
                <h3 className="text-lg font-semibold tracking-tight mb-1">Recent Activity</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Latest updates across your portfolio
                </p>
              </div>
              <button className="p-2 hover:bg-[var(--panel)] rounded-full transition-colors" style={{ color: 'var(--foreground-subtle)' }}>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0">
               {/* Activity Items would go here - using static for now as placeholder for dynamic */}
               <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {/* We can map alerts here if we want, or create a separate activity log */}
                  {alerts.slice(0, 5).map((alert, i) => (
                    <div key={i} className="p-4 md:px-8 hover:bg-[var(--panel)] transition-colors flex gap-4">
                       <div className="mt-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                             alert.type === 'expired' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                             {alert.type === 'expired' ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                             {alert.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                             Covera flagged this automatically and logged the issue for compliance records
                          </p>
                       </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                     <div className="p-8 text-center text-[var(--foreground-muted)]">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No recent activity</p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBar({ label, count, color, width }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900">{count}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  )
}
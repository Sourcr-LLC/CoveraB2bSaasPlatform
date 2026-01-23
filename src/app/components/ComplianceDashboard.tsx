import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, FileText, Download, Shield, Users, ArrowRight, Activity } from 'lucide-react';
import { supabase } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { isDemoMode, demoVendors } from '../lib/demoData';

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

export default function ComplianceDashboard() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      if (isDemoMode()) {
        setVendors(demoVendors);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        setLoading(false);
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
      
      // Recalculate status for each vendor to ensure accuracy
      const vendorsWithUpdatedStatus = vendorData.map((vendor: any) => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate compliance metrics from real data
  const stats = {
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length,
    total: vendors.length
  };

  const overallCompliance = stats.total > 0 
    ? ((stats.compliant / stats.total) * 100).toFixed(1)
    : '0.0';

  // Group by category
  const categoryMap = vendors.reduce((acc: any, v) => {
    const cat = v.category || 'General';
    if (!acc[cat]) {
      acc[cat] = { name: cat, compliant: 0, atRisk: 0, nonCompliant: 0, total: 0 };
    }
    acc[cat].total++;
    if (v.status === 'compliant') acc[cat].compliant++;
    else if (v.status === 'at-risk') acc[cat].atRisk++;
    else if (v.status === 'non-compliant') acc[cat].nonCompliant++;
    return acc;
  }, {});

  const complianceMetrics = {
    overall: parseFloat(overallCompliance),
    byCategory: Object.values(categoryMap).sort((a: any, b: any) => b.total - a.total),
  };

  const recentActivity = vendors.slice(0, 5).map((v, i) => {
    // Calculate time since last contact or creation
    let dateStr = v.lastContact || v.createdAt;
    // Fallback to now if no date available to avoid NaN
    if (!dateStr) dateStr = new Date().toISOString();
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Handle future dates or invalid calculations
    if (isNaN(diffMs) || diffMs < 0) {
       return {
          action: v.status === 'compliant' ? 'COI uploaded' : v.status === 'at-risk' ? 'Reminder sent' : 'Document expired',
          vendor: v.name,
          time: 'Just now',
          status: v.status
       };
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    let timeAgo;
    if (diffMins < 60) {
      timeAgo = diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      timeAgo = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else {
      timeAgo = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
    
    return {
      action: v.status === 'compliant' ? 'COI uploaded' : v.status === 'at-risk' ? 'Reminder sent' : 'Document expired',
      vendor: v.name,
      time: timeAgo,
      status: v.status
    };
  });

  const getCompliancePercentage = (category: any) => {
    return ((category.compliant / category.total) * 100).toFixed(0);
  };

  const handleExportReport = () => {
    try {
      if (vendors.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const headers = ['Name', 'Category', 'Status', 'Contact', 'Insurance Expiry', 'Last Contact'];
      const rows = vendors.map(v => [
        v.name || '',
        v.category || '',
        v.status || '',
        v.contactEmail || '',
        v.insuranceExpiry || '',
        v.lastContact || ''
      ].map(field => `"${field}"`).join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `compliance_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Audit report downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="flex flex-col h-full lg:h-screen lg:overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex-none mb-6 md:mb-8">
        <h1 className="mb-2 text-2xl md:text-3xl tracking-tight font-semibold text-slate-900">
          Compliance Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of vendor compliance status and risk analysis
        </p>
      </div>

      {/* Stats Cards - Clean & Settled */}
      <div className="flex-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        <div 
          className="rounded-2xl border border-blue-900/10 p-5 flex flex-col justify-between h-32 text-white shadow-md relative overflow-hidden"
          style={{ backgroundColor: '#3A4F6A' }}
        >
          {/* Decorative background circle */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          
          <div className="flex items-center gap-2 text-sm font-medium text-blue-100/90 relative z-10">
            <Activity className="w-4 h-4" />
            Overall Compliance
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold tracking-tight">{complianceMetrics.overall}%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Users className="w-4 h-4" />
            Total Vendors
          </div>
          <div className="text-4xl font-semibold text-slate-900">{stats.total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            At Risk
          </div>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-semibold text-slate-900">{stats.atRisk}</span>
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full border"
              style={{
                backgroundColor: 'var(--status-at-risk-bg)',
                color: 'var(--status-at-risk)',
                borderColor: 'var(--status-at-risk-border)'
              }}
            >
              Expiring Soon
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <XCircle className="w-4 h-4" />
            Action Required
          </div>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-semibold text-slate-900">{stats.nonCompliant}</span>
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full border"
              style={{
                backgroundColor: 'var(--status-non-compliant-bg)',
                color: 'var(--status-non-compliant)',
                borderColor: 'var(--status-non-compliant-border)'
              }}
            >
              Non-Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout for stability */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Category Performance Table */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-100 bg-[var(--card)] overflow-hidden shadow-sm h-full max-h-[calc(100vh-20rem)] lg:max-h-full">
          <div className="flex-none px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Category Performance</h3>
            <button 
              onClick={handleExportReport}
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-100 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendors</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Compliance Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {complianceMetrics.byCategory.map((category: any, index: number) => {
                  const percentage = parseInt(getCompliancePercentage(category));
                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Shield className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-700">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {category.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                percentage >= 90 ? 'bg-emerald-500' :
                                percentage >= 70 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-9 text-right">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {category.nonCompliant > 0 ? (
                          <span 
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border"
                            style={{
                              backgroundColor: 'var(--status-non-compliant-bg)',
                              color: 'var(--status-non-compliant)',
                              borderColor: 'var(--status-non-compliant-border)'
                            }}
                          >
                            {category.nonCompliant} Action Required
                          </span>
                        ) : category.atRisk > 0 ? (
                          <span 
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border"
                            style={{
                              backgroundColor: 'var(--status-at-risk-bg)',
                              color: 'var(--status-at-risk)',
                              borderColor: 'var(--status-at-risk-border)'
                            }}
                          >
                            {category.atRisk} Review Needed
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border"
                            style={{
                              backgroundColor: 'var(--status-compliant-bg)',
                              color: 'var(--status-compliant)',
                              borderColor: 'var(--status-compliant-border)'
                            }}
                          >
                            Compliant
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Activity & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full lg:min-h-0">
          <div className="flex-1 rounded-2xl border border-slate-100 bg-[var(--card)] overflow-hidden flex flex-col min-h-0 shadow-sm max-h-[400px] lg:max-h-none">
            <div className="flex-none px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              <button className="text-xs font-medium text-slate-500 hover:text-[#3A4F6A] transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="divide-y divide-slate-50 bg-white">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-slate-50/50 transition-colors flex gap-3.5 group">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${
                      activity.status === 'compliant' ? 'bg-emerald-500' :
                      activity.status === 'at-risk' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#3A4F6A] transition-colors">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {activity.vendor}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {recentActivity.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center px-4 bg-white">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">No recent activity</p>
                  <p className="text-xs text-slate-500 mt-1">Updates will appear here</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-none rounded-2xl border border-slate-100 bg-[var(--card)] p-6 shadow-sm bg-white">
             <div className="flex items-center gap-4 mb-5">
               <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-[#3A4F6A]">
                 <FileText className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-900">Export Report</h4>
                 <p className="text-xs text-slate-500 mt-0.5">Download full compliance audit CSV</p>
               </div>
             </div>
             <button 
               onClick={handleExportReport}
               className="w-full py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
               style={{ backgroundColor: '#3A4F6A' }}
             >
               <Download className="w-4 h-4" />
               Download CSV
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
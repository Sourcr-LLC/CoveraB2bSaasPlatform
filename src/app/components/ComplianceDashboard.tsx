import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, FileText, Download, Mail, Calendar, Clock, AlertCircle, Shield } from 'lucide-react';
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
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isDemoMode()) {
        setVendors(demoVendors);
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
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    }
  };

  // Calculate compliance metrics from real data
  const stats = {
    compliant: vendors.filter(v => v.status === 'compliant').length,
    atRisk: vendors.filter(v => v.status === 'at-risk').length,
    nonCompliant: vendors.filter(v => v.status === 'non-compliant').length,
    total: vendors.length
  };

  console.log('📈 FINAL Stats:', stats);
  console.log('🎯 Overall Compliance:', stats.total > 0 ? ((stats.compliant / stats.total) * 100).toFixed(1) : '0.0');

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
    byCategory: Object.values(categoryMap),
  };

  const recentActivity = vendors.slice(0, 5).map((v, i) => {
    // Calculate time since last contact or creation
    const date = v.lastContact ? new Date(v.lastContact) : new Date(v.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
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
    return ((category.compliant / category.total) * 100).toFixed(1);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="mb-3 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Compliance Dashboard</h1>
        <p className="text-base" style={{ color: 'var(--foreground-muted)' }}>
          Organization-wide compliance status and coverage analysis
        </p>
      </div>

      {/* Overall Compliance Score */}
      <div 
        className="rounded-xl border p-10 mb-8"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
              Overall Compliance Rate
            </div>
            <div className="flex items-baseline gap-4 mb-3">
              <div className="text-6xl tracking-tight" style={{ color: 'var(--status-compliant)' }}>
                {complianceMetrics.overall}%
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {stats.total} total {stats.total === 1 ? 'vendor' : 'vendors'} tracked across all categories
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl tracking-tight mb-2" style={{ color: 'var(--status-compliant)' }}>{stats.compliant}</div>
              <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl tracking-tight mb-2" style={{ color: 'var(--status-at-risk)' }}>{stats.atRisk}</div>
              <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl tracking-tight mb-2" style={{ color: 'var(--status-non-compliant)' }}>{stats.nonCompliant}</div>
              <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Non-Compliant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Compliance by Category */}
        <div className="lg:col-span-8">
          <div 
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-lg">Compliance by insurance category</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                Detailed breakdown of coverage status across all insurance types
              </p>
            </div>

            <div className="p-8 space-y-6">
              {complianceMetrics.byCategory.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" style={{ color: 'var(--foreground-subtle)' }} />
                      <h4 className="text-base">{category.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: 'var(--foreground-muted)' }}>
                        {category.total} vendors
                      </span>
                      <span style={{ color: 'var(--status-compliant)' }}>
                        {getCompliancePercentage(category)}% compliant
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--panel)' }}>
                    <div 
                      className="transition-all"
                      style={{ 
                        width: `${(category.compliant / category.total) * 100}%`,
                        backgroundColor: 'var(--status-compliant)'
                      }}
                    />
                    <div 
                      className="transition-all"
                      style={{ 
                        width: `${(category.atRisk / category.total) * 100}%`,
                        backgroundColor: 'var(--status-at-risk)'
                      }}
                    />
                    <div 
                      className="transition-all"
                      style={{ 
                        width: `${(category.nonCompliant / category.total) * 100}%`,
                        backgroundColor: 'var(--status-non-compliant)'
                      }}
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-compliant)' }} />
                      <span style={{ color: 'var(--foreground-muted)' }}>{category.compliant} Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-at-risk)' }} />
                      <span style={{ color: 'var(--foreground-muted)' }}>{category.atRisk} At Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-non-compliant)' }} />
                      <span style={{ color: 'var(--foreground-muted)' }}>{category.nonCompliant} Non-Compliant</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Summary */}
          <div 
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-lg mb-6">Risk summary</h3>
            
            <div className="space-y-5">
              <div 
                className="p-5 rounded-lg"
                style={{ backgroundColor: 'var(--status-non-compliant-bg)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-non-compliant)' }} />
                  <span className="text-sm" style={{ color: 'var(--status-non-compliant)' }}>High Risk</span>
                </div>
                <div className="text-2xl tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>{stats.nonCompliant}</div>
                <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  Vendors with expired or missing coverage
                </div>
              </div>

              <div 
                className="p-5 rounded-lg"
                style={{ backgroundColor: 'var(--status-at-risk-bg)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5" style={{ color: 'var(--status-at-risk)' }} />
                  <span className="text-sm" style={{ color: 'var(--status-at-risk)' }}>Medium Risk</span>
                </div>
                <div className="text-2xl tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>{stats.atRisk}</div>
                <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  Vendors with coverage expiring soon
                </div>
              </div>

              <div 
                className="p-5 rounded-lg"
                style={{ backgroundColor: 'var(--status-compliant-bg)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-compliant)' }} />
                  <span className="text-sm" style={{ color: 'var(--status-compliant)' }}>Low Risk</span>
                </div>
                <div className="text-2xl tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>{stats.compliant}</div>
                <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                  Vendors with current, valid coverage
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-lg mb-6">Recent activity</h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2"
                    style={{ 
                      backgroundColor: 
                        activity.status === 'compliant' ? 'var(--status-compliant)' :
                        activity.status === 'at-risk' ? 'var(--status-at-risk)' :
                        'var(--status-non-compliant)'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      {activity.action}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                      {activity.vendor}  {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="w-full mt-6 py-2.5 rounded-lg text-sm transition-all"
              style={{ 
                backgroundColor: 'var(--panel)',
                color: 'var(--foreground)'
              }}
            >
              View all activity
            </button>
          </div>

          {/* Quick Actions */}
          <div 
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h4 className="mb-5">Compliance actions</h4>
            <div className="space-y-3">
              <button 
                className="w-full py-3 rounded-lg text-sm transition-all text-left px-4 flex items-center gap-3"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                <FileText className="w-4 h-4" />
                Export audit report
              </button>
              <button 
                className="w-full py-3 rounded-lg border text-sm transition-all text-left px-4 flex items-center gap-3"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <Shield className="w-4 h-4" />
                Review requirements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
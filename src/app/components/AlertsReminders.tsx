import { useState, useEffect } from 'react';
import { Bell, Send, AlertTriangle, Clock, TrendingUp, Filter, Search, Calendar, Mail, Settings as SettingsIcon, CheckCircle2, Shield, FileText, ChevronRight, X } from 'lucide-react';
import { supabase, contractApi } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { isDemoMode, demoVendors, demoContracts } from '../lib/demoData';

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// Helper function to calculate days until expiry
function calculateDaysUntilExpiry(insuranceExpiry: string | undefined): number | null {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return null;
  }
  
  const expiryDate = new Date(insuranceExpiry);
  if (isNaN(expiryDate.getTime())) {
    return null;
  }
  
  const today = new Date();
  return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Helper function to calculate vendor status client-side (matching Dashboard logic)
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

// Helper function to get time ago
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const sentTime = new Date(timestamp);
  const diffMs = now.getTime() - sentTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

export default function AlertsReminders() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [sentReminders, setSentReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial State for settings
  const [settings, setSettings] = useState({
    schedule: [
      { id: '30_days', days: 30, enabled: true, label: '30 days before expiration' },
      { id: '14_days', days: 14, enabled: true, label: '14 days before expiration' },
      { id: '7_days', days: 7, enabled: true, label: '7 days before expiration' },
      { id: '1_day', days: 1, enabled: false, label: '1 day before expiration' },
    ],
    sendTime: '8:00 AM',
    timezone: 'EST',
    escalation: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Check for demo mode
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data for Alerts');
        setVendors(demoVendors);
        setContracts(demoContracts);
        
        // Mock sent reminders
        const demoReminders = [
          {
            vendorName: 'Rapid Delivery Logistics',
            message: 'Reminder email sent to vendor regarding insurance expiry',
            sentAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            status: 'delivered',
            opened: true
          },
          {
            vendorName: 'Elite HVAC Services',
            message: 'Reminder email sent to vendor regarding expired COI',
            sentAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            status: 'delivered',
            opened: false
          },
          {
            vendorName: 'SafeGuard Security Systems',
            message: 'Reminder email sent to vendor regarding contract renewal',
            sentAt: new Date(Date.now() - 86400000 * 12).toISOString(), // 12 days ago
            status: 'delivered',
            opened: true
          }
        ];
        setSentReminders(demoReminders);
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
      const vendorsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/vendors`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!vendorsResponse.ok) {
        throw new Error('Failed to fetch vendors');
      }

      const vendorsData = await vendorsResponse.json();
      const vendorData = vendorsData.vendors || [];
      setVendors(vendorData);

      // Fetch contracts
      try {
        const contractResponse = await contractApi.getAll();
        setContracts(contractResponse.contracts || []);
      } catch (err) {
        console.warn('Failed to fetch contracts:', err);
      }

      // Fetch sent reminders from API
      const remindersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/reminders`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json();
        setSentReminders(remindersData.reminders || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats from vendor data
  const vendorsWithExpiry = vendors.filter(v => v.insuranceExpiry && v.insuranceExpiry !== 'Invalid Date');
  const vendorsExpiringSoon = vendorsWithExpiry.filter(v => {
    const days = calculateDaysUntilExpiry(v.insuranceExpiry);
    return days !== null && days >= 0 && days <= 30;
  });

  // Generate Active Compliance Alerts
  const activeAlerts = [
    ...vendors.map(v => ({...v, status: calculateVendorStatus(v.insuranceExpiry)}))
      .filter(v => v.status === 'at-risk' || v.status === 'non-compliant')
      .map(v => {
        const days = calculateDaysUntilExpiry(v.insuranceExpiry);
        let message = '';
        if (v.status === 'non-compliant') {
           message = days && days < 0 ? `Insurance expired ${Math.abs(days)} days ago` : 'Insurance has expired';
        } else {
           message = days === 0 ? 'Insurance expires today' : `Insurance expires in ${days} days`;
        }
        return {
          id: v.id,
          title: v.name,
          message,
          type: v.status === 'non-compliant' ? 'expired' : 'expiring',
          date: v.insuranceExpiry,
          category: 'Insurance',
          icon: Shield,
        };
      }),
    ...contracts.map(c => ({...c, status: c.status || calculateContractStatus(c.endDate)}))
      .filter(c => c.status === 'expiring' || c.status === 'expired')
      .map(c => ({
        id: c.id,
        title: c.contractName,
        message: c.status === 'expired' ? 'Contract has expired' : 'Contract expires soon',
        type: c.status === 'expired' ? 'expired' : 'expiring',
        date: c.endDate,
        category: 'Contract',
        icon: FileText,
      }))
  ].sort((a, b) => {
    // Sort by urgency: expired first, then expiring soon
    if (a.type === 'expired' && b.type !== 'expired') return -1;
    if (a.type !== 'expired' && b.type === 'expired') return 1;
    return 0;
  });

  // Generate upcoming reminders from real vendor data
  const upcomingReminders = vendorsExpiringSoon
    .map(v => {
      const days = calculateDaysUntilExpiry(v.insuranceExpiry);
      if (days === null) return null;
      
      let reminderType = '';
      if (days <= 1 && days >= 0) reminderType = '1-day reminder';
      else if (days <= 7 && days > 1) reminderType = '7-day reminder';
      else if (days <= 14 && days > 7) reminderType = '14-day reminder';
      else if (days <= 30 && days > 14) reminderType = '30-day reminder';
      
      return {
        vendor: v.name,
        type: reminderType,
        scheduled: days === 0 ? 'Today' : days === 1 ? 'Tomorrow, 8:00 AM' : `${days} days, 8:00 AM`,
        daysUntilExpiry: days
      };
    })
    .filter(r => r !== null)
    .sort((a, b) => (a?.daysUntilExpiry || 0) - (b?.daysUntilExpiry || 0))
    .slice(0, 5);

  const toggleSetting = (index: number) => {
    const newSchedule = [...settings.schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    setSettings({...settings, schedule: newSchedule});
  };

  return (
    <div className="flex flex-col h-full lg:h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex-none px-6 pt-8 pb-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
          Alerts & Reminders
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Automated notification system for vendor compliance and expiring insurance
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 p-6 md:p-8 pt-0 overflow-hidden">
        
        {/* Sidebar: Settings & Upcoming */}
        <div className="w-full lg:w-96 flex-none flex flex-col gap-6 overflow-hidden">
          <ScrollArea className="h-full pr-4 -mr-4">
            <div className="flex flex-col gap-6 pb-6">
              {/* Reminder Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reminder settings</CardTitle>
                  <CardDescription>Configure automated schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Schedule</div>
                    {settings.schedule.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                            {item.enabled ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <label htmlFor={item.id} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.enabled ? 'text-slate-900' : 'text-slate-500'}`}>
                            {item.label}
                          </label>
                        </div>
                        <Switch
                          id={item.id}
                          checked={item.enabled}
                          onCheckedChange={() => toggleSetting(index)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500">Send time</span>
                       <span className="font-medium text-slate-900">{settings.sendTime}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500">Timezone</span>
                       <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-600">
                         {settings.timezone}
                       </span>
                     </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <div className="text-sm font-medium text-slate-900">Internal escalation</div>
                       <div className="text-xs text-slate-500">Alert team after 7 days</div>
                     </div>
                     <Switch checked={settings.escalation} onCheckedChange={(checked) => setSettings({...settings, escalation: checked})} />
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Reminders Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingReminders.length > 0 ? (
                    upcomingReminders.map((reminder, index) => (
                      <div key={index} className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{reminder.vendor}</span>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center"
                            style={{ 
                              backgroundColor: 'var(--status-at-risk-bg)', 
                              color: 'var(--status-at-risk)' 
                            }}
                          >
                             {reminder.daysUntilExpiry} days
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>Scheduled: {reminder.scheduled}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                       <div className="mb-2 rounded-full bg-slate-100 p-3">
                         <CheckCircle2 className="h-6 w-6 text-slate-400" />
                       </div>
                       <p className="text-sm font-medium text-slate-900">All caught up</p>
                       <p className="text-xs text-slate-500">No upcoming reminders</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Active Alerts & History */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
          
          {/* Active Alerts List */}
          <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-slate-200 shadow-sm">
             <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 bg-white py-4">
               <div className="space-y-1">
                 <CardTitle>Active Alerts</CardTitle>
                 <CardDescription>Compliance issues requiring attention</CardDescription>
               </div>
               {activeAlerts.length > 0 && (
                 <span 
                   className="px-3 py-1 rounded-full text-xs font-medium"
                   style={{ 
                     backgroundColor: 'var(--status-non-compliant-bg)', 
                     color: 'var(--status-non-compliant)' 
                   }}
                 >
                   {activeAlerts.length} Issues
                 </span>
               )}
             </CardHeader>
             
             <div className="flex-1 min-h-0 bg-white">
               <ScrollArea className="h-full">
                 <div className="p-0">
                   {activeAlerts.length > 0 ? (
                     <div className="divide-y divide-slate-100">
                       {activeAlerts.map((alert, index) => (
                         <div key={index} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                           <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                             alert.type === 'expired' 
                               ? 'border-red-100 bg-red-50 text-red-600' 
                               : 'border-amber-100 bg-amber-50 text-amber-600'
                           }`}>
                             <alert.icon className="h-4 w-4" />
                           </div>
                           <div className="flex-1 min-w-0 space-y-1">
                             <div className="flex items-center justify-between gap-2">
                               <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                               <span 
                                 className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                                 style={{ 
                                   backgroundColor: alert.type === 'expired' ? 'var(--status-non-compliant-bg)' : 'var(--status-at-risk-bg)', 
                                   color: alert.type === 'expired' ? 'var(--status-non-compliant)' : 'var(--status-at-risk)' 
                                 }}
                               >
                                 {alert.type === 'expired' ? 'Action Required' : 'Attention'}
                               </span>
                             </div>
                             <p className="text-sm text-slate-500">{alert.message}</p>
                             <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                               <span className="flex items-center gap-1">
                                 <Calendar className="h-3 w-3" />
                                 {alert.date ? new Date(alert.date).toLocaleDateString() : 'N/A'}
                               </span>
                               <span>•</span>
                               <span className="font-medium">{alert.category}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                       <div className="mb-4 rounded-full bg-emerald-50 p-4">
                         <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                       </div>
                       <h3 className="text-lg font-semibold text-slate-900">All Systems Normal</h3>
                       <p className="text-sm text-slate-500">No active compliance alerts requiring attention.</p>
                     </div>
                   )}
                 </div>
               </ScrollArea>
             </div>
          </Card>

          {/* Notification History */}
          <Card className="flex-none h-72 flex flex-col overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-white py-4">
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Recent automated emails</CardDescription>
            </CardHeader>
            <div className="flex-1 min-h-0 bg-white">
              <ScrollArea className="h-full">
                <div className="p-0">
                  {sentReminders.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {sentReminders.map((reminder, index) => (
                        <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              reminder.status === 'delivered' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-red-100 bg-red-50 text-red-500'
                            }`}>
                              <Mail className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-sm font-medium text-slate-900 truncate">{reminder.vendorName}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="truncate max-w-[200px]">{reminder.message}</span>
                                <span>•</span>
                                <span>{getTimeAgo(reminder.sentAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pl-4">
                             {reminder.opened && (
                               <span 
                                 className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium"
                                 style={{ 
                                   backgroundColor: 'rgba(58, 79, 106, 0.08)', 
                                   color: '#3A4F6A' 
                                 }}
                               >
                                 Opened
                               </span>
                             )}
                             <span 
                               className="px-3 py-1 rounded-full text-xs font-medium"
                               style={{ 
                                 backgroundColor: reminder.status === 'delivered' ? 'var(--status-compliant-bg)' : 'var(--status-non-compliant-bg)', 
                                 color: reminder.status === 'delivered' ? 'var(--status-compliant)' : 'var(--status-non-compliant)' 
                               }}
                             >
                               {reminder.status === 'delivered' ? 'Sent' : 'Failed'}
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Mail className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500">No recent notifications</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
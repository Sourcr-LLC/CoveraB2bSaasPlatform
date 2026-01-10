import { useState, useEffect } from 'react';
import { Bell, Send, AlertTriangle, Clock, TrendingUp, Filter, Search, Calendar, Mail, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { isDemoMode, demoVendors } from '../lib/demoData';

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
  const [sentReminders, setSentReminders] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check for demo mode
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data for Alerts');
        setVendors(demoVendors);
        
        // Mock sent reminders
        const demoReminders = [
          {
            vendorName: 'Rapid Delivery Logistics',
            message: 'Reminder email sent to vendor',
            sentAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            status: 'delivered',
            opened: true
          },
          {
            vendorName: 'Elite HVAC Services',
            message: 'Reminder email sent to vendor',
            sentAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            status: 'delivered',
            opened: false
          },
          {
            vendorName: 'SafeGuard Security Systems',
            message: 'Reminder email sent to vendor',
            sentAt: new Date(Date.now() - 86400000 * 12).toISOString(), // 12 days ago
            status: 'delivered',
            opened: true
          }
        ];
        setSentReminders(demoReminders);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
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
    }
  };

  // Calculate real stats from vendor data
  const vendorsWithExpiry = vendors.filter(v => v.insuranceExpiry && v.insuranceExpiry !== 'Invalid Date');
  const vendorsExpiringSoon = vendorsWithExpiry.filter(v => {
    const days = calculateDaysUntilExpiry(v.insuranceExpiry);
    return days !== null && days >= 0 && days <= 30;
  });

  // Generate upcoming reminders from real vendor data (vendors expiring in next 30 days)
  const upcomingReminders = vendorsExpiringSoon
    .map(v => {
      const days = calculateDaysUntilExpiry(v.insuranceExpiry);
      if (days === null) return null;
      
      // Calculate which reminder type this would be
      let reminderType = '';
      let reminderDays = 0;
      if (days <= 1 && days >= 0) {
        reminderType = '1-day reminder';
        reminderDays = 1;
      } else if (days <= 7 && days > 1) {
        reminderType = '7-day reminder';
        reminderDays = 7;
      } else if (days <= 14 && days > 7) {
        reminderType = '14-day reminder';
        reminderDays = 14;
      } else if (days <= 30 && days > 14) {
        reminderType = '30-day reminder';
        reminderDays = 30;
      }
      
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

  // Map sent reminders from backend to display format with real-time dates
  const recentReminders = sentReminders
    .map(reminder => {
      // Determine reminder type from message
      let reminderType = 'Reminder sent';
      if (reminder.message?.includes('email sent')) {
        reminderType = 'Email reminder';
      } else if (reminder.message?.includes('email not configured')) {
        reminderType = 'Reminder (email not configured)';
      } else if (reminder.message?.includes('email delivery failed')) {
        reminderType = 'Reminder (delivery failed)';
      }
      
      return {
        vendor: reminder.vendorName,
        type: reminderType,
        sent: getTimeAgo(reminder.sentAt),
        status: reminder.status,
        opened: reminder.opened,
        sentAt: reminder.sentAt
      };
    })
    .slice(0, 10);

  const reminderSettings = {
    enabled: true,
    schedule: [
      { days: 30, enabled: true, label: '30 days before expiration' },
      { days: 14, enabled: true, label: '14 days before expiration' },
      { days: 7, enabled: true, label: '7 days before expiration' },
      { days: 1, enabled: false, label: '1 day before expiration' },
    ],
    sendTime: '8:00 AM',
    timezone: 'America/New_York (EST)',
    escalation: true,
    escalationDays: 7,
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="mb-3 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Alerts & Reminders</h1>
        <p className="text-base" style={{ color: 'var(--foreground-muted)' }}>
          Automated notification system for vendor compliance and expiring insurance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reminder Settings */}
        <div className="lg:col-span-5">
          <div 
            className="rounded-xl border p-8 mb-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg mb-2">Reminder settings</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Configure automated reminder schedule
                </p>
              </div>
              <button 
                className="px-4 py-2 rounded-lg border text-sm transition-all inline-flex items-center gap-2"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <SettingsIcon className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Reminder Schedule */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                  Reminder schedule
                </div>
                <div className="space-y-3">
                  {reminderSettings.schedule.map((reminder, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: 'var(--panel)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: reminder.enabled ? 'var(--status-compliant-bg)' : 'var(--background)',
                            border: `1px solid ${reminder.enabled ? 'var(--status-compliant-border)' : 'var(--border)'}`
                          }}
                        >
                          {reminder.enabled ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-compliant)' }} />
                          ) : (
                            <Clock className="w-5 h-5" style={{ color: 'var(--foreground-subtle)' }} />
                          )}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {reminder.label}
                        </span>
                      </div>
                      <div 
                        className="w-11 h-6 rounded-full transition-all cursor-pointer"
                        style={{ 
                          backgroundColor: reminder.enabled ? 'var(--status-compliant)' : 'var(--border)'
                        }}
                      >
                        <div 
                          className="w-5 h-5 bg-white rounded-full transition-all mt-0.5"
                          style={{ 
                            marginLeft: reminder.enabled ? '1.25rem' : '0.125rem'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Time */}
              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    Send time
                  </span>
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {reminderSettings.sendTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    Timezone
                  </span>
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {reminderSettings.timezone}
                  </span>
                </div>
              </div>

              {/* Escalation */}
              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      Internal escalation
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      Alert team after {reminderSettings.escalationDays} days with no response
                    </div>
                  </div>
                  <div 
                    className="w-11 h-6 rounded-full transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: reminderSettings.escalation ? 'var(--status-compliant)' : 'var(--border)'
                    }}
                  >
                    <div 
                      className="w-5 h-5 bg-white rounded-full transition-all mt-0.5"
                      style={{ 
                        marginLeft: reminderSettings.escalation ? '1.25rem' : '0.125rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div 
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="text-lg mb-6">Upcoming reminders</h3>
            <div className="space-y-4">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map((reminder, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm">{reminder.vendor}</h4>
                      <span 
                        className="inline-flex items-center justify-center text-center text-xs px-2.5 py-1 rounded-full leading-none"
                        style={{ 
                          backgroundColor: 'var(--status-at-risk-bg)',
                          color: 'var(--status-at-risk)'
                        }}
                      >
                        {reminder.type}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                      Scheduled: {reminder.scheduled}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--status-compliant)' }} />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    No upcoming reminders scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Vendor Compliance Summary */}
        <div className="lg:col-span-7">
          <div 
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-lg">Recent reminders</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                Delivery status and engagement tracking
              </p>
            </div>

            <div className="p-8">
              {recentReminders.length > 0 ? (
                <div className="space-y-3">
                  {recentReminders.map((reminder, index) => (
                    <div 
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-lg border gap-3"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ 
                            backgroundColor: reminder.status === 'delivered' 
                              ? 'var(--status-compliant-bg)' 
                              : 'var(--status-non-compliant-bg)',
                            border: `1px solid ${reminder.status === 'delivered' 
                              ? 'var(--status-compliant-border)' 
                              : 'var(--status-non-compliant-border)'}`
                          }}
                        >
                          <Mail className="w-5 h-5" style={{ 
                            color: reminder.status === 'delivered' 
                              ? 'var(--status-compliant)' 
                              : 'var(--status-non-compliant)' 
                          }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm mb-1 truncate" style={{ color: 'var(--foreground)' }}>
                            {reminder.vendor}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                            <span className="truncate">{reminder.type}</span>
                            <span className="flex-shrink-0">•</span>
                            <span className="flex-shrink-0">{reminder.sent}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span 
                          className="text-xs px-2.5 md:px-3 py-1.5 rounded-full whitespace-nowrap"
                          style={{ 
                            backgroundColor: reminder.status === 'delivered' 
                              ? 'var(--status-compliant-bg)' 
                              : 'var(--status-non-compliant-bg)',
                            color: reminder.status === 'delivered' 
                              ? 'var(--status-compliant)' 
                              : 'var(--status-non-compliant)',
                            border: `1px solid ${reminder.status === 'delivered' 
                              ? 'var(--status-compliant-border)' 
                              : 'var(--status-non-compliant-border)'}`
                          }}
                        >
                          {reminder.status === 'delivered' ? 'Delivered' : 'Bounced'}
                        </span>
                        {reminder.opened && (
                          <span 
                            className="text-xs px-2.5 md:px-3 py-1.5 rounded-full whitespace-nowrap"
                            style={{ 
                              backgroundColor: 'var(--panel)',
                              color: 'var(--foreground-muted)'
                            }}
                          >
                            Opened
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--foreground-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    No recent reminders sent
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
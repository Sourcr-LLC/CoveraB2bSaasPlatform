import { Calendar, AlertCircle, Clock, CheckCircle2, Upload, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { vendorApi, insuranceApi } from '../lib/api';
import UploadCOIModal from './UploadCOIModal';
import { toast } from 'sonner';
import { isDemoMode, demoVendors } from '../lib/demoData';

export default function InsuranceTracking() {
  const [viewMode, setViewMode] = useState<'timeline' | 'missing' | 'expired'>('timeline');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isDemoMode()) {
        setVendors(demoVendors);
        return;
      }

      const { vendors: vendorData } = await vendorApi.getAll();
      setVendors(vendorData || []);
    } catch (error) {
      console.error('Failed to load insurance data:', error);
    }
  };

  // Calculate expiring COIs from vendor data
  const now = new Date();
  const calculateDaysLeft = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const vendorsWithExpiry = vendors
    .filter(v => v.insuranceExpiry)
    .map(v => ({
      ...v,
      daysLeft: calculateDaysLeft(v.insuranceExpiry),
      expiryDate: new Date(v.insuranceExpiry)
    }));

  const expiringCOIs = {
    '7days': vendorsWithExpiry
      .filter(v => v.daysLeft > 0 && v.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft),
    '14days': vendorsWithExpiry
      .filter(v => v.daysLeft > 7 && v.daysLeft <= 14)
      .sort((a, b) => a.daysLeft - b.daysLeft),
    '30days': vendorsWithExpiry
      .filter(v => v.daysLeft > 14 && v.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft),
  };

  const missingCOIs = vendors.filter(v => !v.insuranceExpiry);
  const expiredCOIs = vendorsWithExpiry.filter(v => v.daysLeft <= 0);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex-none flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="mb-2 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Insurance Tracking</h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--foreground-muted)' }}>
            Monitor certificates of insurance and coverage requirements
          </p>
        </div>
        <button 
          className="px-6 py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-4 h-4" />
          Upload COI
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex-none grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div 
          className="rounded-2xl border px-6 py-5 border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Expiring in 7 days</div>
          <div className="text-3xl tracking-tight mb-1" style={{ color: 'var(--status-non-compliant)' }}>{expiringCOIs['7days'].length}</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Requires immediate action</div>
        </div>
        <div 
          className="rounded-2xl border px-6 py-5 border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Expiring in 14 days</div>
          <div className="text-3xl tracking-tight mb-1" style={{ color: 'var(--status-at-risk)' }}>{expiringCOIs['14days'].length}</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Monitor closely</div>
        </div>
        <div 
          className="rounded-2xl border px-6 py-5 border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Expiring in 30 days</div>
          <div className="text-3xl tracking-tight mb-1" style={{ color: 'var(--status-at-risk)' }}>{expiringCOIs['30days'].length}</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Plan ahead</div>
        </div>
        <div 
          className="rounded-2xl border px-6 py-5 border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Missing COIs</div>
          <div className="text-3xl tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>{missingCOIs.length}</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Outstanding requests</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex-none flex items-center gap-3 mb-6">
        <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>View:</span>
        <div className="flex items-center gap-2 border rounded-lg p-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          {(['timeline', 'missing', 'expired'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-4 py-2 rounded-md text-sm transition-all capitalize"
              style={{
                backgroundColor: viewMode === mode ? 'var(--panel)' : 'transparent',
                color: viewMode === mode ? 'var(--foreground)' : 'var(--foreground-muted)',
                border: viewMode === mode ? '1px solid var(--border)' : '1px solid transparent',
                boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {mode === 'timeline' ? 'Expiration Timeline' : mode === 'missing' ? 'Missing COIs' : 'Expired'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-8 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pb-4">
          {/* 7 Days */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-non-compliant)' }} />
              <h3 className="text-lg">Expiring within 7 days</h3>
              <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--status-non-compliant-bg)', color: 'var(--status-non-compliant)' }}>
                Critical
              </span>
            </div>
            <div className="space-y-3">
              {expiringCOIs['7days'].map((coi, index) => (
                <div
                  key={index}
                  className="rounded-2xl border p-4 md:p-6 border-slate-100"
                  style={{
                    backgroundColor: 'var(--card)',
                  }}
                >
                  {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-base">{coi.name}</h4>
                        <span className="inline-flex items-center justify-center text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--panel)', color: 'var(--foreground-muted)' }}>
                          {coi.category || 'General'}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {new Date(coi.insuranceExpiry).toLocaleDateString()}</span>
                        </div>
                        <div className="hidden md:block">Contact: {coi.contactEmail || coi.contactPhone || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-left md:text-right">
                        <div className="text-xs md:text-sm mb-1" style={{ color: 'var(--foreground-subtle)' }}>Days remaining</div>
                        <div className="text-xl md:text-2xl tracking-tight" style={{ color: 'var(--status-non-compliant)' }}>{coi.daysLeft}</div>
                      </div>
                      <button 
                        className="px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap inline-flex items-center justify-center"
                        style={{ 
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)',
                          opacity: sendingReminderId === coi.id ? 0.5 : 1,
                          cursor: sendingReminderId === coi.id ? 'not-allowed' : 'pointer'
                        }}
                        onClick={async () => {
                          setSendingReminderId(coi.id);
                          try {
                            await vendorApi.sendReminder(coi.id);
                            toast.success(`Reminder sent to ${coi.name}!`);
                          } catch (error: any) {
                            console.error('Failed to send reminder:', error);
                            toast.error(error.message || 'Failed to send reminder.');
                          } finally {
                            setSendingReminderId(null);
                          }
                        }}
                        disabled={sendingReminderId === coi.id}
                      >
                        {sendingReminderId === coi.id ? 'Sending...' : 'Send reminder'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 14 Days */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-at-risk)' }} />
              <h3 className="text-lg">Expiring within 14 days</h3>
            </div>
            <div className="space-y-3">
              {expiringCOIs['14days'].map((coi, index) => (
                <div
                  key={index}
                  className="rounded-2xl border p-4 md:p-6 border-slate-100"
                  style={{
                    backgroundColor: 'var(--card)',
                  }}
                >
                  {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-base">{coi.name}</h4>
                        <span className="inline-flex items-center justify-center text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--panel)', color: 'var(--foreground-muted)' }}>
                          {coi.category || 'General'}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {new Date(coi.insuranceExpiry).toLocaleDateString()}</span>
                        </div>
                        <div className="hidden md:block">Contact: {coi.contactEmail || coi.contactPhone || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-left md:text-right">
                        <div className="text-xs md:text-sm mb-1" style={{ color: 'var(--foreground-subtle)' }}>Days remaining</div>
                        <div className="text-xl md:text-2xl tracking-tight" style={{ color: 'var(--status-at-risk)' }}>{coi.daysLeft}</div>
                      </div>
                      <button 
                        className="px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap inline-flex items-center justify-center"
                        style={{ 
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)',
                          opacity: sendingReminderId === coi.id ? 0.5 : 1,
                          cursor: sendingReminderId === coi.id ? 'not-allowed' : 'pointer'
                        }}
                        onClick={async () => {
                          setSendingReminderId(coi.id);
                          try {
                            await vendorApi.sendReminder(coi.id);
                            toast.success(`Reminder sent to ${coi.name}!`);
                          } catch (error: any) {
                            console.error('Failed to send reminder:', error);
                            toast.error(error.message || 'Failed to send reminder.');
                          } finally {
                            setSendingReminderId(null);
                          }
                        }}
                        disabled={sendingReminderId === coi.id}
                      >
                        {sendingReminderId === coi.id ? 'Sending...' : 'Send reminder'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 30 Days */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-at-risk)' }} />
              <h3 className="text-lg">Expiring within 30 days</h3>
            </div>
            <div className="space-y-3">
              {expiringCOIs['30days'].map((coi, index) => (
                <div
                  key={index}
                  className="rounded-2xl border p-4 md:p-6 border-slate-100"
                  style={{
                    backgroundColor: 'var(--card)',
                  }}
                >
                  {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-base">{coi.name}</h4>
                        <span className="inline-flex items-center justify-center text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--panel)', color: 'var(--foreground-muted)' }}>
                          {coi.category || 'General'}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {new Date(coi.insuranceExpiry).toLocaleDateString()}</span>
                        </div>
                        <div className="hidden md:block">Contact: {coi.contactEmail || coi.contactPhone || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-left md:text-right">
                        <div className="text-xs md:text-sm mb-1" style={{ color: 'var(--foreground-subtle)' }}>Days remaining</div>
                        <div className="text-xl md:text-2xl tracking-tight" style={{ color: 'var(--foreground)' }}>{coi.daysLeft}</div>
                      </div>
                      <button 
                        className="px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap inline-flex items-center justify-center"
                        style={{ 
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)',
                          opacity: sendingReminderId === coi.id ? 0.5 : 1,
                          cursor: sendingReminderId === coi.id ? 'not-allowed' : 'pointer'
                        }}
                        onClick={async () => {
                          setSendingReminderId(coi.id);
                          try {
                            await vendorApi.sendReminder(coi.id);
                            toast.success(`Reminder sent to ${coi.name}!`);
                          } catch (error: any) {
                            console.error('Failed to send reminder:', error);
                            toast.error(error.message || 'Failed to send reminder.');
                          } finally {
                            setSendingReminderId(null);
                          }
                        }}
                        disabled={sendingReminderId === coi.id}
                      >
                        {sendingReminderId === coi.id ? 'Sending...' : 'Send reminder'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Missing COIs View */}
      {viewMode === 'missing' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pb-4">
          {missingCOIs.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--foreground-muted)' }}>
              All vendors have insurance on file
            </div>
          ) : (
            missingCOIs.map((coi, index) => (
              <div
                key={index}
                className="rounded-2xl border p-4 md:p-6 border-slate-100"
                style={{
                  backgroundColor: 'var(--card)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-at-risk)' }} />
                    <div>
                      <h4 className="text-base mb-1">{coi.name}</h4>
                      <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        Missing insurance information
                      </div>
                      <div className="text-sm mt-1 md:hidden" style={{ color: 'var(--foreground-subtle)' }}>
                        Contact: {coi.contactEmail || coi.contactPhone || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="px-5 py-2.5 rounded-lg text-sm transition-all inline-flex items-center justify-center w-full md:w-auto"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    Request COI
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Expired View */}
      {viewMode === 'expired' && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pb-4">
          {expiredCOIs.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--foreground-muted)' }}>
              No expired insurance certificates
            </div>
          ) : (
            expiredCOIs.map((coi, index) => (
              <div
                key={index}
                className="rounded-2xl border p-4 md:p-6"
                style={{
                  backgroundColor: 'var(--status-non-compliant-bg)',
                  borderColor: 'var(--status-non-compliant-border)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-non-compliant)' }} />
                    <div>
                      <h4 className="text-base mb-1">{coi.name}</h4>
                      <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                        {coi.category || 'Insurance'} expired {new Date(coi.insuranceExpiry).toLocaleDateString()} • {Math.abs(coi.daysLeft)} days overdue
                      </div>
                    </div>
                  </div>
                  <button 
                    className="px-5 py-2.5 rounded-lg text-sm transition-all inline-flex items-center justify-center w-full md:w-auto whitespace-nowrap"
                    style={{ 
                      backgroundColor: 'var(--status-non-compliant)',
                      color: 'white'
                    }}
                  >
                    Urgent: Request now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Upload COI Modal */}
      <UploadCOIModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
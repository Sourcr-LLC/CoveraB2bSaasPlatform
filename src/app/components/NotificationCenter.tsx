import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, AlertCircle, CheckCircle2, Clock, FileText, Users } from 'lucide-react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../lib/api';

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  vendorId?: string;
  vendorName?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/notifications/mark-all-read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'warning':
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-at-risk)' }} />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-compliant)' }} />;
      case 'info':
        return <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationTime.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all"
        style={{
          backgroundColor: isOpen ? 'var(--panel)' : 'transparent',
          color: 'var(--foreground-muted)',
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
            style={{
              backgroundColor: 'var(--status-non-compliant)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 600,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-xl border shadow-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              <h3 className="text-sm" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--panel)',
                  color: 'var(--primary)',
                  fontWeight: 500,
                }}
              >
                <CheckCheck className="w-4 h-4 inline mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--foreground-subtle)' }} />
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No notifications yet
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-5 py-4 border-b transition-all cursor-pointer group"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: notification.read ? 'transparent' : 'rgba(58, 79, 106, 0.03)',
                  }}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className="text-sm mb-1"
                          style={{
                            fontWeight: notification.read ? 500 : 600,
                            color: 'var(--foreground)',
                          }}
                        >
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-opacity-10"
                          style={{ color: 'var(--foreground-subtle)' }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p
                        className="text-xs mb-2"
                        style={{ color: 'var(--foreground-muted)', lineHeight: 1.5 }}
                      >
                        {notification.message}
                      </p>
                      {notification.vendorName && (
                        <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
                          <Users className="w-3 h-3" />
                          {notification.vendorName}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--primary)' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              className="px-5 py-3 text-center border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <button
                className="text-xs transition-all"
                style={{ color: 'var(--primary)', fontWeight: 500 }}
                onClick={() => {
                  // Could link to a dedicated notifications page
                  setIsOpen(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

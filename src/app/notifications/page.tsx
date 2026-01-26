'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  Bell,
  Flame,
  Heart,
  MessageSquare,
  Users,
  BookOpen,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import type { Notification } from '@shared/types';

const iconMap: Record<string, React.ElementType> = {
  streak_milestone: Flame,
  prayer_answered: Heart,
  partner_message: MessageSquare,
  partner_update: Users,
  quiet_time_reminder: BookOpen,
  default: Bell,
};

const colorMap: Record<string, string> = {
  streak_milestone: 'bg-amber-100 text-amber-600',
  prayer_answered: 'bg-green-100 text-green-600',
  partner_message: 'bg-blue-100 text-blue-600',
  partner_update: 'bg-purple-100 text-purple-600',
  quiet_time_reminder: 'bg-teal-100 text-teal-600',
  default: 'bg-gray-100 text-gray-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.notifications.getAll();
      if (result.data) {
        setNotifications(result.data);
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError('Failed to load notifications');
    }
    setLoading(false);
  }

  async function handleMarkRead(id: string) {
    const result = await api.notifications.markRead(id);
    if (!result.error) {
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
    }
  }

  async function handleMarkAllRead() {
    const result = await api.notifications.markAllRead();
    if (!result.error) {
      setNotifications(
        notifications.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    }
  }

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-brand-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-sm font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Stay updated on your journey</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors"
            >
              <Check className="w-5 h-5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-medium">Failed to load notifications</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500">
              When you receive notifications, they&apos;ll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type] || iconMap.default;
              const colorClass = colorMap[notification.type] || colorMap.default;
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border p-4 transition-colors ${
                    isUnread
                      ? 'border-brand-200 bg-brand-50/30'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`font-medium ${
                              isUnread ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notification.body}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTime(notification.createdAt || new Date().toISOString())}
                        </span>
                      </div>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="mt-2 text-sm text-brand-600 font-medium hover:text-brand-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

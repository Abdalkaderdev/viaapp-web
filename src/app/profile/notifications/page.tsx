'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import {
  Bell,
  ArrowLeft,
  Clock,
  Users,
  Heart,
  Church,
  MessageSquare,
  Trophy,
  Loader2,
  Save,
  Check,
  Smartphone,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSetting[];
}

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? 'bg-brand-500' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

function NotificationCategoryCard({
  category,
  onToggle,
}: {
  category: NotificationCategory;
  onToggle: (settingId: string, enabled: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-900">{category.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
      </div>
      <div className="divide-y divide-gray-100">
        {category.settings.map((setting) => (
          <div key={setting.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <setting.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
            <Toggle
              checked={setting.enabled}
              onChange={(enabled) => onToggle(setting.id, enabled)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationPreferencesPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Master toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Notification settings state
  const [settings, setSettings] = useState<Record<string, boolean>>({
    // Quiet Time
    qt_reminder: true,
    qt_streak_warning: true,
    qt_weekly_summary: true,

    // Partner
    partner_message: true,
    partner_request: true,
    partner_activity: false,

    // Prayer
    prayer_answered: true,
    prayer_reminder: true,
    prayer_shared: true,

    // Church
    church_announcement: true,
    church_event: true,
    church_checkin_reminder: true,

    // Achievements
    badge_earned: true,
    streak_milestone: true,
    goal_achieved: true,
  });

  useEffect(() => {
    // Simulate loading saved preferences
    // In real app, this would fetch from API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (settingId: string, enabled: boolean) => {
    setSettings((prev) => ({ ...prev, [settingId]: enabled }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories: NotificationCategory[] = [
    {
      id: 'quiet_time',
      title: 'Quiet Time',
      description: 'Reminders and updates about your daily devotion',
      settings: [
        {
          id: 'qt_reminder',
          label: 'Daily Reminder',
          description: 'Get reminded to complete your quiet time',
          icon: Clock,
          enabled: settings.qt_reminder,
        },
        {
          id: 'qt_streak_warning',
          label: 'Streak Warning',
          description: 'Alert when your streak is about to break',
          icon: Trophy,
          enabled: settings.qt_streak_warning,
        },
        {
          id: 'qt_weekly_summary',
          label: 'Weekly Summary',
          description: 'Receive a summary of your weekly progress',
          icon: Bell,
          enabled: settings.qt_weekly_summary,
        },
      ],
    },
    {
      id: 'partner',
      title: 'Disciple Partner',
      description: 'Updates from your accountability partner',
      settings: [
        {
          id: 'partner_message',
          label: 'New Messages',
          description: 'When your partner sends you a message',
          icon: MessageSquare,
          enabled: settings.partner_message,
        },
        {
          id: 'partner_request',
          label: 'Partnership Requests',
          description: 'When someone wants to partner with you',
          icon: Users,
          enabled: settings.partner_request,
        },
        {
          id: 'partner_activity',
          label: 'Partner Activity',
          description: 'Updates on your partner\'s progress',
          icon: Bell,
          enabled: settings.partner_activity,
        },
      ],
    },
    {
      id: 'prayer',
      title: 'Prayer Journal',
      description: 'Updates about your prayers',
      settings: [
        {
          id: 'prayer_answered',
          label: 'Prayer Answered',
          description: 'Celebrate when prayers are answered',
          icon: Heart,
          enabled: settings.prayer_answered,
        },
        {
          id: 'prayer_reminder',
          label: 'Prayer Reminders',
          description: 'Reminders to pray for your requests',
          icon: Bell,
          enabled: settings.prayer_reminder,
        },
        {
          id: 'prayer_shared',
          label: 'Shared Prayers',
          description: 'When someone prays for you',
          icon: Users,
          enabled: settings.prayer_shared,
        },
      ],
    },
    {
      id: 'church',
      title: 'Church',
      description: 'Updates from your church community',
      settings: [
        {
          id: 'church_announcement',
          label: 'Announcements',
          description: 'Important updates from your church',
          icon: Church,
          enabled: settings.church_announcement,
        },
        {
          id: 'church_event',
          label: 'Events',
          description: 'Upcoming church events',
          icon: Bell,
          enabled: settings.church_event,
        },
        {
          id: 'church_checkin_reminder',
          label: 'Check-in Reminder',
          description: 'Reminder to check in on service days',
          icon: Clock,
          enabled: settings.church_checkin_reminder,
        },
      ],
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Celebrate your milestones',
      settings: [
        {
          id: 'badge_earned',
          label: 'Badge Earned',
          description: 'When you unlock a new badge',
          icon: Trophy,
          enabled: settings.badge_earned,
        },
        {
          id: 'streak_milestone',
          label: 'Streak Milestones',
          description: 'When you reach streak milestones',
          icon: Trophy,
          enabled: settings.streak_milestone,
        },
        {
          id: 'goal_achieved',
          label: 'Goals Achieved',
          description: 'When you complete your goals',
          icon: Trophy,
          enabled: settings.goal_achieved,
        },
      ],
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-brand-500" />
                Notification Preferences
              </h1>
              <p className="text-gray-600 mt-1">
                Control how and when you receive notifications
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-70 transition-colors shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saved ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Master Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Master Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-500">On your device</p>
                </div>
              </div>
              <Toggle checked={pushEnabled} onChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">To {user?.email}</p>
                </div>
              </div>
              <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Sound Effects</p>
                  <p className="text-xs text-gray-500">In-app sounds</p>
                </div>
              </div>
              <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
            </div>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <NotificationCategoryCard
              key={category.id}
              category={category}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Quiet Hours Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Quiet Hours</h3>
          <p className="text-sm text-gray-500 mb-4">
            Set times when you don't want to receive notifications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

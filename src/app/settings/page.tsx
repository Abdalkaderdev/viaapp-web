'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import { api } from '@/lib/api';
import {
  Settings,
  User,
  Bell,
  BookOpen,
  Shield,
  HardDrive,
  Info,
  ChevronRight,
  Save,
  Loader2,
  Check,
} from 'lucide-react';

type SettingsSection = 'profile' | 'notifications' | 'reading' | 'privacy' | 'data' | 'about';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Profile
    displayName: user?.fullName || '',
    email: user?.email || '',
    // Notifications
    pushNotifications: true,
    quietTimeReminders: true,
    partnerUpdates: true,
    prayerAnswered: true,
    // Reading
    bibleVersion: 'NIV',
    fontSize: 'medium',
    // Privacy
    shareProgressWithPartner: true,
    publicChurchVisibility: false,
    // App
    soundEffects: true,
    hapticFeedback: true,
    autoSync: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save profile settings
      if (settings.displayName !== user?.fullName) {
        await api.user.updateProfile({ fullName: settings.displayName });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Handle error silently for now
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'reading' as const, label: 'Reading Preferences', icon: BookOpen },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'data' as const, label: 'Data & Storage', icon: HardDrive },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-brand-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-brand-500" />
              Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage your account preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-70 transition-colors"
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

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-brand-50 text-brand-700 border-l-2 border-brand-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.displayName}
                    onChange={(e) =>
                      setSettings({ ...settings, displayName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support to change your email
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Toggle
                      checked={settings.pushNotifications}
                      onChange={(val) =>
                        setSettings({ ...settings, pushNotifications: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Quiet Time Reminders</p>
                      <p className="text-sm text-gray-500">
                        Daily reminders for your quiet time
                      </p>
                    </div>
                    <Toggle
                      checked={settings.quietTimeReminders}
                      onChange={(val) =>
                        setSettings({ ...settings, quietTimeReminders: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Partner Updates</p>
                      <p className="text-sm text-gray-500">
                        Notifications about your disciple partner
                      </p>
                    </div>
                    <Toggle
                      checked={settings.partnerUpdates}
                      onChange={(val) =>
                        setSettings({ ...settings, partnerUpdates: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Prayer Answered</p>
                      <p className="text-sm text-gray-500">
                        Get notified when prayers are answered
                      </p>
                    </div>
                    <Toggle
                      checked={settings.prayerAnswered}
                      onChange={(val) =>
                        setSettings({ ...settings, prayerAnswered: val })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reading' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Reading Preferences</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bible Version
                  </label>
                  <select
                    value={settings.bibleVersion}
                    onChange={(e) =>
                      setSettings({ ...settings, bibleVersion: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  >
                    <option value="NIV">NIV - New International Version</option>
                    <option value="ESV">ESV - English Standard Version</option>
                    <option value="KJV">KJV - King James Version</option>
                    <option value="NKJV">NKJV - New King James Version</option>
                    <option value="NLT">NLT - New Living Translation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings({ ...settings, fontSize: size })}
                        className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                          settings.fontSize === size
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Share Progress with Partner</p>
                      <p className="text-sm text-gray-500">
                        Let your disciple partner see your activity
                      </p>
                    </div>
                    <Toggle
                      checked={settings.shareProgressWithPartner}
                      onChange={(val) =>
                        setSettings({ ...settings, shareProgressWithPartner: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Public Church Visibility</p>
                      <p className="text-sm text-gray-500">
                        Allow church members to see your profile
                      </p>
                    </div>
                    <Toggle
                      checked={settings.publicChurchVisibility}
                      onChange={(val) =>
                        setSettings({ ...settings, publicChurchVisibility: val })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Data & Storage</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Auto-sync Data</p>
                      <p className="text-sm text-gray-500">
                        Automatically sync your data across devices
                      </p>
                    </div>
                    <Toggle
                      checked={settings.autoSync}
                      onChange={(val) => setSettings({ ...settings, autoSync: val })}
                    />
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">Storage Used</p>
                      <span className="text-sm text-gray-500">Minimal</span>
                    </div>
                    <p className="text-xs text-gray-400">Data is stored on our secure servers</p>
                  </div>
                  <button className="w-full py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Export My Data
                  </button>
                  <button className="w-full py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                    Clear Cache
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">About</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">App Version</p>
                    <span className="text-gray-500">1.0.0</span>
                  </div>
                  <button className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Help & Support</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Privacy Policy</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Terms of Service</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

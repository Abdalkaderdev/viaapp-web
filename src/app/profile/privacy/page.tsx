'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import {
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Users,
  Church,
  Heart,
  BarChart3,
  Lock,
  Globe,
  UserCircle,
  Loader2,
  Save,
  Check,
  AlertTriangle,
  Trash2,
  Download,
} from 'lucide-react';

type VisibilityLevel = 'private' | 'partner' | 'church' | 'public';

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  value: VisibilityLevel;
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

function VisibilitySelector({
  value,
  onChange,
  options = ['private', 'partner', 'church', 'public'],
}: {
  value: VisibilityLevel;
  onChange: (value: VisibilityLevel) => void;
  options?: VisibilityLevel[];
}) {
  const visibilityOptions: { value: VisibilityLevel; label: string; icon: React.ElementType }[] = [
    { value: 'private', label: 'Only Me', icon: Lock },
    { value: 'partner', label: 'Partner', icon: Users },
    { value: 'church', label: 'Church', icon: Church },
    { value: 'public', label: 'Everyone', icon: Globe },
  ];

  const filteredOptions = visibilityOptions.filter((opt) => options.includes(opt.value));

  return (
    <div className="flex gap-2 flex-wrap">
      {filteredOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function PrivacySettingCard({
  setting,
  onChange,
  options,
}: {
  setting: PrivacySetting;
  onChange: (value: VisibilityLevel) => void;
  options?: VisibilityLevel[];
}) {
  const Icon = setting.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{setting.label}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{setting.description}</p>
        </div>
      </div>
      <VisibilitySelector value={setting.value} onChange={onChange} options={options} />
    </div>
  );
}

export default function PrivacySettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<Record<string, VisibilityLevel>>({
    profile_visibility: 'church',
    progress_visibility: 'partner',
    prayer_default: 'private',
    streak_visibility: 'partner',
    activity_visibility: 'partner',
  });

  // Toggle settings
  const [toggleSettings, setToggleSettings] = useState({
    show_in_search: true,
    allow_partner_requests: true,
    share_with_church_leaders: true,
    anonymous_prayers: false,
    hide_from_leaderboards: false,
  });

  useEffect(() => {
    // Simulate loading saved preferences
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrivacyChange = (settingId: string, value: VisibilityLevel) => {
    setPrivacySettings((prev) => ({ ...prev, [settingId]: value }));
  };

  const handleToggleChange = (settingId: string, value: boolean) => {
    setToggleSettings((prev) => ({ ...prev, [settingId]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const privacyItems: PrivacySetting[] = [
    {
      id: 'profile_visibility',
      label: 'Profile Visibility',
      description: 'Who can see your profile information',
      icon: UserCircle,
      value: privacySettings.profile_visibility,
    },
    {
      id: 'progress_visibility',
      label: 'Progress Stats',
      description: 'Who can see your progress statistics',
      icon: BarChart3,
      value: privacySettings.progress_visibility,
    },
    {
      id: 'streak_visibility',
      label: 'Streak Display',
      description: 'Who can see your current streak',
      icon: Eye,
      value: privacySettings.streak_visibility,
    },
    {
      id: 'activity_visibility',
      label: 'Activity Feed',
      description: 'Who can see your recent activity',
      icon: Globe,
      value: privacySettings.activity_visibility,
    },
    {
      id: 'prayer_default',
      label: 'Default Prayer Visibility',
      description: 'Default visibility for new prayer requests',
      icon: Heart,
      value: privacySettings.prayer_default,
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
                <Shield className="w-8 h-8 text-brand-500" />
                Privacy Settings
              </h1>
              <p className="text-gray-600 mt-1">Control who can see your information</p>
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

        {/* Visibility Legend */}
        <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-100">
          <p className="text-sm font-medium text-brand-900 mb-2">Visibility Levels</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-brand-700">
              <Lock className="w-4 h-4" /> Only Me - Private
            </span>
            <span className="flex items-center gap-1.5 text-brand-700">
              <Users className="w-4 h-4" /> Partner - Your disciple partner
            </span>
            <span className="flex items-center gap-1.5 text-brand-700">
              <Church className="w-4 h-4" /> Church - Church members
            </span>
            <span className="flex items-center gap-1.5 text-brand-700">
              <Globe className="w-4 h-4" /> Everyone - Public
            </span>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Content Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacyItems.map((item) => (
              <PrivacySettingCard
                key={item.id}
                setting={item}
                onChange={(value) => handlePrivacyChange(item.id, value)}
                options={item.id === 'prayer_default' ? ['private', 'partner', 'church'] : undefined}
              />
            ))}
          </div>
        </div>

        {/* Additional Privacy Options */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Appear in Search</p>
                  <p className="text-sm text-gray-500">
                    Let others find you when searching for partners
                  </p>
                </div>
              </div>
              <Toggle
                checked={toggleSettings.show_in_search}
                onChange={(val) => handleToggleChange('show_in_search', val)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Allow Partner Requests</p>
                  <p className="text-sm text-gray-500">
                    Receive partnership requests from others
                  </p>
                </div>
              </div>
              <Toggle
                checked={toggleSettings.allow_partner_requests}
                onChange={(val) => handleToggleChange('allow_partner_requests', val)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Church className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Share with Church Leaders</p>
                  <p className="text-sm text-gray-500">
                    Let church pastors see your progress for pastoral care
                  </p>
                </div>
              </div>
              <Toggle
                checked={toggleSettings.share_with_church_leaders}
                onChange={(val) => handleToggleChange('share_with_church_leaders', val)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Anonymous Prayers by Default</p>
                  <p className="text-sm text-gray-500">
                    Hide your name on shared prayer requests
                  </p>
                </div>
              </div>
              <Toggle
                checked={toggleSettings.anonymous_prayers}
                onChange={(val) => handleToggleChange('anonymous_prayers', val)}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Hide from Leaderboards</p>
                  <p className="text-sm text-gray-500">
                    Don't show my stats on church leaderboards
                  </p>
                </div>
              </div>
              <Toggle
                checked={toggleSettings.hide_from_leaderboards}
                onChange={(val) => handleToggleChange('hide_from_leaderboards', val)}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download My Data</p>
                  <p className="text-sm text-gray-500">Get a copy of all your data</p>
                </div>
              </div>
              <span className="text-brand-600 font-medium text-sm">Request</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-red-700 mb-4">
            These actions are permanent and cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-red-200">
              <p className="text-sm text-red-800 mb-4">
                Are you sure? This will permanently delete your account and all associated data
                including your quiet time sessions, prayer journal, memory verses, and progress.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

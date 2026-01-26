'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import { api } from '@/lib/api';
import type { UserStats, QuietTimeSession, PrayerRequest, UserChurch } from '@viaapp/shared';
import {
  Sun,
  BookOpen,
  Heart,
  Brain,
  Flame,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  Play,
  CheckCircle2,
  Circle,
  Sparkles,
  Loader2,
  Church,
} from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DailyVerse {
  reference: string;
  text: string;
  encouragement?: string;
}

// Skeleton components for loading states
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function QuickActionSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="w-5 h-5 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-24 bg-gray-200 rounded mt-4" />
      <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-105 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">{description}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  color,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mt-4 group-hover:text-brand-700 transition-colors">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

function OnboardingChecklist({ stats, prayerCount }: { stats: UserStats | null; prayerCount: number }) {
  const items = [
    {
      label: 'Complete your first Quiet Time session',
      completed: (stats?.totalSessions || 0) > 0,
      href: '/quiet-time'
    },
    {
      label: 'Add your first prayer to the journal',
      completed: prayerCount > 0,
      href: '/prayer'
    },
    {
      label: 'Memorize your first verse',
      completed: (stats?.totalVersesMemorized || 0) > 0,
      href: '/memory'
    },
    {
      label: 'Start a Bible reading plan',
      completed: (stats?.readingPlansStarted || 0) > 0,
      href: '/bible'
    },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const allCompleted = completedCount === items.length;

  if (allCompleted) return null;

  return (
    <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6 mb-8 border border-brand-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Getting Started</h3>
          <p className="text-sm text-gray-600">{completedCount} of {items.length} completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-brand-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              item.completed
                ? 'bg-white/50 text-gray-400'
                : 'bg-white hover:bg-white/80 text-gray-700 hover:text-brand-700'
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${item.completed ? 'line-through' : ''}`}>
              {item.label}
            </span>
            {!item.completed && (
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StreakCard({ streak }: { streak: number }) {
  const nextMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => m > streak) || 365;
  const progress = streak > 0 ? Math.min((streak / nextMilestone) * 100, 100) : 0;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Progress ring */}
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-amber-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${progress * 1.76} 176`}
              strokeLinecap="round"
              className="text-amber-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className={`w-6 h-6 ${streak > 0 ? 'text-amber-500 animate-pulse' : 'text-amber-300'}`} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-amber-700">Current Streak</p>
          <p className="text-3xl font-bold text-amber-900">{streak} {streak === 1 ? 'day' : 'days'}</p>
          {streak > 0 && streak < nextMilestone && (
            <p className="text-xs text-amber-600 mt-1">
              {nextMilestone - streak} days to {nextMilestone}-day milestone!
            </p>
          )}
          {streak === 0 && (
            <p className="text-xs text-amber-600 mt-1">Start your streak today!</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecentActivity {
  id: string;
  type: 'quiet_time' | 'prayer' | 'memory';
  title: string;
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [prayerCount, setPrayerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [userChurch, setUserChurch] = useState<UserChurch | null>(null);
  const [isChurchDay, setIsChurchDay] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse>({
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ who strengthens me.',
  });

  async function handleCheckIn() {
    if (!userChurch) return;
    setCheckingIn(true);
    try {
      const result = await api.church.checkIn(userChurch.id);
      if (!result.error) {
        setHasCheckedIn(true);
      }
    } catch (err) {
      // Handle error
    }
    setCheckingIn(false);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const statsResult = await api.user.getStats();
        if (statsResult.data) {
          setStats(statsResult.data);
        }

        // Fetch user's church
        const churchResult = await api.church.getMyChurch();
        if (churchResult.data) {
          setUserChurch(churchResult.data);
          const today = DAYS_OF_WEEK[new Date().getDay()];
          const churchDay = churchResult.data.serviceDay || 'Sunday';
          setIsChurchDay(today === churchDay);
        }

        // Fetch AI-powered daily verse
        try {
          const verseResult = await api.ai.getDailyVerse();
          if (verseResult.data) {
            setDailyVerse({
              reference: verseResult.data.reference,
              text: verseResult.data.text,
              encouragement: verseResult.data.encouragement,
            });
          }
        } catch {
          // Using default daily verse
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }

      setLoading(false);

      try {
        // Fetch recent activity
        const [sessionsResult, prayersResult] = await Promise.all([
          api.quietTime.getSessions({ limit: 5 }),
          api.prayer.getRequests({ limit: 5 }),
        ]);

        const activities: RecentActivity[] = [];

        if (sessionsResult.data?.data && Array.isArray(sessionsResult.data.data)) {
          sessionsResult.data.data.forEach((session: QuietTimeSession) => {
            activities.push({
              id: session.id,
              type: 'quiet_time',
              title: session.type === 'word_to_life' ? 'Word to Life' : 'Word to Heart',
              description: session.verseReference || 'Quiet time session',
              timestamp: session.completedAt || session.createdAt,
            });
          });
        }

        if (prayersResult.data?.data && Array.isArray(prayersResult.data.data)) {
          // Set prayer count from API response
          const activePrayers = prayersResult.data.data.filter(
            (p: PrayerRequest) => p.status !== 'answered'
          );
          setPrayerCount(prayersResult.data.total || activePrayers.length);

          prayersResult.data.data.forEach((prayer: PrayerRequest) => {
            activities.push({
              id: prayer.id,
              type: 'prayer',
              title: prayer.status === 'answered' ? 'Prayer Answered!' : 'Prayer Request',
              description: prayer.title,
              timestamp: prayer.updatedAt || prayer.createdAt,
            });
          });
        }

        // Sort by timestamp and take top 5
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      }
      setActivityLoading(false);
    }
    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Friend';
  const isFirstTimeUser = stats?.totalSessions === 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header with Daily Verse */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {greeting()}, {firstName}
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <span className="text-brand-600 font-medium">{dailyVerse.reference}</span>
            <span className="hidden sm:inline">—</span>
            <span className="hidden sm:inline italic">&ldquo;{dailyVerse.text}&rdquo;</span>
          </p>
          {/* Mobile verse display */}
          <p className="text-gray-500 mt-2 text-sm italic sm:hidden">
            &ldquo;{dailyVerse.text}&rdquo;
          </p>
        </div>

        {/* Onboarding Checklist for new users */}
        {isFirstTimeUser && <OnboardingChecklist stats={stats} prayerCount={prayerCount} />}

        {/* Church Check-in Card - Only show on church day */}
        {isChurchDay && userChurch && (
          <div className={`mb-8 p-6 rounded-2xl ${hasCheckedIn ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${hasCheckedIn ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {hasCheckedIn ? (
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  ) : (
                    <Church className="w-7 h-7 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className={`text-lg font-semibold ${hasCheckedIn ? 'text-green-800' : 'text-amber-800'}`}>
                    {hasCheckedIn ? 'Checked In!' : "It's Church Day!"}
                  </p>
                  <p className={`text-sm ${hasCheckedIn ? 'text-green-600' : 'text-amber-600'}`}>
                    {hasCheckedIn
                      ? `You checked in at ${userChurch.name}. See you next week!`
                      : `Welcome to ${userChurch.name}! Check in to mark your attendance.`}
                  </p>
                </div>
              </div>
              {!hasCheckedIn && (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-70 transition-colors flex items-center gap-2 shadow-lg"
                >
                  {checkingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Check In
                </button>
              )}
            </div>
          </div>
        )}

        {/* Streak Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <StreakCard streak={stats?.currentStreak || 0} />

          {/* Start Quiet Time CTA */}
          <div className="lg:col-span-2 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Start Your Quiet Time</h2>
                <p className="text-brand-100 text-sm">
                  Connect with God through Scripture and reflection
                </p>
              </div>
              <Link
                href="/quiet-time"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5" />
                Begin Now
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={Clock}
                label="This Month"
                value={stats?.monthlyQuietTimeCount || 0}
                color="bg-gradient-to-br from-brand-500 to-brand-600"
                description="Quiet time sessions this month"
              />
              <StatCard
                icon={Brain}
                label="Verses Memorized"
                value={stats?.totalVersesMemorized || 0}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                description="Total verses you've mastered"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Sessions"
                value={stats?.totalSessions || 0}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                description="All-time quiet time sessions"
              />
              <StatCard
                icon={Heart}
                label="Prayers"
                value={prayerCount}
                color="bg-gradient-to-br from-rose-500 to-pink-500"
                description="Active prayer requests"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <QuickActionSkeleton />
              <QuickActionSkeleton />
              <QuickActionSkeleton />
              <QuickActionSkeleton />
            </>
          ) : (
            <>
              <QuickAction
                href="/quiet-time"
                icon={Sun}
                label="Quiet Time"
                description="Daily devotion and reflection"
                color="bg-gradient-to-br from-amber-500 to-orange-500"
              />
              <QuickAction
                href="/bible"
                icon={BookOpen}
                label="Read Bible"
                description="Continue your reading plan"
                color="bg-gradient-to-br from-brand-500 to-brand-600"
              />
              <QuickAction
                href="/memory"
                icon={Brain}
                label="Memory Verses"
                description="Practice your flashcards"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                badge={stats?.totalVersesMemorized ? `${stats.totalVersesMemorized} verses` : undefined}
              />
              <QuickAction
                href="/prayer"
                icon={Heart}
                label="Prayer Journal"
                description="Add or review prayers"
                color="bg-gradient-to-br from-rose-500 to-pink-500"
              />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {activityLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Your recent activity will appear here</p>
              <p className="text-sm text-gray-400 mb-4">Complete a quiet time session to see your progress</p>
              <Link
                href="/quiet-time"
                className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors"
              >
                Start your first session
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.type === 'quiet_time' ? '/quiet-time' : '/prayer'}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'quiet_time'
                        ? 'bg-amber-100'
                        : activity.type === 'prayer'
                        ? 'bg-rose-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    {activity.type === 'quiet_time' ? (
                      <Sun className="w-5 h-5 text-amber-600" />
                    ) : activity.type === 'prayer' ? (
                      <Heart className="w-5 h-5 text-rose-600" />
                    ) : (
                      <Brain className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatActivityTime(activity.timestamp)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 2880) return 'Yesterday';
  return date.toLocaleDateString();
}

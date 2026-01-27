'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { UserStats, QuietTimeSession, MemoryVerse, PrayerRequest } from '@shared/types';
import {
  BarChart3,
  ArrowLeft,
  Clock,
  BookOpen,
  Brain,
  Heart,
  Flame,
  TrendingUp,
  Calendar,
  Loader2,
  Sun,
  ChevronDown,
} from 'lucide-react';

interface StatItemProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ElementType;
  color?: string;
}

function StatItem({ label, value, subValue, icon: Icon, color = 'text-brand-500' }: StatItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        )}
        <span className="text-gray-600">{label}</span>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{value}</p>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
    </div>
  );
}

interface ChartBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function ChartBar({ label, value, max, color }: ChartBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <span className="w-8 text-sm text-gray-500 text-right">{label}</span>
      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`h-full ${color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        >
          {value > 0 && (
            <span className="text-xs font-medium text-white">{value}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-brand-500" />
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<QuietTimeSession[]>([]);
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResult, sessionsResult, versesResult, prayersResult] = await Promise.all([
          api.user.getStats(),
          api.quietTime.getSessions({ limit: 100 }),
          api.memory.getVerses(),
          api.prayer.getRequests({ limit: 100 }),
        ]);

        if (statsResult.data) {
          setStats(statsResult.data);
        }
        if (sessionsResult.data?.data) {
          setSessions(sessionsResult.data.data);
        }
        if (versesResult.data) {
          setVerses(versesResult.data);
        }
        if (prayersResult.data?.data) {
          setPrayers(prayersResult.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatAvgTime = (sessions: QuietTimeSession[]): string => {
    if (sessions.length === 0) return '0m';
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
    const avgSeconds = Math.round(totalSeconds / sessions.length);
    return formatTime(avgSeconds);
  };

  // Calculate sessions by day of week
  const sessionsByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  sessions.forEach((session) => {
    const date = new Date(session.completedAt || session.createdAt);
    sessionsByDay[date.getDay()]++;
  });
  const maxSessionsPerDay = Math.max(...sessionsByDay);

  // Calculate sessions by type
  const wordToLifeCount = sessions.filter(s => s.type === 'word_to_life').length;
  const wordToHeartCount = sessions.filter(s => s.type === 'word_to_heart').length;

  // Calculate verse mastery levels
  const learningVerses = verses.filter(v => v.masteryLevel === 'learning').length;
  const reviewingVerses = verses.filter(v => v.masteryLevel === 'reviewing').length;
  const masteredVerses = verses.filter(v => v.masteryLevel === 'mastered').length;

  // Calculate prayer stats
  const activePrayers = prayers.filter(p => p.status === 'active').length;
  const answeredPrayers = prayers.filter(p => p.status === 'answered').length;
  const prayerCategories = prayers.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter data by selected period
  const filterByPeriod = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    switch (selectedPeriod) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  };

  const periodSessions = sessions.filter(s => filterByPeriod(s.completedAt || s.createdAt));
  const periodPrayers = prayers.filter(p => filterByPeriod(p.createdAt));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/progress"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Progress
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-brand-500" />
                Detailed Statistics
              </h1>
              <p className="text-gray-600 mt-1">Deep dive into your spiritual journey data</p>
            </div>

            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last year</option>
                <option value="all">All time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white">
            <Clock className="w-8 h-8 text-brand-200 mb-2" />
            <p className="text-brand-100 text-sm">Total Time</p>
            <p className="text-2xl font-bold">{formatTime(stats?.totalReadingTimeSeconds || 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
            <Flame className="w-8 h-8 text-amber-200 mb-2" />
            <p className="text-amber-100 text-sm">Best Streak</p>
            <p className="text-2xl font-bold">{stats?.longestStreak || 0} days</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
            <Brain className="w-8 h-8 text-purple-200 mb-2" />
            <p className="text-purple-100 text-sm">Verses Memorized</p>
            <p className="text-2xl font-bold">{stats?.totalVersesMemorized || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-5 text-white">
            <Heart className="w-8 h-8 text-rose-200 mb-2" />
            <p className="text-rose-100 text-sm">Prayers Answered</p>
            <p className="text-2xl font-bold">{answeredPrayers}</p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quiet Time Stats */}
          <StatSection title="Quiet Time" icon={Sun}>
            <StatItem
              label="Total Sessions"
              value={stats?.totalSessions || 0}
              subValue={`${periodSessions.length} in selected period`}
              icon={BookOpen}
            />
            <StatItem
              label="Average Duration"
              value={formatAvgTime(sessions)}
              icon={Clock}
            />
            <StatItem
              label="Word to Life Sessions"
              value={wordToLifeCount}
              subValue={`${Math.round((wordToLifeCount / (sessions.length || 1)) * 100)}%`}
            />
            <StatItem
              label="Word to Heart Sessions"
              value={wordToHeartCount}
              subValue={`${Math.round((wordToHeartCount / (sessions.length || 1)) * 100)}%`}
            />
            <StatItem
              label="This Month"
              value={stats?.monthlyQuietTimeCount || 0}
              icon={Calendar}
            />
          </StatSection>

          {/* Streak Stats */}
          <StatSection title="Consistency" icon={Flame}>
            <StatItem
              label="Current Streak"
              value={`${stats?.currentStreak || 0} days`}
              icon={Flame}
              color="text-amber-500"
            />
            <StatItem
              label="Longest Streak"
              value={`${stats?.longestStreak || 0} days`}
              icon={TrendingUp}
              color="text-amber-500"
            />
            <StatItem
              label="Reading Plans Started"
              value={stats?.readingPlansStarted || 0}
              icon={BookOpen}
            />
            <StatItem
              label="Last Activity"
              value={stats?.lastActivityAt ? new Date(stats.lastActivityAt).toLocaleDateString() : 'Never'}
              icon={Calendar}
            />
          </StatSection>

          {/* Memory Verses Stats */}
          <StatSection title="Memory Verses" icon={Brain}>
            <StatItem
              label="Total Verses"
              value={verses.length}
              icon={Brain}
              color="text-purple-500"
            />
            <StatItem
              label="Mastered"
              value={masteredVerses}
              subValue={`${Math.round((masteredVerses / (verses.length || 1)) * 100)}%`}
            />
            <StatItem
              label="Reviewing"
              value={reviewingVerses}
              subValue={`${Math.round((reviewingVerses / (verses.length || 1)) * 100)}%`}
            />
            <StatItem
              label="Learning"
              value={learningVerses}
              subValue={`${Math.round((learningVerses / (verses.length || 1)) * 100)}%`}
            />
          </StatSection>

          {/* Prayer Stats */}
          <StatSection title="Prayer Journal" icon={Heart}>
            <StatItem
              label="Total Prayers"
              value={prayers.length}
              subValue={`${periodPrayers.length} in selected period`}
              icon={Heart}
              color="text-rose-500"
            />
            <StatItem
              label="Active Prayers"
              value={activePrayers}
            />
            <StatItem
              label="Answered Prayers"
              value={answeredPrayers}
              subValue={`${Math.round((answeredPrayers / (prayers.length || 1)) * 100)}% answer rate`}
            />
            <StatItem
              label="Most Common Category"
              value={
                Object.entries(prayerCategories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
              }
            />
          </StatSection>
        </div>

        {/* Sessions by Day Chart */}
        <StatSection title="Sessions by Day of Week" icon={Calendar}>
          <div className="space-y-3 mt-4">
            <ChartBar label="Sun" value={sessionsByDay[0]} max={maxSessionsPerDay} color="bg-brand-400" />
            <ChartBar label="Mon" value={sessionsByDay[1]} max={maxSessionsPerDay} color="bg-brand-500" />
            <ChartBar label="Tue" value={sessionsByDay[2]} max={maxSessionsPerDay} color="bg-brand-500" />
            <ChartBar label="Wed" value={sessionsByDay[3]} max={maxSessionsPerDay} color="bg-brand-500" />
            <ChartBar label="Thu" value={sessionsByDay[4]} max={maxSessionsPerDay} color="bg-brand-500" />
            <ChartBar label="Fri" value={sessionsByDay[5]} max={maxSessionsPerDay} color="bg-brand-500" />
            <ChartBar label="Sat" value={sessionsByDay[6]} max={maxSessionsPerDay} color="bg-brand-400" />
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Most active day:{' '}
            <span className="font-medium text-gray-700">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
                sessionsByDay.indexOf(maxSessionsPerDay)
              ]}
            </span>
          </p>
        </StatSection>
      </div>
    </DashboardLayout>
  );
}

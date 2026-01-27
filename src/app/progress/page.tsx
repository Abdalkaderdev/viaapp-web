'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { UserStats } from '@shared/types';
import {
  TrendingUp,
  Award,
  Flame,
  BarChart3,
  ChevronRight,
  Clock,
  BookOpen,
  Brain,
  Heart,
  Target,
  Loader2,
  Calendar,
  Zap,
} from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

function ProgressCard({ title, value, subtitle, icon: Icon, color, trend }: ProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

interface QuickLinkProps {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

function QuickLink({ href, title, description, icon: Icon, color }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function ProgressRing({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-100"
        />
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.user.getStats();
        if (result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
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

  // Calculate weekly goal progress (assuming goal of 7 sessions/week)
  const weeklyGoal = 7;
  const weeklyProgress = stats?.monthlyQuietTimeCount ? Math.min(stats.monthlyQuietTimeCount, weeklyGoal) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-brand-500" />
            Your Progress
          </h1>
          <p className="text-gray-600 mt-1">Track your spiritual growth journey</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <ProgressCard
                title="Current Streak"
                value={stats?.currentStreak || 0}
                subtitle={`Longest: ${stats?.longestStreak || 0} days`}
                icon={Flame}
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                trend={stats?.currentStreak && stats.currentStreak > 0 ? 'Active' : undefined}
              />
              <ProgressCard
                title="Total Sessions"
                value={stats?.totalSessions || 0}
                subtitle="All-time quiet times"
                icon={Clock}
                color="bg-gradient-to-br from-brand-500 to-brand-600"
              />
              <ProgressCard
                title="Verses Memorized"
                value={stats?.totalVersesMemorized || 0}
                subtitle="Scripture committed to heart"
                icon={Brain}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <ProgressCard
                title="Reading Time"
                value={formatTime(stats?.totalReadingTimeSeconds || 0)}
                subtitle="Time in God's Word"
                icon={BookOpen}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
            </>
          )}
        </div>

        {/* Goals & Quick Links Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Goal Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-500" />
              Weekly Goal
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <ProgressRing value={weeklyProgress} max={weeklyGoal} color="text-brand-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyProgress} / {weeklyGoal}
                  </p>
                  <p className="text-sm text-gray-500">Sessions this week</p>
                  {weeklyProgress >= weeklyGoal ? (
                    <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Goal achieved!
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">
                      {weeklyGoal - weeklyProgress} more to go
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              This Month
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quiet Times</span>
                  <span className="font-semibold text-gray-900">{stats?.monthlyQuietTimeCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reading Plans</span>
                  <span className="font-semibold text-gray-900">{stats?.readingPlansStarted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Prayers</span>
                  <span className="font-semibold text-gray-900">{stats?.totalPrayers || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Milestones Preview */}
          <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6 border border-brand-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              Recent Achievement
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : stats?.currentStreak && stats.currentStreak >= 7 ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Week Warrior</p>
                  <p className="text-sm text-gray-600">7+ day streak achieved!</p>
                </div>
              </div>
            ) : stats?.totalSessions && stats.totalSessions >= 1 ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">First Steps</p>
                  <p className="text-sm text-gray-600">Completed your first QT!</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Complete your first quiet time to earn badges!</p>
                <Link
                  href="/quiet-time"
                  className="inline-flex items-center gap-2 text-brand-600 font-medium mt-2 hover:text-brand-700"
                >
                  Start now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickLink
            href="/progress/badges"
            title="Achievement Badges"
            description="View all your earned badges"
            icon={Award}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <QuickLink
            href="/progress/streaks"
            title="Streak History"
            description="Track your consistency"
            icon={Flame}
            color="bg-gradient-to-br from-rose-500 to-pink-500"
          />
          <QuickLink
            href="/progress/statistics"
            title="Detailed Statistics"
            description="Deep dive into your data"
            icon={BarChart3}
            color="bg-gradient-to-br from-blue-500 to-indigo-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

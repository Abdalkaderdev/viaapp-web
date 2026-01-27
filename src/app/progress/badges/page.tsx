'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { UserStats } from '@shared/types';
import {
  Award,
  ArrowLeft,
  Flame,
  BookOpen,
  Brain,
  Heart,
  Clock,
  Trophy,
  Star,
  Zap,
  Target,
  Sparkles,
  Crown,
  Loader2,
  Lock,
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  requirement: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = badge.icon;
  const progressPercentage = badge.maxProgress && badge.progress !== undefined
    ? Math.min((badge.progress / badge.maxProgress) * 100, 100)
    : 0;

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-sm border transition-all ${
        badge.earned
          ? 'border-amber-200 hover:shadow-md'
          : 'border-gray-100 opacity-75 hover:opacity-100'
      }`}
    >
      {/* Badge Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            badge.earned ? badge.bgColor : 'bg-gray-100'
          } ${badge.earned ? 'shadow-lg' : ''}`}
        >
          {badge.earned ? (
            <Icon className={`w-8 h-8 ${badge.color}`} />
          ) : (
            <Lock className="w-8 h-8 text-gray-400" />
          )}
        </div>
        {badge.earned && (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">Earned</span>
          </div>
        )}
      </div>

      {/* Badge Info */}
      <h3 className={`font-semibold text-lg ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
        {badge.name}
      </h3>
      <p className={`text-sm mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
        {badge.description}
      </p>

      {/* Progress or Earned Date */}
      {badge.earned ? (
        <p className="text-xs text-gray-400 mt-3">
          {badge.earnedDate || 'Achievement unlocked!'}
        </p>
      ) : badge.maxProgress && badge.progress !== undefined ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-700">
              {badge.progress} / {badge.maxProgress}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-3">{badge.requirement}</p>
      )}
    </div>
  );
}

function BadgeSection({ title, badges }: { title: string; badges: Badge[] }) {
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {earnedCount} / {badges.length} earned
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

export default function BadgesPage() {
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

  // Generate badges based on user stats
  const streakBadges: Badge[] = [
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100',
      requirement: 'Complete QT for 7 consecutive days',
      earned: (stats?.longestStreak || 0) >= 7,
      progress: Math.min(stats?.currentStreak || 0, 7),
      maxProgress: 7,
    },
    {
      id: 'streak-14',
      name: 'Fortnight Faithful',
      description: 'Maintain a 14-day streak',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-100',
      requirement: 'Complete QT for 14 consecutive days',
      earned: (stats?.longestStreak || 0) >= 14,
      progress: Math.min(stats?.currentStreak || 0, 14),
      maxProgress: 14,
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-100 to-pink-100',
      requirement: 'Complete QT for 30 consecutive days',
      earned: (stats?.longestStreak || 0) >= 30,
      progress: Math.min(stats?.currentStreak || 0, 30),
      maxProgress: 30,
    },
    {
      id: 'streak-90',
      name: 'Quarterly Champion',
      description: 'Maintain a 90-day streak',
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-100',
      requirement: 'Complete QT for 90 consecutive days',
      earned: (stats?.longestStreak || 0) >= 90,
      progress: Math.min(stats?.currentStreak || 0, 90),
      maxProgress: 90,
    },
    {
      id: 'streak-365',
      name: 'Year of Devotion',
      description: 'Maintain a 365-day streak',
      icon: Crown,
      color: 'text-amber-500',
      bgColor: 'bg-gradient-to-br from-amber-200 to-yellow-100',
      requirement: 'Complete QT for 365 consecutive days',
      earned: (stats?.longestStreak || 0) >= 365,
      progress: Math.min(stats?.currentStreak || 0, 365),
      maxProgress: 365,
    },
  ];

  const quietTimeBadges: Badge[] = [
    {
      id: 'qt-1',
      name: 'First Steps',
      description: 'Complete your first quiet time',
      icon: BookOpen,
      color: 'text-brand-600',
      bgColor: 'bg-gradient-to-br from-brand-100 to-teal-100',
      requirement: 'Complete 1 quiet time session',
      earned: (stats?.totalSessions || 0) >= 1,
    },
    {
      id: 'qt-10',
      name: 'Growing Strong',
      description: 'Complete 10 quiet times',
      icon: Sparkles,
      color: 'text-teal-600',
      bgColor: 'bg-gradient-to-br from-teal-100 to-cyan-100',
      requirement: 'Complete 10 quiet time sessions',
      earned: (stats?.totalSessions || 0) >= 10,
      progress: Math.min(stats?.totalSessions || 0, 10),
      maxProgress: 10,
    },
    {
      id: 'qt-50',
      name: 'Dedicated Disciple',
      description: 'Complete 50 quiet times',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      requirement: 'Complete 50 quiet time sessions',
      earned: (stats?.totalSessions || 0) >= 50,
      progress: Math.min(stats?.totalSessions || 0, 50),
      maxProgress: 50,
    },
    {
      id: 'qt-100',
      name: 'Century of Faith',
      description: 'Complete 100 quiet times',
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      requirement: 'Complete 100 quiet time sessions',
      earned: (stats?.totalSessions || 0) >= 100,
      progress: Math.min(stats?.totalSessions || 0, 100),
      maxProgress: 100,
    },
  ];

  const memoryBadges: Badge[] = [
    {
      id: 'memory-1',
      name: 'Word Keeper',
      description: 'Memorize your first verse',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      requirement: 'Memorize 1 verse',
      earned: (stats?.totalVersesMemorized || 0) >= 1,
    },
    {
      id: 'memory-10',
      name: 'Scripture Scholar',
      description: 'Memorize 10 verses',
      icon: Brain,
      color: 'text-fuchsia-600',
      bgColor: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
      requirement: 'Memorize 10 verses',
      earned: (stats?.totalVersesMemorized || 0) >= 10,
      progress: Math.min(stats?.totalVersesMemorized || 0, 10),
      maxProgress: 10,
    },
    {
      id: 'memory-25',
      name: 'Bible Bank',
      description: 'Memorize 25 verses',
      icon: Star,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
      requirement: 'Memorize 25 verses',
      earned: (stats?.totalVersesMemorized || 0) >= 25,
      progress: Math.min(stats?.totalVersesMemorized || 0, 25),
      maxProgress: 25,
    },
  ];

  const prayerBadges: Badge[] = [
    {
      id: 'prayer-1',
      name: 'Prayer Warrior',
      description: 'Add your first prayer',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-gradient-to-br from-rose-100 to-red-100',
      requirement: 'Add 1 prayer request',
      earned: (stats?.totalPrayers || 0) >= 1,
    },
    {
      id: 'prayer-10',
      name: 'Faithful Petitioner',
      description: 'Add 10 prayers',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-100 to-orange-100',
      requirement: 'Add 10 prayer requests',
      earned: (stats?.totalPrayers || 0) >= 10,
      progress: Math.min(stats?.totalPrayers || 0, 10),
      maxProgress: 10,
    },
  ];

  const timeBadges: Badge[] = [
    {
      id: 'time-1h',
      name: 'Hour of Power',
      description: 'Spend 1 hour in devotion',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      requirement: 'Accumulate 1 hour of reading time',
      earned: (stats?.totalReadingTimeSeconds || 0) >= 3600,
      progress: Math.min(Math.floor((stats?.totalReadingTimeSeconds || 0) / 60), 60),
      maxProgress: 60,
    },
    {
      id: 'time-10h',
      name: 'Devoted Reader',
      description: 'Spend 10 hours in devotion',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-gradient-to-br from-cyan-100 to-teal-100',
      requirement: 'Accumulate 10 hours of reading time',
      earned: (stats?.totalReadingTimeSeconds || 0) >= 36000,
      progress: Math.min(Math.floor((stats?.totalReadingTimeSeconds || 0) / 3600), 10),
      maxProgress: 10,
    },
  ];

  const totalBadges = [
    ...streakBadges,
    ...quietTimeBadges,
    ...memoryBadges,
    ...prayerBadges,
    ...timeBadges,
  ];
  const earnedBadges = totalBadges.filter(b => b.earned);

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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            Achievement Badges
          </h1>
          <p className="text-gray-600 mt-1">
            You have earned {earnedBadges.length} of {totalBadges.length} badges
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-900">{earnedBadges.length}</p>
              <p className="text-amber-700 font-medium">Badges Earned</p>
              <div className="mt-2 h-2 w-48 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${(earnedBadges.length / totalBadges.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Badge Sections */}
        <BadgeSection title="Streak Badges" badges={streakBadges} />
        <BadgeSection title="Quiet Time Badges" badges={quietTimeBadges} />
        <BadgeSection title="Memory Verse Badges" badges={memoryBadges} />
        <BadgeSection title="Prayer Badges" badges={prayerBadges} />
        <BadgeSection title="Time Spent Badges" badges={timeBadges} />
      </div>
    </DashboardLayout>
  );
}

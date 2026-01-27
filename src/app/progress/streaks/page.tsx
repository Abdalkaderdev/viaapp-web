'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { UserStats, QuietTimeSession } from '@shared/types';
import {
  Flame,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DayStatus {
  date: Date;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
}

function StreakMilestone({
  days,
  current,
  label,
  icon: Icon,
}: {
  days: number;
  current: number;
  label: string;
  icon: React.ElementType;
}) {
  const achieved = current >= days;
  const progress = Math.min((current / days) * 100, 100);

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all ${
        achieved
          ? 'border-amber-200 shadow-md'
          : 'border-gray-100 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            achieved
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg'
              : 'bg-gray-100'
          }`}
        >
          <Icon className={`w-7 h-7 ${achieved ? 'text-white' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${achieved ? 'text-amber-900' : 'text-gray-700'}`}>
              {label}
            </h3>
            <span className={`text-sm font-medium ${achieved ? 'text-amber-600' : 'text-gray-500'}`}>
              {days} days
            </span>
          </div>
          {!achieved && (
            <div className="mt-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {days - current} more days to go
              </p>
            </div>
          )}
          {achieved && (
            <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Milestone achieved!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarView({
  sessions,
  currentMonth,
  onMonthChange,
}: {
  sessions: QuietTimeSession[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get first day of month and last day of month
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();

  // Create array of days
  const days: DayStatus[] = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startDayOfWeek; i++) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - (startDayOfWeek - i));
    days.push({
      date,
      completed: false,
      isToday: false,
      isFuture: false,
    });
  }

  // Add days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    date.setHours(0, 0, 0, 0);

    // Check if there's a session on this day
    const hasSession = sessions.some((session) => {
      const sessionDate = new Date(session.completedAt || session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
    });

    days.push({
      date,
      completed: hasSession,
      isToday: date.getTime() === today.getTime(),
      isFuture: date.getTime() > today.getTime(),
    });
  }

  // Fill remaining cells to complete the grid
  const remainingCells = 42 - days.length; // 6 rows x 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(lastDay);
    date.setDate(date.getDate() + i);
    days.push({
      date,
      completed: false,
      isToday: false,
      isFuture: true,
    });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const isCurrentMonthOrFuture = currentMonth.getMonth() >= today.getMonth() &&
    currentMonth.getFullYear() >= today.getFullYear();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonthOrFuture}
          className={`p-2 rounded-lg transition-colors ${
            isCurrentMonthOrFuture
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                !isCurrentMonth
                  ? 'text-gray-300'
                  : day.isFuture
                  ? 'text-gray-300'
                  : day.isToday
                  ? 'ring-2 ring-brand-500 font-bold'
                  : ''
              } ${
                day.completed && isCurrentMonth
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white font-medium shadow-sm'
                  : isCurrentMonth && !day.isFuture
                  ? 'bg-gray-50 text-gray-700'
                  : ''
              }`}
            >
              {day.date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-amber-500" />
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
          <span className="text-sm text-gray-600">Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white ring-2 ring-brand-500" />
          <span className="text-sm text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
}

export default function StreaksPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<QuietTimeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResult, sessionsResult] = await Promise.all([
          api.user.getStats(),
          api.quietTime.getSessions({ limit: 100 }),
        ]);

        if (statsResult.data) {
          setStats(statsResult.data);
        }

        if (sessionsResult.data?.data) {
          setSessions(sessionsResult.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const milestones = [
    { days: 7, label: 'Week Warrior', icon: Flame },
    { days: 14, label: 'Fortnight Faithful', icon: Flame },
    { days: 30, label: 'Monthly Master', icon: Zap },
    { days: 60, label: 'Double Month', icon: TrendingUp },
    { days: 90, label: 'Quarterly Champion', icon: Award },
    { days: 180, label: 'Half Year Hero', icon: Target },
    { days: 365, label: 'Year of Devotion', icon: Award },
  ];

  // Find current milestone and next milestone
  const currentStreak = stats?.currentStreak || 0;
  const currentMilestone = [...milestones].reverse().find(m => currentStreak >= m.days);
  const nextMilestone = milestones.find(m => currentStreak < m.days) || milestones[milestones.length - 1];

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
            <Flame className="w-8 h-8 text-amber-500" />
            Streak Tracking
          </h1>
          <p className="text-gray-600 mt-1">Track your consistency and build lasting habits</p>
        </div>

        {/* Current Streak Hero */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-amber-100 font-medium mb-1">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">{stats?.currentStreak || 0}</span>
                <span className="text-2xl text-amber-100">days</span>
              </div>
              {currentMilestone && (
                <p className="text-amber-100 mt-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {currentMilestone.label} achieved!
                </p>
              )}
            </div>
            <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-amber-100 text-sm">Longest Streak</p>
                  <p className="text-3xl font-bold">{stats?.longestStreak || 0}</p>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <p className="text-amber-100 text-sm">Next Milestone</p>
                  <p className="text-3xl font-bold">{nextMilestone.days}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-100">Progress to {nextMilestone.label}</span>
              <span className="font-medium">
                {currentStreak} / {nextMilestone.days} days
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentStreak / nextMilestone.days) * 100, 100)}%` }}
              />
            </div>
            <p className="text-amber-100 text-sm mt-2">
              {nextMilestone.days - currentStreak > 0
                ? `${nextMilestone.days - currentStreak} more days to reach ${nextMilestone.label}`
                : `Congratulations! You've reached ${nextMilestone.label}!`}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar View */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Activity Calendar
            </h2>
            <CalendarView
              sessions={sessions}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-500" />
              Milestones
            </h2>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <StreakMilestone
                  key={milestone.days}
                  days={milestone.days}
                  current={stats?.longestStreak || 0}
                  label={milestone.label}
                  icon={milestone.icon}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6 border border-brand-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-600" />
            Tips for Building Your Streak
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Set a Daily Reminder</p>
                <p className="text-sm text-gray-600">
                  Choose a consistent time each day for your quiet time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Start Small</p>
                <p className="text-sm text-gray-600">
                  Even 5 minutes counts! Build the habit first.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Find a Partner</p>
                <p className="text-sm text-gray-600">
                  Accountability helps maintain consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

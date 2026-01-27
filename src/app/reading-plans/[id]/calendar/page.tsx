'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { ReadingPlan, UserReadingProgress } from '@shared/types';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  Trophy,
  Flame,
  Target,
  Info,
} from 'lucide-react';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCurrentMonth: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function CalendarGrid({
  days,
  onDayClick,
  selectedDay,
}: {
  days: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  selectedDay: CalendarDay | null;
}) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isSelected = selectedDay && isSameDay(day.date, selectedDay.date);

          return (
            <button
              key={index}
              onClick={() => onDayClick(day)}
              disabled={!day.isCurrentMonth || day.dayNumber === 0}
              className={`
                relative aspect-square p-1 sm:p-2 border-b border-r border-gray-100
                transition-all duration-150
                ${!day.isCurrentMonth ? 'bg-gray-50 cursor-default' : 'hover:bg-gray-50 cursor-pointer'}
                ${isSelected ? 'bg-brand-50 ring-2 ring-brand-500 ring-inset' : ''}
                ${day.isToday ? 'bg-amber-50' : ''}
              `}
            >
              {day.isCurrentMonth && day.dayNumber > 0 && (
                <>
                  {/* Day Number */}
                  <span
                    className={`
                      block text-sm sm:text-base font-medium mb-1
                      ${day.isCompleted ? 'text-green-600' : day.isPast ? 'text-red-500' : 'text-gray-700'}
                      ${day.isToday ? 'text-amber-700 font-bold' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </span>

                  {/* Reading Day Indicator */}
                  <div className="flex items-center justify-center">
                    {day.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    ) : day.isPast ? (
                      <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />
                    ) : day.isToday ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Plan Day Number */}
                  <span className="hidden sm:block text-xs text-gray-400 mt-1">
                    Day {day.dayNumber}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {current} of {total} days completed
        </span>
        <span className="font-medium text-brand-600">{percentage}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-current" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  );
}

export default function PlanCalendarPage() {
  const params = useParams();
  const planId = params.id as string;

  const [plan, setPlan] = useState<ReadingPlan | null>(null);
  const [progress, setProgress] = useState<UserReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [plansResult, progressResult] = await Promise.all([
          api.readingPlans.getPlans(),
          api.readingPlans.getProgress(),
        ]);

        if (plansResult.data) {
          const foundPlan = plansResult.data.find((p) => p.id === planId);
          if (foundPlan) {
            setPlan(foundPlan);
          }
        }

        if (progressResult.data) {
          const foundProgress = progressResult.data.find((p) => p.planId === planId);
          if (foundProgress) {
            setProgress(foundProgress);
            // Set current month to the start date
            setCurrentMonth(new Date(foundProgress.startedAt));
          }
        }
      } catch (error) {
        console.error('Failed to fetch plan data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [planId]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    if (!progress || !plan) return [];

    const startDate = new Date(progress.startedAt);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of week the month starts on (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();

    // Calculate the number of days to show from previous month
    const daysFromPrevMonth = startDayOfWeek;

    // Calculate total cells needed (must be divisible by 7)
    const totalDays = lastDay.getDate();
    const totalCells = Math.ceil((daysFromPrevMonth + totalDays) / 7) * 7;

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - daysFromPrevMonth;
      const date = new Date(year, month, dayOffset + 1);
      const isCurrentMonth = date.getMonth() === month;

      // Calculate which day of the reading plan this is
      const daysSinceStart = Math.floor(
        (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const planDayNumber = daysSinceStart + 1;

      // Is this day part of the reading plan?
      const isPartOfPlan = planDayNumber >= 1 && planDayNumber <= plan.durationDays;
      const isCompleted = isPartOfPlan && planDayNumber <= progress.currentDay;
      const isToday = isSameDay(date, today);
      const isPast = date < today && !isToday;
      const isFuture = date > today;

      days.push({
        date,
        dayNumber: isPartOfPlan ? planDayNumber : 0,
        isCompleted,
        isToday,
        isPast: isPast && isPartOfPlan && !isCompleted,
        isFuture,
        isCurrentMonth,
      });
    }

    return days;
  }, [currentMonth, progress, plan]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
    setSelectedDay(null);
  };

  // Calculate stats
  const daysRemaining = plan ? plan.durationDays - (progress?.currentDay || 0) : 0;
  const isCompleted = progress?.completedAt !== null && progress?.completedAt !== undefined;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/reading-plans/active"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Active Plans
            </Link>
          </div>
          <LoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!plan || !progress) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/reading-plans/active"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Active Plans
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Not Found</h3>
            <p className="text-gray-500 mb-6">
              This reading plan could not be found or you haven&apos;t started it yet.
            </p>
            <Link
              href="/quiet-time/reading-plans"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Browse Reading Plans
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/reading-plans/active"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Active Plans
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Completed!</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <ProgressBar current={progress.currentDay} total={plan.durationDays} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={Calendar}
            label="Current Day"
            value={`Day ${progress.currentDay}`}
            color="bg-brand-100 text-brand-600"
          />
          <StatsCard
            icon={Target}
            label="Total Days"
            value={plan.durationDays}
            color="bg-blue-100 text-blue-600"
          />
          <StatsCard
            icon={Clock}
            label="Days Left"
            value={daysRemaining}
            color="bg-amber-100 text-amber-600"
          />
          <StatsCard
            icon={Flame}
            label="Completion"
            value={`${Math.round((progress.currentDay / plan.durationDays) * 100)}%`}
            color="bg-green-100 text-green-600"
          />
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          days={calendarDays}
          onDayClick={setSelectedDay}
          selectedDay={selectedDay}
        />

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
              <Play className="w-3 h-3 text-white" />
            </div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-red-300" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-gray-300" />
            <span>Upcoming</span>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay && selectedDay.dayNumber > 0 && (
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Day {selectedDay.dayNumber} - {formatDate(selectedDay.date)}
                </h3>
                <p className="text-gray-500 mt-1">
                  {selectedDay.isCompleted
                    ? 'You completed this day\'s reading!'
                    : selectedDay.isPast
                    ? 'This reading was missed'
                    : selectedDay.isToday
                    ? 'Today\'s reading'
                    : 'Upcoming reading'}
                </p>
              </div>
              {selectedDay.isCompleted ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Done</span>
                </div>
              ) : selectedDay.isToday ? (
                <Link
                  href="/bible"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Read Now
                </Link>
              ) : null}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/reading-plans/active"
            className="text-gray-600 hover:text-brand-600 transition-colors"
          >
            View Active Plans
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/reading-plans/history"
            className="text-gray-600 hover:text-brand-600 transition-colors"
          >
            View Completed Plans
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

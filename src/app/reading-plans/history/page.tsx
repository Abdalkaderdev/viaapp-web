'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { ReadingPlan, UserReadingProgress } from '@shared/types';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Sparkles,
  Award,
  Star,
  Filter,
} from 'lucide-react';

interface CompletedPlanWithDetails extends UserReadingProgress {
  plan?: ReadingPlan;
}

type SortOption = 'recent' | 'oldest' | 'duration';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function calculateDurationDays(startedAt: string, completedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function CompletedPlanCard({
  progress,
  plan,
}: {
  progress: UserReadingProgress;
  plan?: ReadingPlan;
}) {
  const actualDuration = progress.completedAt
    ? calculateDurationDays(progress.startedAt, progress.completedAt)
    : 0;
  const expectedDuration = plan?.durationDays || 0;
  const completedEarly = actualDuration < expectedDuration;
  const completedOnTime = actualDuration === expectedDuration;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        {/* Completion Badge */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
          {completedEarly && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Plan Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
              {plan?.name || 'Reading Plan'}
            </h3>
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
            {plan?.description || 'Completed reading plan'}
          </p>

          {/* Completion Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              Completed {progress.completedAt ? formatDate(progress.completedAt) : 'N/A'}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              {actualDuration} days
            </span>
            {completedEarly && (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Sparkles className="w-4 h-4" />
                {expectedDuration - actualDuration} days early!
              </span>
            )}
            {completedOnTime && (
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <Award className="w-4 h-4" />
                On schedule
              </span>
            )}
          </div>
        </div>

        {/* View Calendar */}
        <Link
          href={`/reading-plans/${progress.planId}/calendar`}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">View</span>
        </Link>
      </div>

      {/* Time Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-500">
            Started: {formatDate(progress.startedAt)}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">
            {plan?.durationDays || progress.currentDay} readings completed
          </span>
        </div>
        {plan && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              plan.difficulty === 'beginner'
                ? 'bg-green-100 text-green-700'
                : plan.difficulty === 'intermediate'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Plans Yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Once you complete a reading plan, it will appear here. Start a plan today and track your
        journey through God&apos;s Word!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/reading-plans/active"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          View Active Plans
        </Link>
        <Link
          href="/quiet-time/reading-plans"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          Start a New Plan
        </Link>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
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

export default function ReadingPlansHistoryPage() {
  const [completedPlans, setCompletedPlans] = useState<CompletedPlanWithDetails[]>([]);
  const [allPlans, setAllPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressResult, plansResult] = await Promise.all([
          api.readingPlans.getProgress(),
          api.readingPlans.getPlans(),
        ]);

        if (plansResult.data) {
          setAllPlans(plansResult.data);
        }

        if (progressResult.data) {
          // Filter to only completed plans
          const completed = progressResult.data.filter((p) => p.completedAt);
          setCompletedPlans(completed);
        }
      } catch (error) {
        console.error('Failed to fetch reading plans:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const getPlanById = (planId: string) => allPlans.find((p) => p.id === planId);

  // Sort plans
  const sortedPlans = [...completedPlans].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
      case 'oldest':
        return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
      case 'duration':
        const planA = getPlanById(a.planId);
        const planB = getPlanById(b.planId);
        return (planB?.durationDays || 0) - (planA?.durationDays || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalReadings = completedPlans.reduce((sum, p) => {
    const plan = getPlanById(p.planId);
    return sum + (plan?.durationDays || p.currentDay);
  }, 0);

  const totalDays = completedPlans.reduce((sum, p) => {
    if (p.completedAt) {
      return sum + calculateDurationDays(p.startedAt, p.completedAt);
    }
    return sum;
  }, 0);

  const avgCompletionRate = completedPlans.length > 0 ? Math.round(totalDays / completedPlans.length) : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/quiet-time/reading-plans"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Plans
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Completed Reading Plans</h1>
            <p className="text-gray-600 mt-1">Your reading plan accomplishments</p>
          </div>
          <LoadingSkeleton />
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
            href="/quiet-time/reading-plans"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Plans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Completed Reading Plans</h1>
          <p className="text-gray-600 mt-1">Your reading plan accomplishments</p>
        </div>

        {completedPlans.length > 0 && (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={Trophy}
                label="Plans Completed"
                value={completedPlans.length}
                color="bg-green-100 text-green-600"
              />
              <StatsCard
                icon={BookOpen}
                label="Total Readings"
                value={totalReadings}
                color="bg-brand-100 text-brand-600"
              />
              <StatsCard
                icon={Calendar}
                label="Total Days"
                value={totalDays}
                color="bg-blue-100 text-blue-600"
              />
              <StatsCard
                icon={Clock}
                label="Avg Days/Plan"
                value={avgCompletionRate}
                color="bg-purple-100 text-purple-600"
              />
            </div>

            {/* Filter/Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {completedPlans.length} plan{completedPlans.length !== 1 ? 's' : ''} completed
              </p>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>

            {/* Completed Plans List */}
            <div className="space-y-4">
              {sortedPlans.map((progress) => (
                <CompletedPlanCard
                  key={progress.id}
                  progress={progress}
                  plan={getPlanById(progress.planId)}
                />
              ))}
            </div>

            {/* Achievement Banner */}
            {completedPlans.length >= 5 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Bible Study Champion!</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      You&apos;ve completed {completedPlans.length} reading plans. Keep up the amazing
                      dedication to God&apos;s Word!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {completedPlans.length === 0 && <EmptyState />}

        {/* Link to Active Plans */}
        <div className="mt-8 text-center">
          <Link
            href="/reading-plans/active"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
          >
            View active plans
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

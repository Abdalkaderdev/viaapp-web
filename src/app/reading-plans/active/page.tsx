'use client';
export const dynamic = 'force-dynamic';

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
  Play,
  TrendingUp,
} from 'lucide-react';

interface ActivePlanWithDetails extends UserReadingProgress {
  plan?: ReadingPlan;
}

function ProgressRing({ progress, size = 64 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-gray-200"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="text-brand-500 transition-all duration-500"
      />
    </svg>
  );
}

function ActivePlanCard({
  progress,
  plan,
  onContinue,
}: {
  progress: UserReadingProgress;
  plan?: ReadingPlan;
  onContinue: () => void;
}) {
  const progressPercent = plan
    ? Math.round((progress.currentDay / plan.durationDays) * 100)
    : 0;
  const daysRemaining = plan ? plan.durationDays - progress.currentDay : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <ProgressRing progress={progressPercent} size={72} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-600">{progressPercent}%</span>
          </div>
        </div>

        {/* Plan Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {plan?.name || 'Reading Plan'}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {plan?.description || 'Continue your reading journey'}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              Day {progress.currentDay} of {plan?.durationDays || '?'}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              {daysRemaining} days left
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
        <button
          onClick={onContinue}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
        >
          <Play className="w-4 h-4" />
          Continue Reading
        </button>
        <Link
          href={`/reading-plans/${progress.planId}/calendar`}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
      <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-brand-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Reading Plans</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Start a reading plan to build a consistent habit of studying God&apos;s Word.
        Choose from beginner to advanced plans.
      </p>
      <Link
        href="/quiet-time/reading-plans"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
      >
        <BookOpen className="w-5 h-5" />
        Browse Reading Plans
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-[72px] h-[72px] bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
            <div className="w-28 h-10 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActiveReadingPlansPage() {
  const [activePlans, setActivePlans] = useState<ActivePlanWithDetails[]>([]);
  const [allPlans, setAllPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

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
          // Filter to only active plans
          const active = progressResult.data.filter((p) => p.isActive && !p.completedAt);
          setActivePlans(active);
        }
      } catch (error) {
        console.error('Failed to fetch reading plans:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCompleteDay = async (progressId: string) => {
    setCompleting(progressId);
    try {
      const result = await api.readingPlans.completeDay(progressId);
      if (result.data) {
        setActivePlans((prev) =>
          prev.map((p) =>
            p.id === progressId
              ? { ...p, currentDay: result.data!.currentDay, completedAt: result.data!.completedAt }
              : p
          ).filter((p) => !p.completedAt)
        );
      }
    } catch (error) {
      console.error('Failed to complete day:', error);
    }
    setCompleting(null);
  };

  const getPlanById = (planId: string) => allPlans.find((p) => p.id === planId);

  // Calculate overall stats
  const totalDaysCompleted = activePlans.reduce((sum, p) => sum + p.currentDay, 0);
  const totalDaysRemaining = activePlans.reduce((sum, p) => {
    const plan = getPlanById(p.planId);
    return sum + (plan ? plan.durationDays - p.currentDay : 0);
  }, 0);

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
            <h1 className="text-3xl font-bold text-gray-900">Active Reading Plans</h1>
            <p className="text-gray-600 mt-1">Track your progress and continue reading</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Active Reading Plans</h1>
          <p className="text-gray-600 mt-1">Track your progress and continue reading</p>
        </div>

        {activePlans.length > 0 && (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Plans</p>
                    <p className="text-xl font-bold text-gray-900">{activePlans.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Days Done</p>
                    <p className="text-xl font-bold text-gray-900">{totalDaysCompleted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Days Left</p>
                    <p className="text-xl font-bold text-gray-900">{totalDaysRemaining}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Progress</p>
                    <p className="text-xl font-bold text-gray-900">
                      {activePlans.length > 0
                        ? Math.round(
                            activePlans.reduce((sum, p) => {
                              const plan = getPlanById(p.planId);
                              return sum + (plan ? (p.currentDay / plan.durationDays) * 100 : 0);
                            }, 0) / activePlans.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Plans List */}
            <div className="space-y-4">
              {activePlans.map((progress) => (
                <ActivePlanCard
                  key={progress.id}
                  progress={progress}
                  plan={getPlanById(progress.planId)}
                  onContinue={() => handleCompleteDay(progress.id)}
                />
              ))}
            </div>

            {/* Browse More CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-brand-50 to-teal-50 rounded-2xl border border-brand-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Want to add another plan?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Browse our collection of reading plans for all levels
                  </p>
                </div>
                <Link
                  href="/quiet-time/reading-plans"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-brand-700 font-medium rounded-xl hover:bg-brand-50 transition-colors border border-brand-200"
                >
                  Browse Plans
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}

        {activePlans.length === 0 && <EmptyState />}

        {/* Link to History */}
        <div className="mt-8 text-center">
          <Link
            href="/reading-plans/history"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
          >
            View completed plans
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

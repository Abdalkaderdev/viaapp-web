'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { QuietTimeSession, ReadingPlan } from '@shared/types';
import {
  Sun,
  Heart,
  Clock,
  Play,
  BookOpen,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Loader2,
  Compass,
  PenLine,
  BookMarked,
} from 'lucide-react';

type QuietTimeType = 'word_to_life' | 'word_to_heart' | 'guided' | 'custom';

function formatSessionTime(timestamp: string): string {
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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return '< 1 min';
  return `${mins} min`;
}

function QuietTimeContent() {
  const searchParams = useSearchParams();
  const justCompleted = searchParams.get('completed') === 'true';
  const [selectedType, setSelectedType] = useState<QuietTimeType | null>(null);
  const [sessions, setSessions] = useState<QuietTimeSession[]>([]);
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(justCompleted);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionsResult, plansResult] = await Promise.all([
          api.quietTime.getSessions({ limit: 5 }),
          api.readingPlans.getPlans(),
        ]);
        if (sessionsResult.data?.data && Array.isArray(sessionsResult.data.data)) {
          setSessions(sessionsResult.data.data);
        }
        if (plansResult.data && Array.isArray(plansResult.data)) {
          setReadingPlans(plansResult.data);
        }
      } catch (error) {
        console.error('Failed to fetch quiet time data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Session completed!</p>
              <p className="text-sm text-green-700">Great job spending time with God today.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QT Experiences</h1>
          <p className="text-gray-600 mt-1">
            Choose how you want to spend time with God today
          </p>
        </div>

        {/* 4 Quiet Time Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Word to Life */}
          <button
            onClick={() => setSelectedType('word_to_life')}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'word_to_life'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 bg-white hover:border-brand-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Word to Life</h3>
            <p className="text-gray-600 mb-4">
              Apply Scripture to your daily life through guided reflection and journaling.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                15-20 min
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Reading + Reflection
              </span>
            </div>
          </button>

          {/* Word to Heart */}
          <button
            onClick={() => setSelectedType('word_to_heart')}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'word_to_heart'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 bg-white hover:border-brand-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Word to Heart</h3>
            <p className="text-gray-600 mb-4">
              Memorize and meditate on Scripture, hiding God&apos;s Word in your heart.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                10-15 min
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Memorization
              </span>
            </div>
          </button>

          {/* Guided QT */}
          <button
            onClick={() => setSelectedType('guided')}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'guided'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 bg-white hover:border-brand-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Guided QT</h3>
            <p className="text-gray-600 mb-4">
              Follow a structured devotional with prompts and questions to guide your time.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                20-30 min
              </span>
              <span className="flex items-center gap-1">
                <BookMarked className="w-4 h-4" />
                Step-by-step
              </span>
            </div>
          </button>

          {/* Custom QT */}
          <button
            onClick={() => setSelectedType('custom')}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'custom'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 bg-white hover:border-brand-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <PenLine className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Custom QT</h3>
            <p className="text-gray-600 mb-4">
              Create your own quiet time with flexible reading and journaling options.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Flexible
              </span>
              <span className="flex items-center gap-1">
                <PenLine className="w-4 h-4" />
                Your choice
              </span>
            </div>
          </button>
        </div>

        {/* Start Button */}
        {selectedType && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Ready to start your {
                    selectedType === 'word_to_life' ? 'Word to Life' :
                    selectedType === 'word_to_heart' ? 'Word to Heart' :
                    selectedType === 'guided' ? 'Guided QT' : 'Custom QT'
                  } session?
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Find a quiet place and prepare your heart
                </p>
              </div>
              <Link
                href={`/quiet-time/${selectedType}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-5 h-5" />
                Start Session
              </Link>
            </div>
          </div>
        )}

        {/* Reading Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bible Reading Plans</h2>
            <Link
              href="/quiet-time/reading-plans"
              className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
            </div>
          ) : readingPlans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reading plans available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {readingPlans.slice(0, 6).map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-300 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      plan.difficulty === 'beginner' ? 'bg-green-100 text-green-600' :
                      plan.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {plan.durationDays} days • {plan.difficulty}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex-shrink-0">
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sessions yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start your first quiet time to see your history
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        session.type === 'word_to_life' ? 'bg-amber-100' : 'bg-rose-100'
                      }`}
                    >
                      {session.type === 'word_to_life' ? (
                        <Sun className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Heart className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {session.type === 'word_to_life' ? 'Word to Life' : 'Word to Heart'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {session.verseReference || 'Quiet time session'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        {formatDuration(session.durationSeconds)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatSessionTime(session.completedAt || session.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function QuietTimePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    }>
      <QuietTimeContent />
    </Suspense>
  );
}

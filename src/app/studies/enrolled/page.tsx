'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  BookOpen,
  Clock,
  ChevronRight,
  Loader2,
  BookMarked,
  Play,
  CheckCircle2,
  Calendar,
  Trophy,
  ArrowLeft,
  Search,
  Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

// Type definitions
interface EnrolledStudy {
  id: string;
  studyId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  currentLessonId?: string;
  currentLessonTitle?: string;
  startedAt: string;
  lastAccessedAt: string;
  isCompleted: boolean;
  study: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedMinutes: number;
    author?: string;
  };
}

// Mock data
const MOCK_ENROLLED_STUDIES: EnrolledStudy[] = [
  {
    id: 'e1',
    studyId: '1',
    progress: 45,
    completedLessons: 5,
    totalLessons: 12,
    currentLessonId: 'l6',
    currentLessonTitle: 'Sin and Salvation',
    startedAt: '2025-01-10',
    lastAccessedAt: '2025-01-25',
    isCompleted: false,
    study: {
      id: '1',
      title: 'Foundations of Faith',
      description: 'A comprehensive introduction to the core beliefs of Christianity.',
      category: 'new-believer',
      difficulty: 'beginner',
      estimatedMinutes: 180,
      author: 'Pastor John Smith',
    },
  },
  {
    id: 'e2',
    studyId: '5',
    progress: 20,
    completedLessons: 3,
    totalLessons: 14,
    currentLessonId: 'l4',
    currentLessonTitle: 'The Discipline of Silence',
    startedAt: '2025-01-18',
    lastAccessedAt: '2025-01-24',
    isCompleted: false,
    study: {
      id: '5',
      title: 'Walking with God',
      description: 'Daily practices for deepening your relationship with God.',
      category: 'spiritual-growth',
      difficulty: 'beginner',
      estimatedMinutes: 210,
      author: 'Dr. James Wilson',
    },
  },
  {
    id: 'e3',
    studyId: '2',
    progress: 100,
    completedLessons: 8,
    totalLessons: 8,
    startedAt: '2024-12-01',
    lastAccessedAt: '2024-12-20',
    isCompleted: true,
    study: {
      id: '2',
      title: 'Prayer Essentials',
      description: 'Learn how to develop a deeper prayer life.',
      category: 'prayer',
      difficulty: 'beginner',
      estimatedMinutes: 120,
      author: 'Dr. Sarah Lee',
    },
  },
  {
    id: 'e4',
    studyId: '3',
    progress: 100,
    completedLessons: 16,
    totalLessons: 16,
    startedAt: '2024-11-15',
    lastAccessedAt: '2024-12-10',
    isCompleted: true,
    study: {
      id: '3',
      title: 'Understanding the Bible',
      description: 'A guide to reading and applying Scripture.',
      category: 'bible-study',
      difficulty: 'intermediate',
      estimatedMinutes: 240,
      author: 'Rev. Michael Chen',
    },
  },
];

function EnrolledStudyCard({ enrollment }: { enrollment: EnrolledStudy }) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return formatDate(dateStr);
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg',
        enrollment.isCompleted ? 'border-green-200' : 'border-gray-200 hover:border-brand-200'
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          'h-3',
          enrollment.isCompleted
            ? 'bg-gradient-to-r from-green-500 to-green-400'
            : 'bg-gradient-to-r from-brand-500 to-brand-400'
        )}
        style={{ width: `${enrollment.progress}%` }}
      />

      <div className="p-5">
        {/* Study Info */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={clsx(
              'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
              enrollment.isCompleted ? 'bg-green-100' : 'bg-brand-100'
            )}
          >
            {enrollment.isCompleted ? (
              <Trophy className="w-7 h-7 text-green-600" />
            ) : (
              <BookOpen className="w-7 h-7 text-brand-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={clsx(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  difficultyColors[enrollment.study.difficulty]
                )}
              >
                {enrollment.study.difficulty.charAt(0).toUpperCase() + enrollment.study.difficulty.slice(1)}
              </span>
              {enrollment.isCompleted && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 truncate">{enrollment.study.title}</h3>
            <p className="text-sm text-gray-500">{enrollment.study.author}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">
              {enrollment.completedLessons} of {enrollment.totalLessons} lessons
            </span>
            <span
              className={clsx(
                'font-semibold',
                enrollment.isCompleted ? 'text-green-600' : 'text-brand-600'
              )}
            >
              {enrollment.progress}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                enrollment.isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gradient-to-r from-brand-500 to-brand-400'
              )}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        {/* Current Lesson / Last Accessed */}
        {!enrollment.isCompleted && enrollment.currentLessonTitle && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Continue from:</p>
            <p className="text-sm font-medium text-gray-900 truncate">{enrollment.currentLessonTitle}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Started {formatDate(enrollment.startedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysAgo(enrollment.lastAccessedAt)}
            </span>
          </div>

          <Link
            href={
              enrollment.isCompleted
                ? `/studies/${enrollment.studyId}`
                : enrollment.currentLessonId
                  ? `/studies/${enrollment.studyId}/lessons/${enrollment.currentLessonId}`
                  : `/studies/${enrollment.studyId}`
            }
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              enrollment.isCompleted
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            )}
          >
            {enrollment.isCompleted ? (
              <>
                Review
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Continue
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: 'in-progress' | 'completed' | 'all' }) {
  const messages = {
    'in-progress': {
      icon: BookOpen,
      title: 'No studies in progress',
      description: 'Start a new study to begin your learning journey.',
    },
    completed: {
      icon: Trophy,
      title: 'No completed studies yet',
      description: 'Keep learning! Your completed studies will appear here.',
    },
    all: {
      icon: BookMarked,
      title: 'No enrolled studies',
      description: 'Browse our study library to find something to learn.',
    },
  };

  const message = messages[type];
  const Icon = message.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <Icon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.title}</h3>
      <p className="text-gray-500 mb-4">{message.description}</p>
      <Link
        href="/studies"
        className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
      >
        Browse studies
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function EnrolledStudiesPage() {
  const [enrolledStudies, setEnrolledStudies] = useState<EnrolledStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEnrolledStudies();
  }, []);

  async function fetchEnrolledStudies() {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await api.studies.getEnrolled();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEnrolledStudies(MOCK_ENROLLED_STUDIES);
    } catch (error) {
      console.error('Failed to fetch enrolled studies:', error);
    }
    setLoading(false);
  }

  // Filter studies
  const filteredStudies = enrolledStudies.filter((enrollment) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'in-progress' && !enrollment.isCompleted) ||
      (filter === 'completed' && enrollment.isCompleted);

    const matchesSearch =
      searchQuery === '' ||
      enrollment.study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.study.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Sort: in-progress first, then by last accessed
  const sortedStudies = [...filteredStudies].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
  });

  const inProgressCount = enrolledStudies.filter((e) => !e.isCompleted).length;
  const completedCount = enrolledStudies.filter((e) => e.isCompleted).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/studies"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Studies
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-brand-500" />
              My Studies
            </h1>
            <p className="text-gray-600 mt-1">Track your enrolled studies and progress</p>
          </div>
          <Link
            href="/studies/my-progress"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            View Progress
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{enrolledStudies.length}</p>
                <p className="text-sm text-gray-500">Total Enrolled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(['all', 'in-progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    'px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap',
                    filter === f
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Completed'}
                  <span className="ml-1 text-xs">
                    (
                    {f === 'all'
                      ? enrolledStudies.length
                      : f === 'in-progress'
                        ? inProgressCount
                        : completedCount}
                    )
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : sortedStudies.length === 0 ? (
          /* Empty State */
          <EmptyState type={filter} />
        ) : (
          /* Study Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedStudies.map((enrollment) => (
              <EnrolledStudyCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

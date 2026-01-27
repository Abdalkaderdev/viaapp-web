'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Star,
  ChevronRight,
  Loader2,
  Filter,
  GraduationCap,
  BookMarked,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

// Study categories based on FEATURES.md
const STUDY_CATEGORIES = [
  { value: 'all', label: 'All Studies' },
  { value: 'new-believer', label: 'New Believer' },
  { value: 'foundations', label: 'Foundations' },
  { value: 'spiritual-growth', label: 'Spiritual Growth' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'bible-study', label: 'Bible Study' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'theology', label: 'Theology' },
  { value: 'discipleship', label: 'Discipleship' },
  { value: 'evangelism', label: 'Evangelism' },
  { value: 'worship', label: 'Worship' },
  { value: 'family', label: 'Family' },
  { value: 'youth', label: 'Youth' },
  { value: 'missions', label: 'Missions' },
] as const;

const DIFFICULTY_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

// Type definitions
interface Study {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  estimatedMinutes: number;
  enrolledCount: number;
  rating: number;
  imageUrl?: string;
  author?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface EnrolledStudy {
  id: string;
  studyId: string;
  progress: number;
  study?: Study;
}

// Mock data for demonstration (replace with actual API calls)
const MOCK_STUDIES: Study[] = [
  {
    id: '1',
    title: 'Foundations of Faith',
    description: 'A comprehensive introduction to the core beliefs of Christianity for new believers.',
    category: 'new-believer',
    difficulty: 'beginner',
    lessonCount: 12,
    estimatedMinutes: 180,
    enrolledCount: 1542,
    rating: 4.8,
    author: 'Pastor John',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Prayer Essentials',
    description: 'Learn how to develop a deeper prayer life and communicate with God effectively.',
    category: 'prayer',
    difficulty: 'beginner',
    lessonCount: 8,
    estimatedMinutes: 120,
    enrolledCount: 982,
    rating: 4.9,
    author: 'Dr. Sarah Lee',
    isNew: true,
  },
  {
    id: '3',
    title: 'Understanding the Bible',
    description: 'A guide to reading, interpreting, and applying Scripture in your daily life.',
    category: 'bible-study',
    difficulty: 'intermediate',
    lessonCount: 16,
    estimatedMinutes: 240,
    enrolledCount: 756,
    rating: 4.7,
    author: 'Rev. Michael Chen',
  },
  {
    id: '4',
    title: 'Leadership in the Church',
    description: 'Develop servant leadership skills based on biblical principles.',
    category: 'leadership',
    difficulty: 'advanced',
    lessonCount: 10,
    estimatedMinutes: 150,
    enrolledCount: 423,
    rating: 4.6,
    author: 'Pastor Emily Davis',
  },
  {
    id: '5',
    title: 'Walking with God',
    description: 'Daily practices for deepening your relationship with God through spiritual disciplines.',
    category: 'spiritual-growth',
    difficulty: 'beginner',
    lessonCount: 14,
    estimatedMinutes: 210,
    enrolledCount: 1203,
    rating: 4.8,
    author: 'Dr. James Wilson',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Sharing Your Faith',
    description: 'Practical approaches to evangelism and sharing the Gospel with others.',
    category: 'evangelism',
    difficulty: 'intermediate',
    lessonCount: 6,
    estimatedMinutes: 90,
    enrolledCount: 567,
    rating: 4.5,
    author: 'Rev. Lisa Thompson',
  },
];

function StudyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-5">
        <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function StudyCard({ study }: { study: Study }) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <Link
      href={`/studies/${study.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-200"
    >
      {/* Image/Gradient Header */}
      <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-600 relative">
        {study.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {study.isNew && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            New
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-sm font-medium">{study.lessonCount} lessons</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white/30" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', difficultyColors[study.difficulty])}>
            {study.difficulty.charAt(0).toUpperCase() + study.difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-500 capitalize">{study.category.replace('-', ' ')}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-1">
          {study.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{study.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {study.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {study.enrolledCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{study.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [enrolledStudies, setEnrolledStudies] = useState<EnrolledStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStudies();
  }, []);

  async function fetchStudies() {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when endpoint is available
      // const result = await api.studies.getAll();
      // For now, using mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      setStudies(MOCK_STUDIES);

      // Fetch enrolled studies
      // const enrolledResult = await api.studies.getEnrolled();
      setEnrolledStudies([
        { id: '1', studyId: '1', progress: 45 },
        { id: '2', studyId: '5', progress: 20 },
      ]);
    } catch (error) {
      console.error('Failed to fetch studies:', error);
    }
    setLoading(false);
  }

  // Filter studies based on search and filters
  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      searchQuery === '' ||
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || study.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredStudies = filteredStudies.filter((s) => s.isFeatured);
  const regularStudies = filteredStudies.filter((s) => !s.isFeatured);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-brand-500" />
              Studies
            </h1>
            <p className="text-gray-600 mt-1">Explore Bible studies and grow in your faith</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/studies/enrolled"
              className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-100 transition-colors"
            >
              <BookMarked className="w-5 h-5" />
              My Studies
            </Link>
            <Link
              href="/studies/my-progress"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Progress
            </Link>
          </div>
        </div>

        {/* Continue Learning Section */}
        {enrolledStudies.length > 0 && !searchQuery && selectedCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledStudies.slice(0, 2).map((enrolled) => {
                const study = studies.find((s) => s.id === enrolled.studyId);
                if (!study) return null;
                return (
                  <Link
                    key={enrolled.id}
                    href={`/studies/${study.id}`}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-brand-300 hover:shadow-md transition-all"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{study.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all"
                            style={{ width: `${enrolled.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{enrolled.progress}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
              >
                {STUDY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none bg-white"
              >
                {STUDY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none bg-white"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredStudies.length} {filteredStudies.length === 1 ? 'study' : 'studies'} found
          </p>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <StudyCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredStudies.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No studies found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Studies */}
            {featuredStudies.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Featured Studies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredStudies.map((study) => (
                    <StudyCard key={study.id} study={study} />
                  ))}
                </div>
              </div>
            )}

            {/* All Studies */}
            <div>
              {featuredStudies.length > 0 && <h2 className="text-xl font-bold text-gray-900 mb-4">All Studies</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularStudies.map((study) => (
                  <StudyCard key={study.id} study={study} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

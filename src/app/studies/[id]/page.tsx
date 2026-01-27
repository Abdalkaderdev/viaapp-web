'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  Loader2,
  Play,
  CheckCircle2,
  Lock,
  Trophy,
  Share2,
  Heart,
  CirclePlay,
} from 'lucide-react';
import { clsx } from 'clsx';

// Type definitions
interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'reflection';
}

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
  authorBio?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  whatYouWillLearn?: string[];
  requirements?: string[];
  lessons: Lesson[];
}

interface EnrollmentStatus {
  isEnrolled: boolean;
  progress: number;
  currentLessonId?: string;
  completedLessons: string[];
  startedAt?: string;
}

// Mock data for demonstration
const MOCK_STUDY: Study = {
  id: '1',
  title: 'Foundations of Faith',
  description:
    'A comprehensive introduction to the core beliefs of Christianity for new believers. This study will take you through the essential doctrines of the Christian faith, helping you build a solid foundation for your spiritual journey. Whether you are brand new to Christianity or want to strengthen your understanding of the basics, this course will guide you step by step.',
  category: 'new-believer',
  difficulty: 'beginner',
  lessonCount: 12,
  estimatedMinutes: 180,
  enrolledCount: 1542,
  rating: 4.8,
  author: 'Pastor John Smith',
  authorBio: 'Senior Pastor with 20+ years of experience in teaching and discipleship.',
  isFeatured: true,
  whatYouWillLearn: [
    'Understand who God is and His character',
    'Learn about salvation and what it means to be saved',
    'Discover the importance of the Bible in daily life',
    'Build a strong foundation for your prayer life',
    'Understand the role of the Holy Spirit',
    'Learn about the church and Christian community',
  ],
  requirements: ['A Bible (any translation)', 'A journal for reflection', 'Open heart and mind'],
  lessons: [
    {
      id: 'l1',
      title: 'Introduction: Beginning Your Journey',
      description: 'An overview of what to expect and how to get the most from this study.',
      durationMinutes: 10,
      order: 1,
      isCompleted: true,
      isLocked: false,
      type: 'video',
    },
    {
      id: 'l2',
      title: 'Who is God?',
      description: 'Exploring the nature and character of God through Scripture.',
      durationMinutes: 20,
      order: 2,
      isCompleted: true,
      isLocked: false,
      type: 'reading',
    },
    {
      id: 'l3',
      title: 'Understanding the Trinity',
      description: 'The Father, Son, and Holy Spirit - one God in three persons.',
      durationMinutes: 25,
      order: 3,
      isCompleted: false,
      isLocked: false,
      type: 'video',
    },
    {
      id: 'l4',
      title: 'The Bible: God\'s Word',
      description: 'Why the Bible is trustworthy and how to read it effectively.',
      durationMinutes: 15,
      order: 4,
      isCompleted: false,
      isLocked: false,
      type: 'reading',
    },
    {
      id: 'l5',
      title: 'Quiz: Foundations Part 1',
      description: 'Test your understanding of the first four lessons.',
      durationMinutes: 10,
      order: 5,
      isCompleted: false,
      isLocked: true,
      type: 'quiz',
    },
    {
      id: 'l6',
      title: 'Sin and Salvation',
      description: 'Understanding our need for a Savior and God\'s gift of grace.',
      durationMinutes: 20,
      order: 6,
      isCompleted: false,
      isLocked: true,
      type: 'video',
    },
    {
      id: 'l7',
      title: 'The Life of Jesus',
      description: 'Who Jesus was and why His life matters for us today.',
      durationMinutes: 25,
      order: 7,
      isCompleted: false,
      isLocked: true,
      type: 'reading',
    },
    {
      id: 'l8',
      title: 'The Cross and Resurrection',
      description: 'The central events of Christianity and their meaning.',
      durationMinutes: 20,
      order: 8,
      isCompleted: false,
      isLocked: true,
      type: 'video',
    },
    {
      id: 'l9',
      title: 'Reflection: Your Faith Journey',
      description: 'Take time to reflect on what you have learned so far.',
      durationMinutes: 15,
      order: 9,
      isCompleted: false,
      isLocked: true,
      type: 'reflection',
    },
    {
      id: 'l10',
      title: 'The Holy Spirit',
      description: 'Understanding the third person of the Trinity and His work in our lives.',
      durationMinutes: 20,
      order: 10,
      isCompleted: false,
      isLocked: true,
      type: 'video',
    },
    {
      id: 'l11',
      title: 'Prayer and Relationship with God',
      description: 'Developing a meaningful prayer life.',
      durationMinutes: 15,
      order: 11,
      isCompleted: false,
      isLocked: true,
      type: 'reading',
    },
    {
      id: 'l12',
      title: 'Next Steps: Growing in Faith',
      description: 'How to continue your spiritual journey after this study.',
      durationMinutes: 10,
      order: 12,
      isCompleted: false,
      isLocked: true,
      type: 'video',
    },
  ],
};

function LessonCard({ lesson, studyId, isEnrolled }: { lesson: Lesson; studyId: string; isEnrolled: boolean }) {
  const typeIcons = {
    video: CirclePlay,
    reading: BookOpen,
    quiz: Trophy,
    reflection: Heart,
  };
  const TypeIcon = typeIcons[lesson.type];

  const isAccessible = isEnrolled && !lesson.isLocked;

  return (
    <Link
      href={isAccessible ? `/studies/${studyId}/lessons/${lesson.id}` : '#'}
      className={clsx(
        'flex items-center gap-4 p-4 rounded-xl border transition-all',
        lesson.isCompleted
          ? 'bg-green-50 border-green-200'
          : isAccessible
            ? 'bg-white border-gray-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
            : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75'
      )}
      onClick={(e) => !isAccessible && e.preventDefault()}
    >
      {/* Status/Type Icon */}
      <div
        className={clsx(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          lesson.isCompleted
            ? 'bg-green-100'
            : lesson.isLocked
              ? 'bg-gray-200'
              : 'bg-brand-100'
        )}
      >
        {lesson.isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : lesson.isLocked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : (
          <TypeIcon className="w-6 h-6 text-brand-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Lesson {lesson.order}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
            {lesson.type}
          </span>
        </div>
        <h3
          className={clsx(
            'font-semibold truncate',
            lesson.isCompleted ? 'text-green-800' : lesson.isLocked ? 'text-gray-500' : 'text-gray-900'
          )}
        >
          {lesson.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
      </div>

      {/* Duration & Arrow */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm text-gray-500">{lesson.durationMinutes} min</span>
        {isAccessible && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </Link>
  );
}

export default function StudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studyId = params.id as string;

  const [study, setStudy] = useState<Study | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus>({
    isEnrolled: true, // Mock: user is enrolled
    progress: 17, // 2/12 lessons completed
    completedLessons: ['l1', 'l2'],
    currentLessonId: 'l3',
    startedAt: '2025-01-15',
  });
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchStudy();
  }, [studyId]);

  async function fetchStudy() {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await api.studies.getById(studyId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStudy(MOCK_STUDY);
    } catch (error) {
      console.error('Failed to fetch study:', error);
    }
    setLoading(false);
  }

  async function handleEnroll() {
    setEnrolling(true);
    try {
      // TODO: Replace with actual API call
      // const result = await api.studies.enroll(studyId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEnrollment({
        isEnrolled: true,
        progress: 0,
        completedLessons: [],
        startedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
    setEnrolling(false);
  }

  function handleContinue() {
    if (enrollment.currentLessonId) {
      router.push(`/studies/${studyId}/lessons/${enrollment.currentLessonId}`);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!study) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Study not found</h2>
          <p className="text-gray-500 mb-4">This study may have been removed or doesn&apos;t exist.</p>
          <Link href="/studies" className="text-brand-600 font-medium hover:text-brand-700">
            Browse all studies
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  const completedLessons = study.lessons.filter((l) => l.isCompleted).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/studies"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Studies
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Study Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full bg-white/20')}>
                  {study.difficulty.charAt(0).toUpperCase() + study.difficulty.slice(1)}
                </span>
                <span className="text-sm opacity-80 capitalize">{study.category.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">{study.title}</h1>
              <p className="text-brand-100 mb-4 line-clamp-3">{study.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {study.lessonCount} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {study.estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {study.enrolledCount.toLocaleString()} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  {study.rating}
                </span>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-xl p-5 text-gray-900 w-full md:w-72 flex-shrink-0">
              {enrollment.isEnrolled ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Your Progress</span>
                      <span className="text-brand-600 font-semibold">{enrollment.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {completedLessons} of {study.lessonCount} lessons completed
                    </p>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Start this study to track your progress and unlock all lessons.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-70 transition-colors"
                  >
                    {enrolling ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    {enrolling ? 'Enrolling...' : 'Start Study'}
                  </button>
                </>
              )}
              <button className="w-full flex items-center justify-center gap-2 py-3 mt-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* What You'll Learn */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What You&apos;ll Learn</h2>
            <ul className="space-y-3">
              {study.whatYouWillLearn?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements & Author */}
          <div className="space-y-6">
            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {study.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-brand-500">&#8226;</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Instructor</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-brand-600">
                    {study.author?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{study.author}</p>
                  <p className="text-sm text-gray-500">{study.authorBio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
            <span className="text-sm text-gray-500">
              {completedLessons}/{study.lessonCount} lessons
            </span>
          </div>
          <div className="space-y-3">
            {study.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                studyId={study.id}
                isEnrolled={enrollment.isEnrolled}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

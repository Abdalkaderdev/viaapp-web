'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  TrendingUp,
  BookOpen,
  Clock,
  ChevronRight,
  Loader2,
  Trophy,
  ArrowLeft,
  Calendar,
  Target,
  Flame,
  Award,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

// Type definitions
interface StudyProgressStats {
  totalStudiesEnrolled: number;
  totalStudiesCompleted: number;
  totalLessonsCompleted: number;
  totalMinutesSpent: number;
  currentStreak: number;
  longestStreak: number;
  averageProgressPercent: number;
  certificatesEarned: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'study_completed' | 'study_started' | 'certificate_earned';
  title: string;
  studyTitle: string;
  timestamp: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface WeeklyProgress {
  day: string;
  lessonsCompleted: number;
  minutesSpent: number;
}

// Mock data
const MOCK_STATS: StudyProgressStats = {
  totalStudiesEnrolled: 4,
  totalStudiesCompleted: 2,
  totalLessonsCompleted: 32,
  totalMinutesSpent: 480,
  currentStreak: 7,
  longestStreak: 14,
  averageProgressPercent: 58,
  certificatesEarned: 2,
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: 'a1',
    type: 'lesson_completed',
    title: 'Sin and Salvation',
    studyTitle: 'Foundations of Faith',
    timestamp: '2025-01-25T14:30:00Z',
  },
  {
    id: 'a2',
    type: 'lesson_completed',
    title: 'The Discipline of Silence',
    studyTitle: 'Walking with God',
    timestamp: '2025-01-24T10:15:00Z',
  },
  {
    id: 'a3',
    type: 'study_completed',
    title: 'Prayer Essentials',
    studyTitle: 'Prayer Essentials',
    timestamp: '2025-01-20T16:45:00Z',
  },
  {
    id: 'a4',
    type: 'certificate_earned',
    title: 'Prayer Essentials Certificate',
    studyTitle: 'Prayer Essentials',
    timestamp: '2025-01-20T16:45:00Z',
  },
  {
    id: 'a5',
    type: 'study_started',
    title: 'Walking with God',
    studyTitle: 'Walking with God',
    timestamp: '2025-01-18T09:00:00Z',
  },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'star',
    isUnlocked: true,
    unlockedAt: '2025-01-10',
  },
  {
    id: 'ach2',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: 'book',
    isUnlocked: true,
    unlockedAt: '2025-01-15',
  },
  {
    id: 'ach3',
    title: 'Scholar',
    description: 'Complete 50 lessons',
    icon: 'graduation',
    isUnlocked: false,
    progress: 32,
    target: 50,
  },
  {
    id: 'ach4',
    title: 'First Certificate',
    description: 'Earn your first certificate',
    icon: 'award',
    isUnlocked: true,
    unlockedAt: '2025-01-20',
  },
  {
    id: 'ach5',
    title: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: 'flame',
    isUnlocked: true,
    unlockedAt: '2025-01-25',
  },
  {
    id: 'ach6',
    title: 'Month Master',
    description: 'Study for 30 days in a row',
    icon: 'trophy',
    isUnlocked: false,
    progress: 7,
    target: 30,
  },
];

const MOCK_WEEKLY_PROGRESS: WeeklyProgress[] = [
  { day: 'Mon', lessonsCompleted: 2, minutesSpent: 30 },
  { day: 'Tue', lessonsCompleted: 1, minutesSpent: 15 },
  { day: 'Wed', lessonsCompleted: 3, minutesSpent: 45 },
  { day: 'Thu', lessonsCompleted: 0, minutesSpent: 0 },
  { day: 'Fri', lessonsCompleted: 2, minutesSpent: 25 },
  { day: 'Sat', lessonsCompleted: 4, minutesSpent: 60 },
  { day: 'Sun', lessonsCompleted: 1, minutesSpent: 20 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const icons = {
    lesson_completed: CheckCircle2,
    study_completed: Trophy,
    study_started: BookOpen,
    certificate_earned: Award,
  };
  const colors = {
    lesson_completed: 'bg-green-100 text-green-600',
    study_completed: 'bg-amber-100 text-amber-600',
    study_started: 'bg-blue-100 text-blue-600',
    certificate_earned: 'bg-purple-100 text-purple-600',
  };

  const Icon = icons[activity.type];
  const colorClass = colors[activity.type];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getLabel = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return 'Completed lesson';
      case 'study_completed':
        return 'Completed study';
      case 'study_started':
        return 'Started study';
      case 'certificate_earned':
        return 'Earned certificate';
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{activity.title}</p>
        <p className="text-sm text-gray-500 truncate">
          {getLabel(activity.type)} - {activity.studyTitle}
        </p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(activity.timestamp)}</span>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const iconMap: Record<string, React.ElementType> = {
    star: Star,
    book: BookOpen,
    graduation: Trophy,
    award: Award,
    flame: Flame,
    trophy: Trophy,
  };

  const Icon = iconMap[achievement.icon] || Star;

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border p-4 transition-all',
        achievement.isUnlocked
          ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
          : 'border-gray-200 opacity-75'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            achievement.isUnlocked
              ? 'bg-gradient-to-br from-amber-400 to-amber-500'
              : 'bg-gray-200'
          )}
        >
          <Icon className={clsx('w-6 h-6', achievement.isUnlocked ? 'text-white' : 'text-gray-400')} />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={clsx(
              'font-semibold truncate',
              achievement.isUnlocked ? 'text-amber-900' : 'text-gray-700'
            )}
          >
            {achievement.title}
          </h4>
          <p className="text-sm text-gray-500 truncate">{achievement.description}</p>

          {!achievement.isUnlocked && achievement.progress !== undefined && achievement.target && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-600 font-medium">
                  {achievement.progress}/{achievement.target}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
              </div>
            </div>
          )}

          {achievement.isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-amber-600 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function WeeklyChart({ data }: { data: WeeklyProgress[] }) {
  const maxLessons = Math.max(...data.map((d) => d.lessonsCompleted), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-brand-500" />
        This Week
      </h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={clsx(
                'w-full rounded-t-lg transition-all',
                day.lessonsCompleted > 0 ? 'bg-brand-500' : 'bg-gray-200'
              )}
              style={{ height: `${(day.lessonsCompleted / maxLessons) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500 mt-2">{day.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
        <div>
          <span className="text-gray-500">Lessons this week:</span>
          <span className="font-semibold text-gray-900 ml-2">
            {data.reduce((sum, d) => sum + d.lessonsCompleted, 0)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Time spent:</span>
          <span className="font-semibold text-gray-900 ml-2">
            {Math.round(data.reduce((sum, d) => sum + d.minutesSpent, 0) / 60)}h{' '}
            {data.reduce((sum, d) => sum + d.minutesSpent, 0) % 60}m
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyProgressPage() {
  const [stats, setStats] = useState<StudyProgressStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStats(MOCK_STATS);
      setRecentActivity(MOCK_RECENT_ACTIVITY);
      setAchievements(MOCK_ACHIEVEMENTS);
      setWeeklyProgress(MOCK_WEEKLY_PROGRESS);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
    setLoading(false);
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
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
              <TrendingUp className="w-8 h-8 text-brand-500" />
              My Progress
            </h1>
            <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
          </div>
          <Link
            href="/studies/enrolled"
            className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-100 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            My Studies
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookOpen}
            label="Studies Completed"
            value={`${stats?.totalStudiesCompleted}/${stats?.totalStudiesEnrolled}`}
            color="bg-brand-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Lessons Completed"
            value={stats?.totalLessonsCompleted || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={Clock}
            label="Hours Learned"
            value={Math.round((stats?.totalMinutesSpent || 0) / 60)}
            sublabel={`${(stats?.totalMinutesSpent || 0) % 60}min total`}
            color="bg-blue-500"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats?.currentStreak} days`}
            sublabel={`Best: ${stats?.longestStreak} days`}
            color="bg-amber-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Weekly Chart & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress */}
            <WeeklyChart data={weeklyProgress} />

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-500" />
                Recent Activity
              </h3>
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-brand-100 text-sm">Overall Progress</p>
                  <p className="text-3xl font-bold">{stats?.averageProgressPercent}%</p>
                </div>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${stats?.averageProgressPercent}%` }}
                />
              </div>
              <p className="text-brand-100 text-sm mt-2">
                {stats?.certificatesEarned} certificates earned
              </p>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Achievements
                </h3>
                <span className="text-sm text-gray-500">
                  {achievements.filter((a) => a.isUnlocked).length}/{achievements.length}
                </span>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

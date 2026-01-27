'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  MessageSquare,
  Search,
  Plus,
  ArrowLeft,
  Loader2,
  Filter,
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  CheckCircle,
  ChevronRight,
  Users,
  Flame,
  BookOpen,
} from 'lucide-react';

// Types
interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: 'general' | 'bible-study' | 'theology' | 'prayer' | 'testimony' | 'questions' | 'resources';
  tags: string[];
  views: number;
  likes: number;
  replies: number;
  isPinned: boolean;
  isResolved: boolean;
  lastReplyAt?: string;
  createdAt: string;
}

// Mock data
const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    title: 'How do you stay consistent with daily Bible reading?',
    content: 'I have been struggling to maintain a consistent Bible reading habit. What strategies have worked for you?',
    authorId: 'u1',
    authorName: 'Sarah Johnson',
    category: 'general',
    tags: ['habits', 'bible-reading', 'discipline'],
    views: 234,
    likes: 45,
    replies: 28,
    isPinned: true,
    isResolved: false,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Understanding Romans 9: Predestination and Free Will',
    content: 'Can someone help me understand the balance between God\'s sovereignty and human free will in Romans 9?',
    authorId: 'u2',
    authorName: 'Michael Chen',
    category: 'theology',
    tags: ['romans', 'predestination', 'theology'],
    views: 567,
    likes: 89,
    replies: 67,
    isPinned: false,
    isResolved: false,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'Best devotional books for new believers?',
    content: 'I recently came to faith and looking for good devotional book recommendations for someone new to Christianity.',
    authorId: 'u3',
    authorName: 'Emily Davis',
    category: 'resources',
    tags: ['books', 'devotional', 'new-believer'],
    views: 189,
    likes: 34,
    replies: 21,
    isPinned: false,
    isResolved: true,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: '4',
    title: 'Prayer Request Thread: January 2026',
    content: 'Share your prayer requests for this month. Let us lift each other up in prayer.',
    authorId: 'u4',
    authorName: 'David Park',
    category: 'prayer',
    tags: ['prayer', 'community', 'monthly'],
    views: 456,
    likes: 78,
    replies: 89,
    isPinned: true,
    isResolved: false,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: '5',
    title: 'My testimony: How God changed my life',
    content: 'I want to share my testimony of how God saved me from addiction and gave me a new life.',
    authorId: 'u5',
    authorName: 'James Wilson',
    category: 'testimony',
    tags: ['testimony', 'transformation', 'grace'],
    views: 345,
    likes: 112,
    replies: 34,
    isPinned: false,
    isResolved: false,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: '6',
    title: 'Study Guide: Book of James - Week 1',
    content: 'Let us study the book of James together. This week we will cover James 1:1-18.',
    authorId: 'u6',
    authorName: 'Pastor Thompson',
    category: 'bible-study',
    tags: ['james', 'study-guide', 'weekly'],
    views: 278,
    likes: 56,
    replies: 42,
    isPinned: false,
    isResolved: false,
    lastReplyAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Discussions', icon: MessageSquare },
  { value: 'general', label: 'General', icon: MessageSquare },
  { value: 'bible-study', label: 'Bible Study', icon: BookOpen },
  { value: 'theology', label: 'Theology', icon: BookOpen },
  { value: 'prayer', label: 'Prayer', icon: MessageSquare },
  { value: 'testimony', label: 'Testimonies', icon: Users },
  { value: 'questions', label: 'Questions', icon: MessageSquare },
  { value: 'resources', label: 'Resources', icon: BookOpen },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent', icon: Clock },
  { value: 'popular', label: 'Most Popular', icon: Flame },
  { value: 'active', label: 'Most Active', icon: TrendingUp },
];

function CategoryBadge({ category }: { category: Discussion['category'] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    general: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'General' },
    'bible-study': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bible Study' },
    theology: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Theology' },
    prayer: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Prayer' },
    testimony: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Testimony' },
    questions: { bg: 'bg-green-100', text: 'text-green-700', label: 'Questions' },
    resources: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Resources' },
  };

  const { bg, text, label } = config[category];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 2880) return 'Yesterday';
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
  return date.toLocaleDateString();
}

function DiscussionCard({ discussion }: { discussion: Discussion }) {
  return (
    <div className={`bg-white rounded-2xl border ${discussion.isPinned ? 'border-brand-200 bg-brand-50/30' : 'border-gray-200'} p-6 hover:border-brand-300 hover:shadow-lg transition-all`}>
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {discussion.authorName.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-brand-500" />
                )}
                {discussion.isResolved && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <Link
                  href={`/community/discussions/${discussion.id}`}
                  className="font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {discussion.title}
                </Link>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={discussion.category} />
                <span className="text-sm text-gray-500">
                  by {discussion.authorName}
                </span>
                <span className="text-sm text-gray-400">
                  {formatTimeAgo(discussion.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{discussion.content}</p>

          {/* Tags */}
          {discussion.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {discussion.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {discussion.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{discussion.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{discussion.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{discussion.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{discussion.replies}</span>
            </div>
            {discussion.lastReplyAt && (
              <div className="ml-auto text-gray-400">
                Last reply {formatTimeAgo(discussion.lastReplyAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiscussions(MOCK_DISCUSSIONS);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredDiscussions = discussions
    .filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Pinned items always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'active':
          return b.replies - a.replies;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const totalViews = discussions.reduce((sum, d) => sum + d.views, 0);
  const totalReplies = discussions.reduce((sum, d) => sum + d.replies, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-brand-500" />
                Discussions
              </h1>
              <p className="text-gray-600 mt-1">Join the conversation and share your thoughts</p>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
              <Plus className="w-5 h-5" />
              Start Discussion
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={MessageSquare}
            label="Total Discussions"
            value={discussions.length}
            color="bg-gradient-to-br from-brand-500 to-brand-600"
          />
          <StatCard
            icon={MessageCircle}
            label="Total Replies"
            value={totalReplies}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={totalViews.toLocaleString()}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Users}
            label="Active Contributors"
            value={156}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Discussions List */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion!'}
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Start Discussion
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDiscussions.map(discussion => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredDiscussions.length > 0 && (
              <div className="text-center">
                <button className="inline-flex items-center gap-2 px-6 py-3 text-brand-600 font-medium hover:bg-brand-50 rounded-xl transition-colors">
                  Load More Discussions
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Start Discussion CTA */}
        <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Have a Question?</h3>
              <p className="text-brand-100">
                Start a new discussion and get insights from the community.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
              <Plus className="w-5 h-5" />
              Start Discussion
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import {
  Users,
  MessageSquare,
  Calendar,
  Heart,
  ChevronRight,
  TrendingUp,
  Loader2,
  Plus,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  UserPlus,
} from 'lucide-react';

// Types for community features
interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: 'testimony' | 'prayer' | 'discussion' | 'encouragement';
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  groupName?: string;
}

interface CommunityStats {
  totalMembers: number;
  activeGroups: number;
  weeklyDiscussions: number;
  upcomingEvents: number;
}

// Mock data for demonstration
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    content: 'God has been so faithful! After months of praying for a new job, I finally received an offer today. Never give up on prayer!',
    type: 'testimony',
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Michael Chen',
    content: 'Please pray for my grandmother. She is going through a difficult health situation. Thank you for your support and prayers.',
    type: 'prayer',
    likes: 45,
    comments: 12,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    groupName: 'Prayer Warriors',
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Emily Davis',
    content: 'What are your favorite verses for dealing with anxiety? I have been meditating on Philippians 4:6-7 lately.',
    type: 'discussion',
    likes: 18,
    comments: 23,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    groupName: 'Bible Study Group',
  },
  {
    id: '4',
    authorId: 'user4',
    authorName: 'David Park',
    content: 'To anyone struggling today: Remember that God is with you. His grace is sufficient for you, and His power is made perfect in weakness. (2 Corinthians 12:9)',
    type: 'encouragement',
    likes: 67,
    comments: 5,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

const MOCK_STATS: CommunityStats = {
  totalMembers: 1247,
  activeGroups: 32,
  weeklyDiscussions: 156,
  upcomingEvents: 8,
};

function PostTypeIcon({ type }: { type: CommunityPost['type'] }) {
  switch (type) {
    case 'testimony':
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    case 'prayer':
      return <Heart className="w-4 h-4 text-rose-500" />;
    case 'discussion':
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case 'encouragement':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    default:
      return null;
  }
}

function PostTypeBadge({ type }: { type: CommunityPost['type'] }) {
  const config = {
    testimony: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Testimony' },
    prayer: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Prayer Request' },
    discussion: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Discussion' },
    encouragement: { bg: 'bg-green-100', text: 'text-green-700', label: 'Encouragement' },
  };

  const { bg, text, label } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <PostTypeIcon type={type} />
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
  return date.toLocaleDateString();
}

function PostCard({ post, onLike, onBookmark }: {
  post: CommunityPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      {/* Author Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{post.authorName}</p>
              <PostTypeBadge type={post.type} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.groupName && (
                <>
                  <span>in</span>
                  <Link href="/community/groups" className="text-brand-600 hover:underline">
                    {post.groupName}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              post.isLiked
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => onBookmark(post.id)}
          className={`p-2 rounded-lg transition-colors ${
            post.isBookmarked
              ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
              : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}

function QuickNavCard({
  href,
  icon: Icon,
  label,
  description,
  color,
  count,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {count !== undefined && (
          <span className="text-sm font-semibold text-gray-900">{count}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <div className="flex items-center gap-1 mt-3 text-brand-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
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

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'testimony' | 'prayer' | 'discussion' | 'encouragement'>('all');

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(MOCK_POSTS);
      setStats(MOCK_STATS);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(post => post.type === filter);

  const firstName = user?.fullName?.split(' ')[0] || 'Friend';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-500" />
              Community
            </h1>
            <p className="text-gray-600 mt-1">Connect, share, and grow together in faith</p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
            <Plus className="w-5 h-5" />
            Share Something
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Community Members"
              value={stats.totalMembers.toLocaleString()}
              color="bg-gradient-to-br from-brand-500 to-brand-600"
            />
            <StatCard
              icon={UserPlus}
              label="Active Groups"
              value={stats.activeGroups}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={MessageSquare}
              label="Weekly Discussions"
              value={stats.weeklyDiscussions}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Calendar}
              label="Upcoming Events"
              value={stats.upcomingEvents}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { value: 'all', label: 'All Posts' },
                { value: 'testimony', label: 'Testimonies' },
                { value: 'prayer', label: 'Prayer Requests' },
                { value: 'discussion', label: 'Discussions' },
                { value: 'encouragement', label: 'Encouragement' },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value as typeof filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === tab.value
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore</h2>
              <div className="space-y-3">
                <QuickNavCard
                  href="/community/groups"
                  icon={Users}
                  label="Groups"
                  description="Join groups and connect with others"
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                  count={stats?.activeGroups}
                />
                <QuickNavCard
                  href="/community/discussions"
                  icon={MessageSquare}
                  label="Discussions"
                  description="Browse discussion threads"
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                  count={stats?.weeklyDiscussions}
                />
                <QuickNavCard
                  href="/community/events"
                  icon={Calendar}
                  label="Events"
                  description="Discover upcoming community events"
                  color="bg-gradient-to-br from-amber-500 to-orange-500"
                  count={stats?.upcomingEvents}
                />
              </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6 border border-brand-100">
              <h3 className="font-semibold text-gray-900 mb-2">Welcome, {firstName}!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share your testimonies, prayer requests, and encouragements with the community.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Share your testimony
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Request prayer support
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  Start a discussion
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Encourage others
                </li>
              </ul>
            </div>

            {/* Suggested Groups */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Suggested Groups</h3>
                <Link href="/community/groups" className="text-sm text-brand-600 hover:text-brand-700">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Prayer Warriors', members: 156 },
                  { name: 'Bible Study Group', members: 89 },
                  { name: 'New Believers', members: 234 },
                ].map(group => (
                  <div key={group.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-sm text-gray-500">{group.members} members</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

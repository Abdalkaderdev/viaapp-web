'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import {
  Users,
  ArrowLeft,
  Lock,
  Globe,
  Settings,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Plus,
  Send,
  Loader2,
  Image as ImageIcon,
  ChevronRight,
  Bell,
  BellOff,
  LogOut,
  Heart,
  Sparkles,
} from 'lucide-react';

// Types
interface GroupMember {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'admin' | 'moderator' | 'member';
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isMuted: boolean;
  rules?: string[];
  createdAt: string;
}

// Mock data
const MOCK_GROUP: GroupDetail = {
  id: '1',
  name: 'Prayer Warriors',
  description: 'A dedicated group for intercessory prayer. We pray together for our community, families, and the world. Join us in lifting up prayer requests and supporting one another through faith.',
  category: 'prayer',
  memberCount: 156,
  isPrivate: false,
  isMember: true,
  isAdmin: false,
  isMuted: false,
  rules: [
    'Be respectful and supportive of all members',
    'Keep all prayer requests confidential',
    'No spam or self-promotion',
    'Stay on topic - this is a prayer-focused group',
  ],
  createdAt: '2024-01-15',
};

const MOCK_MEMBERS: GroupMember[] = [
  { id: '1', userId: 'u1', name: 'Sarah Johnson', role: 'admin', joinedAt: '2024-01-15' },
  { id: '2', userId: 'u2', name: 'Michael Chen', role: 'moderator', joinedAt: '2024-01-20' },
  { id: '3', userId: 'u3', name: 'Emily Davis', role: 'member', joinedAt: '2024-02-01' },
  { id: '4', userId: 'u4', name: 'David Park', role: 'member', joinedAt: '2024-02-15' },
  { id: '5', userId: 'u5', name: 'Lisa Thompson', role: 'member', joinedAt: '2024-03-01' },
];

const MOCK_POSTS: GroupPost[] = [
  {
    id: '1',
    authorId: 'u1',
    authorName: 'Sarah Johnson',
    authorRole: 'admin',
    content: 'Please keep my family in your prayers this week. We are going through a challenging time with my mother\'s health.',
    likes: 24,
    comments: 12,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    authorId: 'u2',
    authorName: 'Michael Chen',
    authorRole: 'moderator',
    content: 'Praise report! The prayer request I shared last month about my job situation has been answered. Thank you all for praying with me!',
    likes: 45,
    comments: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: '3',
    authorId: 'u3',
    authorName: 'Emily Davis',
    authorRole: 'member',
    content: 'I have been feeling spiritually dry lately. Would appreciate prayers for renewed passion and connection with God.',
    likes: 18,
    comments: 15,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

const MOCK_EVENTS: GroupEvent[] = [
  { id: '1', title: 'Weekly Prayer Meeting', date: '2026-01-28', time: '7:00 PM', attendees: 23 },
  { id: '2', title: 'Prayer & Fasting Day', date: '2026-02-01', time: 'All Day', attendees: 45 },
];

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

function RoleBadge({ role }: { role: GroupMember['role'] }) {
  if (role === 'member') return null;

  const config = {
    admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' },
    moderator: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Mod' },
  };

  const { bg, text, label } = config[role];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function PostCard({ post, onLike }: { post: GroupPost; onLike: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Author Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{post.authorName}</p>
              <RoleBadge role={post.authorRole} />
            </div>
            <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
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
    </div>
  );
}

function MemberItem({ member }: { member: GroupMember }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {member.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{member.name}</p>
            <RoleBadge role={member.role} />
          </div>
          <p className="text-xs text-gray-500">
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'events' | 'about'>('posts');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroup(MOCK_GROUP);
      setPosts(MOCK_POSTS);
      setMembers(MOCK_MEMBERS);
      setEvents(MOCK_EVENTS);
      setLoading(false);
    };
    fetchData();
  }, [groupId]);

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

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPostObj: GroupPost = {
      id: Date.now().toString(),
      authorId: user?.id || '',
      authorName: user?.fullName || 'You',
      authorRole: 'member',
      content: newPost,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setPosting(false);
  };

  const handleToggleMute = () => {
    if (group) {
      setGroup({ ...group, isMuted: !group.isMuted });
    }
  };

  const handleLeaveGroup = () => {
    // In production, this would call an API
    alert('Leave group functionality would be implemented here');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!group) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Group not found</h2>
          <p className="text-gray-500 mb-4">The group you are looking for does not exist or has been removed.</p>
          <Link
            href="/community/groups"
            className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Groups
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          href="/community/groups"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Groups
        </Link>

        {/* Group Header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{group.name}</h1>
                    {group.isPrivate ? (
                      <Lock className="w-5 h-5 text-white/80" />
                    ) : (
                      <Globe className="w-5 h-5 text-white/80" />
                    )}
                  </div>
                  <p className="text-brand-100">
                    {group.memberCount} members  {group.isPrivate ? 'Private' : 'Public'} Group
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {group.isMember && (
                  <>
                    <button
                      onClick={handleToggleMute}
                      className={`p-2.5 rounded-xl transition-colors ${
                        group.isMuted
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                      title={group.isMuted ? 'Unmute notifications' : 'Mute notifications'}
                    >
                      {group.isMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </button>
                    {group.isAdmin && (
                      <button className="p-2.5 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { value: 'posts', label: 'Posts', icon: MessageSquare },
                { value: 'members', label: `Members (${group.memberCount})`, icon: Users },
                { value: 'events', label: 'Events', icon: Calendar },
                { value: 'about', label: 'About', icon: Sparkles },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'posts' && (
              <>
                {/* Create Post */}
                {group.isMember && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          placeholder="Share with the group..."
                          rows={3}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                        />
                        <div className="flex items-center justify-between mt-3">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <ImageIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCreatePost}
                            disabled={!newPost.trim() || posting}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {posting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts List */}
                {posts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">Be the first to share something with this group!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <PostCard key={post.id} post={post} onLike={handleLike} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'members' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="divide-y divide-gray-100">
                  {members.map(member => (
                    <MemberItem key={member.id} member={member} />
                  ))}
                </div>
                <button className="w-full mt-4 py-3 text-brand-600 font-medium hover:bg-brand-50 rounded-xl transition-colors">
                  View All Members
                </button>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-500">Check back later for new events.</p>
                  </div>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-brand-100 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-xs text-brand-600 font-medium">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-lg font-bold text-brand-700">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.time}</p>
                            <p className="text-sm text-gray-500">{event.attendees} attending</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
                          RSVP
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About this group</h3>
                <p className="text-gray-600 mb-6">{group.description}</p>

                {group.rules && group.rules.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mb-3">Group Rules</h4>
                    <ul className="space-y-2">
                      {group.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Created on {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Group Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="font-semibold text-gray-900">{group.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Posts this week</span>
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Upcoming events</span>
                  <span className="font-semibold text-gray-900">{events.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Members */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Members</h3>
                <button
                  onClick={() => setActiveTab('members')}
                  className="text-sm text-brand-600 hover:text-brand-700"
                >
                  View all
                </button>
              </div>
              <div className="flex -space-x-2">
                {members.slice(0, 5).map(member => (
                  <div
                    key={member.id}
                    className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-white"
                    title={member.name}
                  >
                    {member.name.charAt(0)}
                  </div>
                ))}
                {group.memberCount > 5 && (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm border-2 border-white">
                    +{group.memberCount - 5}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {group.isMember && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-gray-400" />
                    Invite Members
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {group.isMuted ? (
                      <Bell className="w-5 h-5 text-gray-400" />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                    {group.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Leave Group
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

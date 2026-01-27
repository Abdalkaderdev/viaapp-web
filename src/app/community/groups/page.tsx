'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Users,
  Search,
  Plus,
  ChevronRight,
  Loader2,
  Lock,
  Globe,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Filter,
} from 'lucide-react';

// Types for groups
interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: 'prayer' | 'study' | 'fellowship' | 'outreach' | 'youth' | 'other';
  memberCount: number;
  isPrivate: boolean;
  isMember: boolean;
  isPending: boolean;
  imageUrl?: string;
  recentActivity?: string;
  createdAt: string;
}

// Mock data for demonstration
const MOCK_GROUPS: CommunityGroup[] = [
  {
    id: '1',
    name: 'Prayer Warriors',
    description: 'A dedicated group for intercessory prayer. We pray together for our community, families, and the world.',
    category: 'prayer',
    memberCount: 156,
    isPrivate: false,
    isMember: true,
    isPending: false,
    recentActivity: '5 minutes ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Bible Study Group',
    description: 'Weekly Bible studies exploring God\'s Word together. Currently studying the book of Romans.',
    category: 'study',
    memberCount: 89,
    isPrivate: false,
    isMember: false,
    isPending: false,
    recentActivity: '1 hour ago',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'New Believers',
    description: 'A supportive community for those new to faith. Learn the basics and grow together.',
    category: 'fellowship',
    memberCount: 234,
    isPrivate: false,
    isMember: false,
    isPending: false,
    recentActivity: '30 minutes ago',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Young Adults Fellowship',
    description: 'Fellowship group for young adults ages 18-30. Building community and growing in faith together.',
    category: 'youth',
    memberCount: 127,
    isPrivate: false,
    isMember: true,
    isPending: false,
    recentActivity: '2 hours ago',
    createdAt: '2024-03-01',
  },
  {
    id: '5',
    name: 'Marriage & Family',
    description: 'Support and encouragement for married couples and families. Private discussions and prayer.',
    category: 'fellowship',
    memberCount: 78,
    isPrivate: true,
    isMember: false,
    isPending: true,
    recentActivity: '1 day ago',
    createdAt: '2024-02-01',
  },
  {
    id: '6',
    name: 'Community Outreach',
    description: 'Serving our local community through various outreach programs and volunteer opportunities.',
    category: 'outreach',
    memberCount: 95,
    isPrivate: false,
    isMember: false,
    isPending: false,
    recentActivity: '3 hours ago',
    createdAt: '2024-01-10',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Groups' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'study', label: 'Bible Study' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'youth', label: 'Youth' },
  { value: 'other', label: 'Other' },
];

function CategoryBadge({ category }: { category: CommunityGroup['category'] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    prayer: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Prayer' },
    study: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bible Study' },
    fellowship: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Fellowship' },
    outreach: { bg: 'bg-green-100', text: 'text-green-700', label: 'Outreach' },
    youth: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Youth' },
    other: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' },
  };

  const { bg, text, label } = config[category];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function GroupCard({
  group,
  onJoin,
  onLeave,
}: {
  group: CommunityGroup;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/community/groups/${group.id}`}
                className="font-semibold text-gray-900 hover:text-brand-600 transition-colors"
              >
                {group.name}
              </Link>
              {group.isPrivate && (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <CategoryBadge category={group.category} />
              <span className="text-sm text-gray-500">
                {group.memberCount} members
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {group.recentActivity && (
            <span>Active {group.recentActivity}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {group.isMember ? (
            <>
              <Link
                href={`/community/groups/${group.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
              >
                View
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onLeave(group.id)}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Leave
              </button>
            </>
          ) : group.isPending ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              Pending
            </span>
          ) : (
            <button
              onClick={() => onJoin(group.id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {group.isPrivate ? 'Request to Join' : 'Join Group'}
            </button>
          )}
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

export default function GroupsPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMyGroups, setShowMyGroups] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroups(MOCK_GROUPS);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleJoin = (groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          isMember: !group.isPrivate,
          isPending: group.isPrivate,
          memberCount: group.isPrivate ? group.memberCount : group.memberCount + 1,
        };
      }
      return group;
    }));
  };

  const handleLeave = (groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          isMember: false,
          memberCount: group.memberCount - 1,
        };
      }
      return group;
    }));
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesMyGroups = !showMyGroups || group.isMember;
    return matchesSearch && matchesCategory && matchesMyGroups;
  });

  const myGroupsCount = groups.filter(g => g.isMember).length;
  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);

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
                <Users className="w-8 h-8 text-brand-500" />
                Community Groups
              </h1>
              <p className="text-gray-600 mt-1">Find and join groups that match your interests</p>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Groups"
            value={groups.length}
            color="bg-gradient-to-br from-brand-500 to-brand-600"
          />
          <StatCard
            icon={CheckCircle}
            label="My Groups"
            value={myGroupsCount}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Members"
            value={totalMembers.toLocaleString()}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={MessageSquare}
            label="Active Discussions"
            value={47}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* My Groups Toggle */}
            <button
              onClick={() => setShowMyGroups(!showMyGroups)}
              className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                showMyGroups
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Groups ({myGroupsCount})
            </button>
          </div>
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Be the first to create a group!'}
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
              <Plus className="w-4 h-4" />
              Create Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoin}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}

        {/* Create Group CTA */}
        <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Start Your Own Group</h3>
              <p className="text-brand-100">
                Create a community around shared interests, prayer needs, or Bible study topics.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

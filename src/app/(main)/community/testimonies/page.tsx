'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Filter,
  ChevronDown,
  Search,
  Trophy,
  Star,
} from 'lucide-react';
import { clsx } from 'clsx';

// Types for testimonies
interface Testimony {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: TestimonyCategory;
  encouragements: number;
  hasEncouraged: boolean;
  commentCount: number;
  createdAt: string;
  isVerified: boolean;
}

type TestimonyCategory = 'healing' | 'provision' | 'salvation' | 'restoration' | 'guidance' | 'breakthrough' | 'other';

const TESTIMONY_CATEGORIES = [
  { value: 'healing', label: 'Healing', icon: Heart },
  { value: 'provision', label: 'Provision', icon: Star },
  { value: 'salvation', label: 'Salvation', icon: Sparkles },
  { value: 'restoration', label: 'Restoration', icon: Heart },
  { value: 'guidance', label: 'Guidance', icon: Star },
  { value: 'breakthrough', label: 'Breakthrough', icon: Trophy },
  { value: 'other', label: 'Other', icon: Sparkles },
] as const;

// Mock data for demonstration
const MOCK_TESTIMONIES: Testimony[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Rachel K.',
    title: 'God Healed My Marriage',
    content: 'After 5 years of struggling in our marriage, my husband and I were on the verge of divorce. Through prayer and counseling, God completely transformed our relationship. Today, we are stronger than ever and helping other couples. God is faithful!',
    category: 'restoration',
    encouragements: 156,
    hasEncouraged: false,
    commentCount: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isVerified: true,
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'David L.',
    title: 'Miraculous Healing From Cancer',
    content: 'I was diagnosed with stage 3 cancer last year. The doctors gave me little hope. But our church prayed, my family prayed, and I never stopped believing. After months of treatment and prayer, I am now cancer-free! To God be the glory!',
    category: 'healing',
    encouragements: 234,
    hasEncouraged: true,
    commentCount: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isVerified: true,
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Maria S.',
    title: 'Found Job After 8 Months',
    content: 'I was unemployed for 8 months and was running out of savings. I kept praying and trusting God. Last week, I received not one but TWO job offers! God provided beyond what I could imagine. He is always on time.',
    category: 'provision',
    encouragements: 89,
    hasEncouraged: false,
    commentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isVerified: false,
  },
  {
    id: '4',
    authorId: 'user4',
    authorName: 'James W.',
    title: 'My Son Came to Christ',
    content: 'For 15 years, I prayed for my prodigal son. He was involved in drugs and had completely walked away from faith. Last month, he called me crying and said he wanted to come home. He gave his life to Jesus that same day. Never stop praying for your loved ones!',
    category: 'salvation',
    encouragements: 312,
    hasEncouraged: true,
    commentCount: 67,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isVerified: true,
  },
  {
    id: '5',
    authorId: 'user5',
    authorName: 'Anna T.',
    title: 'Debt-Free After 10 Years',
    content: 'We were drowning in $80,000 of debt. It seemed impossible to ever get out. Through discipline, tithing faithfully, and trusting God, we made our final payment last week. God taught us so much through this journey. He is faithful to those who honor Him!',
    category: 'breakthrough',
    encouragements: 178,
    hasEncouraged: false,
    commentCount: 34,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    isVerified: false,
  },
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

function getCategoryLabel(value: string): string {
  const category = TESTIMONY_CATEGORIES.find(c => c.value === value);
  return category?.label || value;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    healing: 'bg-red-100 text-red-700',
    provision: 'bg-amber-100 text-amber-700',
    salvation: 'bg-purple-100 text-purple-700',
    restoration: 'bg-pink-100 text-pink-700',
    guidance: 'bg-blue-100 text-blue-700',
    breakthrough: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.other;
}

function TestimonyCard({
  testimony,
  onEncourage,
}: {
  testimony: Testimony;
  onEncourage: (id: string) => void;
}) {
  const [encouraging, setEncouraging] = useState(false);

  const handleEncourage = async () => {
    setEncouraging(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onEncourage(testimony.id);
    setEncouraging(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {testimony.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{testimony.authorName}</p>
              {testimony.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeAgo(testimony.createdAt)}</span>
            </div>
          </div>
        </div>
        <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full', getCategoryColor(testimony.category))}>
          {getCategoryLabel(testimony.category)}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-3">{testimony.title}</h3>
      <p className="text-gray-600 leading-relaxed mb-4">{testimony.content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleEncourage}
            disabled={encouraging}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
              testimony.hasEncouraged
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {encouraging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={clsx('w-4 h-4', testimony.hasEncouraged && 'fill-current')} />
            )}
            <span>{testimony.encouragements}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{testimony.commentCount}</span>
          </button>
        </div>
        <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function TestimoniesPage() {
  const { user } = useAuth();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // New testimony form state
  const [newTestimony, setNewTestimony] = useState({
    title: '',
    content: '',
    category: 'other' as TestimonyCategory,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonies();
  }, []);

  async function fetchTestimonies() {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestimonies(MOCK_TESTIMONIES);
    setLoading(false);
  }

  const handleEncourage = (testimonyId: string) => {
    setTestimonies(testimonies.map(t => {
      if (t.id === testimonyId) {
        return {
          ...t,
          hasEncouraged: !t.hasEncouraged,
          encouragements: t.hasEncouraged ? t.encouragements - 1 : t.encouragements + 1,
        };
      }
      return t;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTestimonyItem: Testimony = {
      id: Date.now().toString(),
      authorId: user?.id || 'unknown',
      authorName: user?.fullName || 'You',
      title: newTestimony.title,
      content: newTestimony.content,
      category: newTestimony.category,
      encouragements: 0,
      hasEncouraged: false,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };

    setTestimonies([newTestimonyItem, ...testimonies]);
    setNewTestimony({ title: '', content: '', category: 'other' });
    setShowNewForm(false);
    setSubmitting(false);
  };

  // Filter testimonies
  const filteredTestimonies = testimonies.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-500" />
              Testimonies
            </h1>
            <p className="text-gray-600 mt-1">Share your praise reports and encourage others</p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Share Testimony
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{testimonies.length}</p>
            <p className="text-sm text-amber-600">Total Testimonies</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
            <p className="text-2xl font-bold text-rose-700">
              {testimonies.reduce((sum, t) => sum + t.encouragements, 0)}
            </p>
            <p className="text-sm text-rose-600">Encouragements</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
            <p className="text-2xl font-bold text-purple-700">
              {testimonies.filter(t => t.category === 'salvation').length}
            </p>
            <p className="text-sm text-purple-600">Salvation Stories</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-2xl font-bold text-green-700">
              {testimonies.filter(t => t.isVerified).length}
            </p>
            <p className="text-sm text-green-600">Verified Stories</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search testimonies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                <Filter className="w-5 h-5" />
                <span className="capitalize">
                  {selectedCategory === 'all' ? 'All Categories' : getCategoryLabel(selectedCategory)}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto sm:ml-2" />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowFilters(false);
                      }}
                      className={clsx(
                        'w-full text-left px-4 py-2 rounded-lg transition-colors',
                        selectedCategory === 'all' ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'
                      )}
                    >
                      All Categories
                    </button>
                    {TESTIMONY_CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setShowFilters(false);
                        }}
                        className={clsx(
                          'w-full text-left px-4 py-2 rounded-lg transition-colors',
                          selectedCategory === cat.value ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Testimony Form Modal */}
        {showNewForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Your Testimony</h3>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTestimony.title}
                    onChange={(e) => setNewTestimony({ ...newTestimony, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="Give your testimony a title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Testimony <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newTestimony.content}
                    onChange={(e) => setNewTestimony({ ...newTestimony, content: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                    placeholder="Share how God has worked in your life..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTestimony.category}
                    onChange={(e) => setNewTestimony({ ...newTestimony, category: e.target.value as TestimonyCategory })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  >
                    {TESTIMONY_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Your testimony may be reviewed before being shared publicly.
                    Thank you for sharing how God has worked in your life!
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newTestimony.title.trim() || !newTestimony.content.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Share Testimony
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Testimonies List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : filteredTestimonies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonies found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share how God has worked in your life'}
            </p>
            {searchQuery || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => setShowNewForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Share Your Testimony
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTestimonies.map(testimony => (
              <TestimonyCard
                key={testimony.id}
                testimony={testimony}
                onEncourage={handleEncourage}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

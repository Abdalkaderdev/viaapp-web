'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import { PRAYER_CATEGORIES } from '@shared/constants';
import {
  Heart,
  Plus,
  X,
  Loader2,
  Filter,
  Users,
  Clock,
  HandHeart,
  ChevronDown,
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';

// Types for prayer wall
interface PrayerWallRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description?: string;
  category: string;
  prayerCount: number;
  hasPrayed: boolean;
  isAnonymous: boolean;
  createdAt: string;
}

// Mock data for demonstration
const MOCK_PRAYERS: PrayerWallRequest[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Sarah M.',
    title: 'Prayer for my father\'s health',
    description: 'My father was diagnosed with a serious illness. Please pray for his healing and for our family during this time.',
    category: 'health',
    prayerCount: 45,
    hasPrayed: false,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Anonymous',
    title: 'Struggling with job loss',
    description: 'I recently lost my job and am struggling to find new employment. Please pray for guidance and provision.',
    category: 'work',
    prayerCount: 32,
    hasPrayed: true,
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Michael T.',
    title: 'Praying for my marriage',
    description: 'My spouse and I are going through a difficult time. Please pray for restoration and healing in our relationship.',
    category: 'relationships',
    prayerCount: 67,
    hasPrayed: false,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    authorId: 'user4',
    authorName: 'Emily R.',
    title: 'Spiritual growth and direction',
    description: 'I\'m seeking God\'s will for my life. Please pray that I would have clarity and wisdom in the decisions ahead.',
    category: 'spiritual',
    prayerCount: 28,
    hasPrayed: false,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '5',
    authorId: 'user5',
    authorName: 'Anonymous',
    title: 'Peace for our community',
    description: 'There has been a lot of tension in our neighborhood. Please pray for peace, understanding, and unity.',
    category: 'world',
    prayerCount: 89,
    hasPrayed: true,
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
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
  const category = PRAYER_CATEGORIES.find(c => c.value === value);
  return category?.label || value;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    personal: 'bg-purple-100 text-purple-700',
    family: 'bg-blue-100 text-blue-700',
    health: 'bg-red-100 text-red-700',
    work: 'bg-amber-100 text-amber-700',
    spiritual: 'bg-teal-100 text-teal-700',
    relationships: 'bg-pink-100 text-pink-700',
    world: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.other;
}

function PrayerCard({
  prayer,
  onPray,
}: {
  prayer: PrayerWallRequest;
  onPray: (id: string) => void;
}) {
  const [praying, setPraying] = useState(false);

  const handlePray = async () => {
    setPraying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onPray(prayer.id);
    setPraying(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
            {prayer.isAnonymous ? '?' : prayer.authorName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {prayer.isAnonymous ? 'Anonymous' : prayer.authorName}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeAgo(prayer.createdAt)}</span>
            </div>
          </div>
        </div>
        <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full', getCategoryColor(prayer.category))}>
          {getCategoryLabel(prayer.category)}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-gray-900 mb-2">{prayer.title}</h3>
      {prayer.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{prayer.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{prayer.prayerCount} people praying</span>
        </div>
        <button
          onClick={handlePray}
          disabled={praying}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
            prayer.hasPrayed
              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
              : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
          )}
        >
          {praying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <HandHeart className={clsx('w-4 h-4', prayer.hasPrayed && 'fill-current')} />
          )}
          {prayer.hasPrayed ? 'Prayed' : 'I Prayed'}
        </button>
      </div>
    </div>
  );
}

export default function PrayerWallPage() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerWallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // New prayer form state
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    description: '',
    category: 'personal',
    isAnonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, []);

  async function fetchPrayers() {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setPrayers(MOCK_PRAYERS);
    setLoading(false);
  }

  const handlePray = (prayerId: string) => {
    setPrayers(prayers.map(prayer => {
      if (prayer.id === prayerId) {
        return {
          ...prayer,
          hasPrayed: !prayer.hasPrayed,
          prayerCount: prayer.hasPrayed ? prayer.prayerCount - 1 : prayer.prayerCount + 1,
        };
      }
      return prayer;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPrayerRequest: PrayerWallRequest = {
      id: Date.now().toString(),
      authorId: user?.id || 'unknown',
      authorName: newPrayer.isAnonymous ? 'Anonymous' : (user?.fullName || 'You'),
      title: newPrayer.title,
      description: newPrayer.description,
      category: newPrayer.category,
      prayerCount: 0,
      hasPrayed: false,
      isAnonymous: newPrayer.isAnonymous,
      createdAt: new Date().toISOString(),
    };

    setPrayers([newPrayerRequest, ...prayers]);
    setNewPrayer({ title: '', description: '', category: 'personal', isAnonymous: false });
    setShowNewForm(false);
    setSubmitting(false);
  };

  // Filter prayers
  const filteredPrayers = prayers.filter(prayer => {
    const matchesCategory = selectedCategory === 'all' || prayer.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prayer.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" />
              Prayer Wall
            </h1>
            <p className="text-gray-600 mt-1">Share prayer requests and pray for others</p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Share Prayer Request
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prayer requests..."
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
                    {PRAYER_CATEGORIES.map(cat => (
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

        {/* New Prayer Form Modal */}
        {showNewForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Prayer Request</h3>
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
                    Prayer Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPrayer.title}
                    onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="Brief title for your prayer request"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newPrayer.description}
                    onChange={(e) => setNewPrayer({ ...newPrayer, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                    placeholder="Share more details about your prayer request..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPrayer.category}
                    onChange={(e) => setNewPrayer({ ...newPrayer, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  >
                    {PRAYER_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newPrayer.isAnonymous}
                    onChange={(e) => setNewPrayer({ ...newPrayer, isAnonymous: e.target.checked })}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Post anonymously
                  </label>
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
                    disabled={submitting || !newPrayer.title.trim()}
                    className="flex-1 px-4 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Share Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Prayer List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : filteredPrayers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No prayer requests found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a prayer request with the community'}
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Share Prayer Request
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrayers.map(prayer => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onPray={handlePray}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

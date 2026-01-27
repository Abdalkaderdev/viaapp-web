'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Bookmark,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Trash2,
  Loader2,
  Clock,
  ChevronRight,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { clsx } from 'clsx';

// Bookmark types
type BookmarkType = 'verse' | 'study' | 'discussion';

interface BookmarkItem {
  id: string;
  type: BookmarkType;
  title: string;
  description?: string;
  url: string;
  meta?: Record<string, string | number>;
  createdAt: string;
}

// Mock bookmarks data
const MOCK_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b1',
    type: 'verse',
    title: 'John 3:16',
    description: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    url: '/bible?verse=John+3:16',
    meta: { translation: 'NIV', book: 'John' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'b2',
    type: 'verse',
    title: 'Psalm 23:1-4',
    description: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters...',
    url: '/bible?verse=Psalm+23:1',
    meta: { translation: 'NIV', book: 'Psalms' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'b3',
    type: 'verse',
    title: 'Proverbs 3:5-6',
    description: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    url: '/bible?verse=Proverbs+3:5',
    meta: { translation: 'NIV', book: 'Proverbs' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'b4',
    type: 'study',
    title: 'Foundations of Faith',
    description: 'A comprehensive introduction to the core beliefs of Christianity for new believers.',
    url: '/studies/1',
    meta: { lessons: 12, progress: 45 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'b5',
    type: 'study',
    title: 'Prayer Essentials',
    description: 'Learn how to develop a deeper prayer life and communicate with God effectively.',
    url: '/studies/2',
    meta: { lessons: 8, progress: 20 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'b6',
    type: 'discussion',
    title: 'How do you handle doubt in your faith?',
    description: 'I have been struggling with doubt lately and wanted to hear how others deal with it.',
    url: '/community/discussions/1',
    meta: { replies: 23 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: 'b7',
    type: 'discussion',
    title: 'Favorite worship songs that speak to your heart',
    description: 'Share worship songs that have been meaningful in your walk with God.',
    url: '/community/discussions/2',
    meta: { replies: 56 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
];

const BOOKMARK_TYPES = [
  { value: 'all', label: 'All Bookmarks', icon: Bookmark },
  { value: 'verse', label: 'Verses', icon: BookOpen },
  { value: 'study', label: 'Studies', icon: GraduationCap },
  { value: 'discussion', label: 'Discussions', icon: MessageSquare },
] as const;

function getTypeIcon(type: BookmarkType) {
  switch (type) {
    case 'verse':
      return BookOpen;
    case 'study':
      return GraduationCap;
    case 'discussion':
      return MessageSquare;
    default:
      return Bookmark;
  }
}

function getTypeColor(type: BookmarkType): string {
  const colors: Record<BookmarkType, string> = {
    verse: 'bg-blue-100 text-blue-700',
    study: 'bg-purple-100 text-purple-700',
    discussion: 'bg-green-100 text-green-700',
  };
  return colors[type];
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

function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkItem;
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const Icon = getTypeIcon(bookmark.type);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onRemove(bookmark.id);
  };

  return (
    <Link
      href={bookmark.url}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={clsx('p-3 rounded-xl flex-shrink-0', getTypeColor(bookmark.type))}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
                {bookmark.title}
              </h3>
              {bookmark.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{bookmark.description}</p>
              )}
            </div>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Remove bookmark"
            >
              {removing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className={clsx('font-medium px-2 py-0.5 rounded-full', getTypeColor(bookmark.type))}>
              {bookmark.type.charAt(0).toUpperCase() + bookmark.type.slice(1)}
            </span>
            {bookmark.meta && Object.entries(bookmark.meta).slice(0, 2).map(([key, value]) => (
              <span key={key} className="capitalize">{key}: {value}</span>
            ))}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(bookmark.createdAt)}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0 self-center" />
      </div>
    </Link>
  );
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | BookmarkType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function fetchBookmarks() {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setBookmarks(MOCK_BOOKMARKS);
    setLoading(false);
  }

  const handleRemove = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
  };

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesType = selectedType === 'all' || b.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group bookmarks by type for summary
  const verseCount = bookmarks.filter(b => b.type === 'verse').length;
  const studyCount = bookmarks.filter(b => b.type === 'study').length;
  const discussionCount = bookmarks.filter(b => b.type === 'discussion').length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-brand-500" />
            Bookmarks
          </h1>
          <p className="text-gray-600 mt-1">Your saved verses, studies, and discussions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedType('verse')}
            className={clsx(
              'bg-white rounded-xl p-4 border transition-all text-left',
              selectedType === 'verse' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{verseCount}</p>
                <p className="text-sm text-gray-500">Verses</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setSelectedType('study')}
            className={clsx(
              'bg-white rounded-xl p-4 border transition-all text-left',
              selectedType === 'study' ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studyCount}</p>
                <p className="text-sm text-gray-500">Studies</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setSelectedType('discussion')}
            className={clsx(
              'bg-white rounded-xl p-4 border transition-all text-left',
              selectedType === 'discussion' ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{discussionCount}</p>
                <p className="text-sm text-gray-500">Discussions</p>
              </div>
            </div>
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
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                <Filter className="w-5 h-5" />
                <span className="capitalize">
                  {selectedType === 'all' ? 'All Types' : BOOKMARK_TYPES.find(t => t.value === selectedType)?.label}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto sm:ml-2" />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                  <div className="p-2">
                    {BOOKMARK_TYPES.map(type => {
                      const TypeIcon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => {
                            setSelectedType(type.value as 'all' | BookmarkType);
                            setShowFilters(false);
                          }}
                          className={clsx(
                            'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left',
                            selectedType === type.value ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'
                          )}
                        >
                          <TypeIcon className="w-4 h-4" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookmarks List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {bookmarks.length === 0
                ? 'Start bookmarking verses, studies, and discussions to save them here'
                : 'Try adjusting your search or filters'}
            </p>
            {(searchQuery || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                }}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Clear filters
              </button>
            )}
            {bookmarks.length === 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <Link
                  href="/bible"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Bible
                </Link>
                <Link
                  href="/studies"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Browse Studies
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                {selectedType !== 'all' && ` in ${BOOKMARK_TYPES.find(t => t.value === selectedType)?.label}`}
              </p>
              {selectedType !== 'all' && (
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-sm text-brand-600 font-medium hover:text-brand-700"
                >
                  View all
                </button>
              )}
            </div>
            <div className="space-y-3">
              {filteredBookmarks.map(bookmark => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

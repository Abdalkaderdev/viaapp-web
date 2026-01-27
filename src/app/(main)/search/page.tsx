'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  Search as SearchIcon,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Users,
  Heart,
  Loader2,
  Filter,
  ChevronDown,
  Clock,
  ArrowRight,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

// Search result types
type ContentType = 'all' | 'verses' | 'studies' | 'discussions' | 'groups' | 'prayers';

interface SearchResult {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  url: string;
  meta?: Record<string, string | number>;
  createdAt?: string;
}

const CONTENT_TYPES = [
  { value: 'all', label: 'All', icon: SearchIcon },
  { value: 'verses', label: 'Bible Verses', icon: BookOpen },
  { value: 'studies', label: 'Studies', icon: GraduationCap },
  { value: 'discussions', label: 'Discussions', icon: MessageSquare },
  { value: 'groups', label: 'Groups', icon: Users },
  { value: 'prayers', label: 'Prayers', icon: Heart },
] as const;

// Mock search results for demonstration
const MOCK_RESULTS: Record<ContentType, SearchResult[]> = {
  all: [],
  verses: [
    {
      id: 'v1',
      type: 'verses',
      title: 'John 3:16',
      description: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      url: '/bible?verse=John+3:16',
      meta: { translation: 'NIV', book: 'John' },
    },
    {
      id: 'v2',
      type: 'verses',
      title: 'Romans 8:28',
      description: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      url: '/bible?verse=Romans+8:28',
      meta: { translation: 'NIV', book: 'Romans' },
    },
    {
      id: 'v3',
      type: 'verses',
      title: 'Philippians 4:13',
      description: 'I can do all this through him who gives me strength.',
      url: '/bible?verse=Philippians+4:13',
      meta: { translation: 'NIV', book: 'Philippians' },
    },
  ],
  studies: [
    {
      id: 's1',
      type: 'studies',
      title: 'Foundations of Faith',
      description: 'A comprehensive introduction to the core beliefs of Christianity.',
      url: '/studies/1',
      meta: { lessons: 12, enrolled: 1542 },
    },
    {
      id: 's2',
      type: 'studies',
      title: 'Prayer Essentials',
      description: 'Learn how to develop a deeper prayer life.',
      url: '/studies/2',
      meta: { lessons: 8, enrolled: 982 },
    },
  ],
  discussions: [
    {
      id: 'd1',
      type: 'discussions',
      title: 'How do you handle doubt in your faith?',
      description: 'I have been struggling with doubt lately and wanted to hear how others deal with it.',
      url: '/community/discussions/1',
      meta: { replies: 23, views: 156 },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'd2',
      type: 'discussions',
      title: 'Best practices for morning devotionals',
      description: 'Share your morning devotional routine and tips.',
      url: '/community/discussions/2',
      meta: { replies: 45, views: 234 },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
  groups: [
    {
      id: 'g1',
      type: 'groups',
      title: 'Prayer Warriors',
      description: 'A group dedicated to intercessory prayer.',
      url: '/community/groups/1',
      meta: { members: 156 },
    },
    {
      id: 'g2',
      type: 'groups',
      title: 'Bible Study Group',
      description: 'Weekly Bible study discussions and fellowship.',
      url: '/community/groups/2',
      meta: { members: 89 },
    },
  ],
  prayers: [
    {
      id: 'p1',
      type: 'prayers',
      title: 'Prayer for healing',
      description: 'Please pray for my mother who is going through treatment.',
      url: '/community/prayer-wall',
      meta: { prayerCount: 45 },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
};

function getTypeIcon(type: ContentType) {
  const typeConfig = CONTENT_TYPES.find(t => t.value === type);
  return typeConfig?.icon || SearchIcon;
}

function getTypeColor(type: ContentType): string {
  const colors: Record<ContentType, string> = {
    all: 'bg-gray-100 text-gray-700',
    verses: 'bg-blue-100 text-blue-700',
    studies: 'bg-purple-100 text-purple-700',
    discussions: 'bg-green-100 text-green-700',
    groups: 'bg-amber-100 text-amber-700',
    prayers: 'bg-rose-100 text-rose-700',
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

function SearchResultCard({ result }: { result: SearchResult }) {
  const Icon = getTypeIcon(result.type);

  return (
    <Link
      href={result.url}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={clsx('p-3 rounded-xl', getTypeColor(result.type))}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
              {result.title}
            </h3>
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', getTypeColor(result.type))}>
              {CONTENT_TYPES.find(t => t.value === result.type)?.label}
            </span>
          </div>
          {result.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{result.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {result.meta && Object.entries(result.meta).map(([key, value]) => (
              <span key={key} className="capitalize">{key}: {value}</span>
            ))}
            {result.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(result.createdAt)}
              </span>
            )}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'John 3:16',
    'prayer',
    'faith',
    'love',
  ]);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string, type: ContentType) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call with filtering
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, this would call the actual API
    // const result = await api.search({ query: searchQuery, type });

    // For now, filter mock results based on query and type
    let filteredResults: SearchResult[] = [];

    if (type === 'all') {
      // Combine all types
      Object.values(MOCK_RESULTS).forEach(typeResults => {
        filteredResults = [...filteredResults, ...typeResults];
      });
    } else {
      filteredResults = MOCK_RESULTS[type] || [];
    }

    // Filter by query (simple text match)
    const lowerQuery = searchQuery.toLowerCase();
    filteredResults = filteredResults.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description?.toLowerCase().includes(lowerQuery)
    );

    setResults(filteredResults);
    setLoading(false);

    // Update recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  }, [recentSearches]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query, contentType);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, contentType, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, contentType);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">Find verses, studies, discussions, and more</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <SearchIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for verses, studies, discussions..."
                className="flex-1 text-lg outline-none bg-transparent"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content Type Filters */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CONTENT_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setContentType(type.value as ContentType)}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                        contentType === type.value
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        {/* Recent Searches (when no query) */}
        {!query && !hasSearched && recentSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(search)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links (when no query) */}
        {!query && !hasSearched && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/bible"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <BookOpen className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">Bible</h3>
              <p className="text-sm text-gray-500">Read and search Scripture</p>
            </Link>
            <Link
              href="/studies"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <GraduationCap className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">Studies</h3>
              <p className="text-sm text-gray-500">Explore Bible studies</p>
            </Link>
            <Link
              href="/community"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <Users className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">Community</h3>
              <p className="text-sm text-gray-500">Connect with others</p>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 mb-4">
                  Try a different search term or adjust your filters
                </p>
                <button
                  onClick={clearSearch}
                  className="text-brand-600 font-medium hover:text-brand-700"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(result => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

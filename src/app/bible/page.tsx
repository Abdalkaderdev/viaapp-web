'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronLeft,
  BookMarked,
  Clock,
  Play,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ReadingPlan, UserReadingProgress } from '@shared/types';

interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  order: number;
  testament: 'old' | 'new';
  chapter_count: number;
}

interface BibleTranslation {
  id: string;
  code: string;
  name: string;
  language: string;
}

interface BibleVerse {
  id: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export default function BiblePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'plans'>('books');
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [progress, setProgress] = useState<UserReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bible data
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('KJV');
  const [booksLoading, setBooksLoading] = useState(true);

  // Reading view state
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [versesLoading, setVersesLoading] = useState(false);

  useEffect(() => {
    async function fetchBibleData() {
      setBooksLoading(true);
      try {
        const [booksResult, translationsResult] = await Promise.all([
          api.bible.getBooks(),
          api.bible.getTranslations(),
        ]);

        if (booksResult.data) setBooks(booksResult.data);
        if (translationsResult.data) setTranslations(translationsResult.data);
      } catch (err) {
        console.error('Failed to load Bible data:', err);
      }
      setBooksLoading(false);
    }
    fetchBibleData();
  }, []);

  useEffect(() => {
    async function fetchPlansData() {
      setLoading(true);
      setError(null);
      try {
        const [plansResult, progressResult] = await Promise.all([
          api.readingPlans.getPlans(),
          api.readingPlans.getProgress(),
        ]);

        if (plansResult.data) setPlans(plansResult.data);
        if (progressResult.data) setProgress(progressResult.data);
      } catch {
        setError('Failed to load reading plans');
      }
      setLoading(false);
    }
    fetchPlansData();
  }, []);

  // Fetch chapter verses when book and chapter selected
  useEffect(() => {
    async function fetchChapter() {
      if (!selectedBook || !selectedChapter) return;

      setVersesLoading(true);
      try {
        const result = await api.bible.getChapter(
          selectedBook.id,
          selectedChapter,
          selectedTranslation
        );
        if (result.data) {
          setVerses(result.data.verses);
        }
      } catch (err) {
        console.error('Failed to load chapter:', err);
      }
      setVersesLoading(false);
    }
    fetchChapter();
  }, [selectedBook, selectedChapter, selectedTranslation]);

  const handleStartPlan = async (planId: string) => {
    const result = await api.readingPlans.startPlan(planId);
    if (result.data) {
      setProgress([...progress, result.data]);
    }
  };

  const handleBookClick = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setVerses([]);
  };

  const oldTestamentBooks = books.filter((b) => b.testament === 'old');
  const newTestamentBooks = books.filter((b) => b.testament === 'new');

  const filteredBooks = (bookList: BibleBook[]) =>
    bookList.filter((book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Chapter reading view
  if (selectedBook && selectedChapter) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToBooks}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Books
            </button>

            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium"
            >
              {translations.map((trans) => (
                <option key={trans.code} value={trans.code}>
                  {trans.code} - {trans.name}
                </option>
              ))}
            </select>
          </div>

          {/* Book and Chapter Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedBook.name} {selectedChapter}
            </h1>
            <p className="text-gray-500">
              {selectedTranslation} Translation
            </p>
          </div>

          {/* Chapter Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedChapter((c) => Math.max(1, (c || 1) - 1))}
              disabled={selectedChapter === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-200"
            >
              {Array.from({ length: selectedBook.chapter_count }, (_, i) => i + 1).map(
                (num) => (
                  <option key={num} value={num}>
                    Chapter {num}
                  </option>
                )
              )}
            </select>

            <button
              onClick={() =>
                setSelectedChapter((c) =>
                  Math.min(selectedBook.chapter_count, (c || 1) + 1)
                )
              }
              disabled={selectedChapter === selectedBook.chapter_count}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Verses */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {versesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : verses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No verses found
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {verses.map((verse) => (
                  <p key={verse.id} className="mb-4 leading-relaxed">
                    <sup className="text-brand-500 font-bold mr-1">{verse.verse}</sup>
                    <span className="text-gray-800">{verse.text}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-brand-500" />
              Bible
            </h1>
            <p className="text-gray-600 mt-1">Read, search, and study Scripture</p>
          </div>

          {/* Translation Selector */}
          <select
            value={selectedTranslation}
            onChange={(e) => setSelectedTranslation(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
          >
            {translations.map((trans) => (
              <option key={trans.code} value={trans.code}>
                {trans.code}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'books'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bible Books
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'plans'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reading Plans
          </button>
        </div>

        {activeTab === 'books' ? (
          booksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Bible data is loading...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Old Testament */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Old Testament ({oldTestamentBooks.length} books)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {filteredBooks(oldTestamentBooks).map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left group"
                    >
                      <div>
                        <span className="font-medium text-gray-700 group-hover:text-brand-700 block">
                          {book.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {book.chapter_count} chapters
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* New Testament */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  New Testament ({newTestamentBooks.length} books)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {filteredBooks(newTestamentBooks).map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left group"
                    >
                      <div>
                        <span className="font-medium text-gray-700 group-hover:text-brand-700 block">
                          {book.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {book.chapter_count} chapters
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {/* Active Plans */}
            {progress.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  Your Active Plans
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {progress.map((p) => {
                    const plan = plans.find((pl) => pl.id === p.planId);
                    const progressPercent = plan
                      ? Math.round((p.currentDay / plan.durationDays) * 100)
                      : 0;
                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl p-5 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {plan?.name || 'Reading Plan'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Day {p.currentDay} of {plan?.durationDays || '?'}
                            </p>
                          </div>
                          {p.completedAt ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {progressPercent}% complete
                          </p>
                        </div>
                        <button className="w-full py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
                          Continue Reading
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Plans */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-500" />
                Available Reading Plans
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12 text-red-500">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              ) : plans.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                  <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reading plans available yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans
                    .filter((p) => !progress.find((pr) => pr.planId === p.id))
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-300 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>{plan.durationDays} days</span>
                          <span className="capitalize">{plan.difficulty}</span>
                        </div>
                        <button
                          onClick={() => handleStartPlan(plan.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 border border-brand-500 text-brand-600 font-medium rounded-lg hover:bg-brand-50 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Start Plan
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

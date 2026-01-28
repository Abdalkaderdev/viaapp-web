'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  Plus,
  RefreshCw,
  Star,
  Trophy,
  Loader2,
  AlertCircle,
  X,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from 'lucide-react';
import type { MemoryVerse, UserStats } from '@shared/types';
import { useToast } from '@/components/ui/toast';
import { VerseCardSkeleton, StatCardSkeleton } from '@/components/ui/skeleton';

export default function MemoryVersePage() {
  const { success, error: showError } = useToast();
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<MemoryVerse | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVerse, setNewVerse] = useState({ reference: '', text: '' });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [versesResult, statsResult] = await Promise.all([
        api.memory.getVerses(),
        api.user.getStats(),
      ]);

      if (versesResult.data) {
        setVerses(versesResult.data);
      } else if (versesResult.error) {
        setError(versesResult.error);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch {
      setError('Failed to load memory verses');
    }
    setLoading(false);
  }

  async function handleAddVerse() {
    if (!newVerse.reference.trim() || !newVerse.text.trim()) return;
    setAdding(true);
    try {
      const result = await api.memory.addVerse(newVerse);
      if (result.data) {
        setVerses([result.data, ...verses]);
        setShowAddModal(false);
        setNewVerse({ reference: '', text: '' });
        success('Verse added to your memory list');
      } else if (result.error) {
        showError('Failed to add verse. Please try again.');
      }
    } catch {
      showError('Failed to add verse. Please try again.');
    }
    setAdding(false);
  }

  async function handleReview(correct: boolean) {
    if (!selectedVerse) return;
    try {
      const result = await api.memory.reviewVerse(selectedVerse.id, correct);
      if (result.data) {
        setVerses(verses.map((v) => (v.id === result.data!.id ? result.data! : v)));
        if (correct) {
          success('Great job! Keep it up!');
        }
      } else {
        showError('Failed to save review. Please try again.');
      }
    } catch {
      showError('Failed to save review. Please try again.');
    }
    setShowAnswer(false);
    setPracticeMode(false);
    setSelectedVerse(null);
  }

  async function deleteVerse(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setDeletingId(id);
    try {
      const result = await api.memory.deleteVerse(id);
      if (!result.error) {
        setVerses(verses.filter((v) => v.id !== id));
        success('Verse removed');
      } else {
        showError('Failed to delete verse. Please try again.');
      }
    } catch {
      showError('Failed to delete verse. Please try again.');
    }
    setDeletingId(null);
  }

  const masteredVerses = verses.filter((v) => v.masteryLevel === 'mastered');
  const inProgressVerses = verses.filter((v) => v.masteryLevel !== 'mastered');

  const formatLastReviewed = (date: string | null | undefined) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const getMasteryProgress = (level: string, correctCount: number) => {
    switch (level) {
      case 'mastered':
        return 100;
      case 'reviewing':
        return 50 + Math.min(correctCount * 10, 40);
      default:
        return Math.min(correctCount * 20, 50);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto" role="status" aria-label="Loading memory verses">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="space-y-3">
            <VerseCardSkeleton />
            <VerseCardSkeleton />
            <VerseCardSkeleton />
          </div>
          <span className="sr-only">Loading memory verses...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-brand-500" />
              Memory Verses
            </h1>
            <p className="text-gray-600 mt-1">Hide God&apos;s Word in your heart</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Verse
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{verses.length}</p>
                <p className="text-sm text-gray-500">Total Verses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalVersesMemorized || masteredVerses.length}
                </p>
                <p className="text-sm text-gray-500">Mastered</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressVerses.length}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.currentStreak || 0}
                </p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Mode */}
        {practiceMode && selectedVerse ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
                Practice Mode
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedVerse.reference}
              </h2>

              <div
                className={`p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 mb-6 min-h-[150px] flex items-center justify-center ${
                  !showAnswer ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => !showAnswer && setShowAnswer(true)}
              >
                {showAnswer ? (
                  <p className="text-xl font-serif text-gray-800 leading-relaxed">
                    &quot;{selectedVerse.text}&quot;
                  </p>
                ) : (
                  <p className="text-gray-500">Tap to reveal verse</p>
                )}
              </div>

              {showAnswer ? (
                <div className="flex items-center justify-center gap-4">
                  <p className="text-gray-600 mr-4">Did you get it right?</p>
                  <button
                    onClick={() => handleReview(false)}
                    className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    No
                  </button>
                  <button
                    onClick={() => handleReview(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Yes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPracticeMode(false);
                    setSelectedVerse(null);
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Exit Practice
                </button>
              )}
            </div>
          </div>
        ) : verses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Brain className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No memory verses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start hiding God&apos;s Word in your heart by adding your first verse
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Verse
            </button>
          </div>
        ) : (
          <>
            {/* Verses Due for Review */}
            {inProgressVerses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Due for Review
                </h2>
                <div className="space-y-3">
                  {inProgressVerses.map((verse) => {
                    const progress = getMasteryProgress(verse.masteryLevel, verse.correctCount);
                    return (
                      <div
                        key={verse.id}
                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-300 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedVerse(verse);
                          setPracticeMode(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {verse.reference}
                              </h3>
                              <span className="text-xs text-gray-500">
                                Last reviewed: {formatLastReviewed(verse.lastReviewedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {verse.text}
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {progress}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={(e) => deleteVerse(verse.id, e)}
                              disabled={deletingId === verse.id}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              aria-label={`Delete ${verse.reference}`}
                            >
                              {deletingId === verse.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                            <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mastered Verses */}
            {masteredVerses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Mastered
                </h2>
                <div className="space-y-3">
                  {masteredVerses.map((verse) => (
                    <div
                      key={verse.id}
                      className="bg-white rounded-xl p-4 border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={() => {
                        setSelectedVerse(verse);
                        setPracticeMode(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-gray-900">
                              {verse.reference}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {verse.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => deleteVerse(verse.id, e)}
                            disabled={deletingId === verse.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            aria-label={`Delete ${verse.reference}`}
                          >
                            {deletingId === verse.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            )}
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Verse Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Memory Verse</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John 3:16"
                    value={newVerse.reference}
                    onChange={(e) =>
                      setNewVerse({ ...newVerse, reference: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verse Text
                  </label>
                  <textarea
                    placeholder="Enter the verse text..."
                    value={newVerse.text}
                    onChange={(e) =>
                      setNewVerse({ ...newVerse, text: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddVerse}
                disabled={adding || !newVerse.reference.trim() || !newVerse.text.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {adding ? 'Adding...' : 'Add Verse'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

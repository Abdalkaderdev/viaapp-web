'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  PenLine,
  Clock,
  BookOpen,
  Search,
  X,
  ChevronDown,
  Play,
  Pause,
  CheckCircle,
  Loader2,
  Book,
} from 'lucide-react';

// Bible books data
const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '1 John', chapters: 5 },
  { name: 'Revelation', chapters: 22 },
];

const POPULAR_PASSAGES = [
  'Psalm 23',
  'John 3:16-17',
  'Romans 8:28-39',
  'Philippians 4:4-9',
  'Proverbs 3:5-6',
  'Isaiah 40:28-31',
  'Matthew 6:25-34',
  'Psalm 91',
  '1 Corinthians 13',
  'Ephesians 6:10-18',
];

type ViewMode = 'selection' | 'journal';

export default function CustomQTPage() {
  const router = useRouter();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verseRange, setVerseRange] = useState('');
  const [customPassage, setCustomPassage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Journal content
  const [notes, setNotes] = useState('');
  const [prayerPoints, setPrayerPoints] = useState('');
  const [application, setApplication] = useState('');

  // Timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Saving
  const [saving, setSaving] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPassage = () => {
    if (customPassage) return customPassage;
    if (selectedBook && selectedChapter) {
      return verseRange
        ? `${selectedBook} ${selectedChapter}:${verseRange}`
        : `${selectedBook} ${selectedChapter}`;
    }
    return '';
  };

  const handleSelectBook = (bookName: string) => {
    setSelectedBook(bookName);
    setSelectedChapter(null);
    setVerseRange('');
  };

  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setShowBookPicker(false);
  };

  const handleSelectPopularPassage = (passage: string) => {
    setCustomPassage(passage);
    setSelectedBook('');
    setSelectedChapter(null);
  };

  const startSession = () => {
    const passage = getCurrentPassage();
    if (!passage) return;

    setStartTime(Date.now());
    setIsTimerRunning(true);
    setViewMode('journal');
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      if (!startTime) {
        setStartTime(Date.now());
      }
      setIsTimerRunning(true);
    }
  };

  const completeSession = async () => {
    setSaving(true);

    try {
      await api.quietTime.createSession({
        type: 'word_to_life', // Custom QT mapped to word_to_life
        durationSeconds: elapsedTime,
        verseReference: getCurrentPassage(),
        reflectionNotes: notes,
      });
    } catch (error) {
      console.warn('Failed to save session:', error);
    } finally {
      setSaving(false);
      router.push('/quiet-time?completed=true');
    }
  };

  const filteredBooks = BIBLE_BOOKS.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBookData = BIBLE_BOOKS.find((b) => b.name === selectedBook);

  // Book Picker Modal
  const BookPickerModal = () => {
    if (!showBookPicker) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-lg">
              {selectedBook && !selectedChapter ? 'Select Chapter' : 'Select Book'}
            </h3>
            <button
              onClick={() => setShowBookPicker(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!selectedBook && (
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedBook ? (
              <div className="space-y-2">
                {filteredBooks.map((book) => (
                  <button
                    key={book.name}
                    onClick={() => handleSelectBook(book.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="font-medium">{book.name}</span>
                    <span className="text-sm text-gray-500">
                      {book.chapters} chapters
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedBook('')}
                  className="text-brand-600 text-sm mb-4 hover:underline"
                >
                  Change book
                </button>
                <p className="font-semibold mb-3">{selectedBook}</p>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from(
                    { length: selectedBookData?.chapters || 0 },
                    (_, i) => i + 1
                  ).map((chapter) => (
                    <button
                      key={chapter}
                      onClick={() => handleSelectChapter(chapter)}
                      className={`w-full aspect-square flex items-center justify-center rounded-lg font-medium transition-colors ${
                        selectedChapter === chapter
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Selection View
  const SelectionView = () => (
    <div className="space-y-6">
      {/* Manual Input */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Enter a passage
        </label>
        <input
          type="text"
          placeholder="e.g., John 3:16-21 or Psalm 23"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          value={customPassage}
          onChange={(e) => {
            setCustomPassage(e.target.value);
            setSelectedBook('');
            setSelectedChapter(null);
          }}
        />
      </div>

      <div className="text-center text-gray-500">- or -</div>

      {/* Book/Chapter Selector */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Select from Bible
        </label>
        <button
          onClick={() => setShowBookPicker(true)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
        >
          <span className={selectedBook ? 'text-gray-900' : 'text-gray-500'}>
            {selectedBook
              ? selectedChapter
                ? `${selectedBook} ${selectedChapter}`
                : `${selectedBook} - Select chapter`
              : 'Choose a book...'}
          </span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>

        {selectedBook && selectedChapter && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Verse range (optional, e.g., 1-10)"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              value={verseRange}
              onChange={(e) => setVerseRange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Popular Passages */}
      <div>
        <label className="block font-medium text-gray-700 mb-3">
          Popular Passages
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PASSAGES.map((passage) => (
            <button
              key={passage}
              onClick={() => handleSelectPopularPassage(passage)}
              className={`px-3 py-2 rounded-full text-sm transition-colors ${
                customPassage === passage
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {passage}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startSession}
        disabled={!getCurrentPassage()}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        Start Quiet Time with {getCurrentPassage() || '...'}
      </button>
    </div>
  );

  // Journal View
  const JournalView = () => (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-emerald-600" />
            <span className="text-3xl font-bold">{formatTime(elapsedTime)}</span>
          </div>
          <button
            onClick={toggleTimer}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
              isTimerRunning
                ? 'bg-gray-200 hover:bg-gray-300'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isTimerRunning ? (
              <Pause className="w-5 h-5 text-gray-700" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-gray-500">
          <Book className="w-4 h-4" />
          <span>{getCurrentPassage()}</span>
        </div>
      </div>

      {/* Open Bible Reader Link */}
      <a
        href={`/bible?passage=${encodeURIComponent(getCurrentPassage())}`}
        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <BookOpen className="w-5 h-5 text-emerald-600" />
        Open in Bible Reader
      </a>

      {/* Notes Section */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Notes & Observations
        </label>
        <p className="text-sm text-gray-500 mb-2">
          What stands out to you? What is God saying through this passage?
        </p>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none"
          rows={5}
          placeholder="Write your observations and insights..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Prayer Points */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Prayer Points
        </label>
        <p className="text-sm text-gray-500 mb-2">
          How does this passage lead you to pray?
        </p>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none"
          rows={4}
          placeholder="Write your prayers and requests..."
          value={prayerPoints}
          onChange={(e) => setPrayerPoints(e.target.value)}
        />
      </div>

      {/* Application */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Application
        </label>
        <p className="text-sm text-gray-500 mb-2">
          How will you apply this passage to your life today?
        </p>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none"
          rows={4}
          placeholder="Write how you'll live this out..."
          value={application}
          onChange={(e) => setApplication(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={completeSession}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          Complete Quiet Time
        </button>

        <button
          onClick={() => setViewMode('selection')}
          className="w-full px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Change Passage
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/quiet-time"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PenLine className="w-6 h-6 text-emerald-500" />
              Custom QT
            </h1>
            <p className="text-gray-600">
              Choose your own passage and journal freely
            </p>
          </div>
        </div>

        {/* View Toggle when session started */}
        {startTime && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('selection')}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'selection'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Passage
            </button>
            <button
              onClick={() => setViewMode('journal')}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'journal'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Journal
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {!startTime || viewMode === 'selection' ? (
            <SelectionView />
          ) : (
            <JournalView />
          )}
        </div>
      </div>

      <BookPickerModal />
    </DashboardLayout>
  );
}

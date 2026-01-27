'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  Sun,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle,
  PenLine,
  MessageSquare,
  Loader2,
  Sparkles,
} from 'lucide-react';

// Reading plan with popular passages
const READING_PASSAGES = [
  { reference: 'John 15:1-8', title: 'The Vine and the Branches' },
  { reference: 'Psalm 23', title: 'The Lord is My Shepherd' },
  { reference: 'Romans 8:28-39', title: 'More Than Conquerors' },
  { reference: 'Matthew 5:1-12', title: 'The Beatitudes' },
  { reference: 'Philippians 4:4-9', title: 'Rejoice in the Lord' },
  { reference: 'Isaiah 40:28-31', title: 'Those Who Wait on the Lord' },
  { reference: 'Ephesians 2:1-10', title: 'Saved by Grace' },
  { reference: '1 Corinthians 13:1-13', title: 'The Way of Love' },
  { reference: 'James 1:2-8', title: 'Trials and Wisdom' },
  { reference: 'Psalm 139:1-18', title: 'God Knows Me' },
  { reference: 'Hebrews 12:1-3', title: 'The Race of Faith' },
  { reference: 'Matthew 6:25-34', title: 'Do Not Worry' },
  { reference: 'Colossians 3:12-17', title: 'Put On Love' },
  { reference: 'Proverbs 3:1-8', title: 'Trust in the Lord' },
  { reference: 'Galatians 5:16-26', title: 'The Fruit of the Spirit' },
];

interface DailyReading {
  reference: string;
  title: string;
  content: string;
  reflectionQuestions: string[];
}

const steps = [
  { id: 1, name: 'Read', description: 'Read the passage carefully' },
  { id: 2, name: 'Observe', description: 'What do you notice?' },
  { id: 3, name: 'Reflect', description: 'Answer reflection questions' },
  { id: 4, name: 'Apply', description: 'How will you apply this?' },
];

export default function WordToLifePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [sessionStartTime] = useState(() => Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [todaysReading, setTodaysReading] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReading() {
      try {
        // Get passage based on day of year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const passageIndex = dayOfYear % READING_PASSAGES.length;
        const todaysPassage = READING_PASSAGES[passageIndex];

        // Fetch passage from Bible API
        const verseResult = await api.bible.getVerse(todaysPassage.reference);

        if (verseResult.error || !verseResult.data) {
          throw new Error('Failed to fetch passage');
        }

        // Set initial reading without AI questions
        setTodaysReading({
          reference: verseResult.data.reference || todaysPassage.reference,
          title: todaysPassage.title,
          content: verseResult.data.text,
          reflectionQuestions: [
            'What stands out to you most in this passage?',
            'How does this Scripture apply to your life today?',
            'What is God teaching you through these words?',
          ],
        });
        setLoading(false);

        // Fetch AI-generated reflection questions in background
        setLoadingQuestions(true);
        try {
          const aiResult = await api.ai.getReflectionQuestions(
            verseResult.data.text,
            todaysPassage.reference
          );

          if (aiResult.data?.questions && aiResult.data.questions.length > 0) {
            setTodaysReading(prev => prev ? {
              ...prev,
              reflectionQuestions: aiResult.data!.questions,
            } : null);
          }
        } catch {
          // AI questions not available, using defaults
        }
        setLoadingQuestions(false);

      } catch (err) {
        console.error('Error fetching reading:', err);
        setError('Unable to load today\'s reading. Please try again.');
        setLoading(false);
      }
    }
    fetchReading();
  }, []);

  async function handleCompleteSession() {
    setIsSaving(true);
    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    await api.quietTime.createSession({
      type: 'word_to_life',
      durationSeconds,
      verseReference: todaysReading?.reference || 'Daily Reading',
      reflectionNotes: journalEntry || undefined,
    });

    router.push('/quiet-time?completed=true');
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-gray-500 mt-4">Loading today&apos;s reading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !todaysReading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-500">{error || "Unable to load today's reading."}</p>
          <Link href="/quiet-time" className="text-brand-600 hover:text-brand-700 mt-4 inline-block">
            Go back
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
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
              <Sun className="w-6 h-6 text-amber-500" />
              Word to Life
            </h1>
            <p className="text-gray-600">Apply Scripture to your daily life</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl p-4 border border-gray-200">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-2">
              Today&apos;s Reading
            </span>
            <h2 className="text-xl font-bold text-gray-900">{todaysReading.title}</h2>
            <p className="text-brand-600 font-medium">{todaysReading.reference}</p>
          </div>

          {/* Reading Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <BookOpen className="w-6 h-6 text-amber-500 mb-4" />
                <p className="text-gray-800 leading-relaxed text-lg">
                  {todaysReading.content}
                </p>
              </div>
            </div>
          )}

          {/* Observe Step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-500" />
                  What do you observe?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Who is speaking? To whom?</li>
                  <li>• What key words or phrases stand out?</li>
                  <li>• What imagery or metaphors are used?</li>
                  <li>• What commands or promises do you see?</li>
                </ul>
              </div>
            </div>
          )}

          {/* Reflect Step */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Reflection Questions</h3>
                {loadingQuestions && (
                  <span className="flex items-center gap-2 text-sm text-brand-600">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Generating AI questions...
                  </span>
                )}
              </div>
              {todaysReading.reflectionQuestions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <p className="text-gray-700 font-medium">{index + 1}. {question}</p>
                </div>
              ))}
            </div>
          )}

          {/* Apply Step */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-brand-500" />
                  Journal Your Application
                </h3>
                <p className="text-gray-600 mb-4">
                  Write down one specific way you will apply this passage today:
                </p>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Today, I will..."
                  className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleCompleteSession}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Complete Session'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Next Step
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

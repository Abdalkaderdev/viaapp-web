'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  Heart,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Volume2,
  Loader2,
} from 'lucide-react';

interface DailyVerse {
  reference: string;
  text: string;
  translation: string;
}

const steps = [
  { id: 1, name: 'Read', description: 'Read the verse slowly and carefully' },
  { id: 2, name: 'Understand', description: 'Reflect on what it means' },
  { id: 3, name: 'Memorize', description: 'Practice reciting the verse' },
  { id: 4, name: 'Apply', description: 'Think about how to apply it' },
];

export default function WordToHeartPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showVerse, setShowVerse] = useState(true);
  const [sessionStartTime] = useState(() => Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [memoryVerse, setMemoryVerse] = useState<DailyVerse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerse() {
      const result = await api.quietTime.getDailyVerse();
      if (result.data) {
        setMemoryVerse(result.data);
      }
      setLoading(false);
    }
    fetchVerse();
  }, []);

  async function handleCompleteSession() {
    setIsSaving(true);
    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    await api.quietTime.createSession({
      type: 'word_to_heart',
      durationSeconds,
      verseReference: memoryVerse?.reference || 'Daily Verse',
    });

    router.push('/quiet-time?completed=true');
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!memoryVerse) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-500">Unable to load today's verse. Please try again.</p>
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
              <Heart className="w-6 h-6 text-rose-500" />
              Word to Heart
            </h1>
            <p className="text-gray-600">Memorize Scripture, hide it in your heart</p>
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
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-4">
              Today's Memory Verse
            </span>
            <p className="text-lg text-brand-600 font-medium mb-2">
              {memoryVerse.reference}
            </p>
          </div>

          {/* Verse Display */}
          <div
            className={`relative p-8 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 mb-6 transition-all ${
              !showVerse && currentStep >= 2 ? 'blur-sm' : ''
            }`}
          >
            <BookOpen className="w-8 h-8 text-rose-300 absolute top-4 right-4" />
            <p className="text-2xl font-serif text-gray-800 leading-relaxed text-center">
              "{memoryVerse.text}"
            </p>
            <p className="text-sm text-gray-500 text-center mt-4">
              — {memoryVerse.reference} ({memoryVerse.translation})
            </p>
          </div>

          {/* Step Instructions */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Step {currentStep + 1}: {steps[currentStep].name}
            </h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>

            {currentStep >= 2 && (
              <button
                onClick={() => setShowVerse(!showVerse)}
                className="mt-4 inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
              >
                <RefreshCw className="w-4 h-4" />
                {showVerse ? 'Hide verse to practice' : 'Show verse'}
              </button>
            )}
          </div>

          {/* Audio Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <Volume2 className="w-5 h-5" />
            Listen to verse
          </button>
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

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Compass,
  Clock,
  BookOpen,
  Heart,
  Lightbulb,
  Check,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface DevotionalStep {
  id: string;
  title: string;
  type: 'scripture' | 'reflection' | 'prayer' | 'application';
  content: string;
  prompt?: string;
  duration?: number;
}

interface GuidedDevotional {
  id: string;
  title: string;
  theme: string;
  scripture: {
    reference: string;
    text: string;
  };
  steps: DevotionalStep[];
}

const DEFAULT_DEVOTIONAL: GuidedDevotional = {
  id: 'default-1',
  title: "God's Presence",
  theme: 'Finding Peace in His Presence',
  scripture: {
    reference: 'Psalm 46:10',
    text: '"Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."',
  },
  steps: [
    {
      id: 'prepare',
      title: 'Prepare Your Heart',
      type: 'prayer',
      content: 'Take a moment to quiet your mind. Take a few deep breaths and invite God into this time with you.',
      prompt: 'Lord, help me to be fully present with You in this moment...',
      duration: 2,
    },
    {
      id: 'read',
      title: 'Read the Scripture',
      type: 'scripture',
      content: 'Read the passage slowly, perhaps 2-3 times. Let the words sink in.',
      duration: 3,
    },
    {
      id: 'reflect',
      title: 'Reflect & Meditate',
      type: 'reflection',
      content: 'Consider what it means to "be still" in today\'s busy world. What does it mean to truly know that God is God?',
      prompt: 'What is God speaking to you through this passage?',
      duration: 5,
    },
    {
      id: 'apply',
      title: 'Application',
      type: 'application',
      content: 'How can you practice stillness before God today? What situation in your life needs you to trust that God is in control?',
      prompt: 'One specific way I will apply this today...',
      duration: 3,
    },
    {
      id: 'pray',
      title: 'Closing Prayer',
      type: 'prayer',
      content: 'Close your time by talking to God about what you\'ve learned and asking for His help to apply it.',
      prompt: 'Father, as I go into my day, help me to...',
      duration: 2,
    },
  ],
};

const stepIcons: Record<string, React.ElementType> = {
  scripture: BookOpen,
  reflection: Lightbulb,
  prayer: Heart,
  application: Check,
};

export default function GuidedQTPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devotional, setDevotional] = useState<GuidedDevotional>(DEFAULT_DEVOTIONAL);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResponses, setStepResponses] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [saving, setSaving] = useState(false);

  const currentStep = devotional.steps[currentStepIndex];
  const isLastStep = currentStepIndex === devotional.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const progress = ((currentStepIndex + 1) / devotional.steps.length) * 100;

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    setLoading(true);
    try {
      // Try to fetch daily reading from API
      const response = await api.quietTime.getDailyReading();
      if (response.data) {
        const reading = response.data;
        // Convert verses array to text
        const scriptureText = reading.verses
          .map((v) => `${v.num}. ${v.text}`)
          .join(' ');
        // Build reflection content from questions
        const reflectionContent = reading.reflectionQuestions?.length
          ? reading.reflectionQuestions.join('\n\n')
          : 'Take time to think about what this passage means and how it applies to your life.';

        setDevotional({
          id: 'daily-' + Date.now(),
          title: reading.title || 'Daily Devotional',
          theme: reading.title || 'Spending Time with God',
          scripture: {
            reference: reading.reference,
            text: scriptureText,
          },
          steps: [
            {
              id: 'prepare',
              title: 'Prepare Your Heart',
              type: 'prayer',
              content: 'Take a moment to quiet your mind and invite God into this time.',
              prompt: 'Lord, open my heart to receive Your Word today...',
              duration: 2,
            },
            {
              id: 'read',
              title: 'Read the Scripture',
              type: 'scripture',
              content: `Read ${reading.reference} slowly and thoughtfully.`,
              duration: 3,
            },
            {
              id: 'reflect',
              title: 'Reflect & Meditate',
              type: 'reflection',
              content: reflectionContent,
              prompt: 'What is God speaking to you through this passage?',
              duration: 5,
            },
            {
              id: 'apply',
              title: 'Application',
              type: 'application',
              content: 'Consider how you can live out this truth today. What specific action can you take?',
              prompt: 'One way I will apply this truth today...',
              duration: 3,
            },
            {
              id: 'pray',
              title: 'Closing Prayer',
              type: 'prayer',
              content: 'Close by talking to God about what you\'ve learned.',
              prompt: 'Lord, thank You for this time. Help me to...',
              duration: 2,
            },
          ],
        });
      }
    } catch (error) {
      console.warn('Failed to load devotional, using default:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepResponse = (text: string) => {
    setStepResponses(prev => ({
      ...prev,
      [currentStep.id]: text,
    }));
  };

  const markStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
  };

  const goToNextStep = () => {
    markStepComplete();
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const completeDevotional = async () => {
    markStepComplete();
    setSaving(true);

    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    try {
      // Save session via API
      await api.quietTime.createSession({
        type: 'word_to_life', // Guided QT mapped to word_to_life
        durationSeconds: timeSpentSeconds,
        verseReference: devotional.scripture.reference,
      });
    } catch (error) {
      console.warn('Failed to save session:', error);
    } finally {
      setSaving(false);
      router.push('/quiet-time?completed=true');
    }
  };

  const StepIcon = stepIcons[currentStep?.type] || Compass;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

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
              <Compass className="w-6 h-6 text-blue-500" />
              Guided QT
            </h1>
            <p className="text-gray-600">{devotional.theme}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {devotional.steps.length}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{currentStep.duration} min
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {devotional.steps.map((step, index) => {
            const Icon = stepIcons[step.type] || Compass;
            const isActive = index === currentStepIndex;
            const isCompleted = completedSteps.has(step.id);
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <StepIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentStep.title}</h2>
              <p className="text-sm text-gray-500 capitalize">{currentStep.type}</p>
            </div>
          </div>

          {/* Scripture Display */}
          {currentStep.type === 'scripture' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <p className="font-semibold text-amber-800 mb-2">
                {devotional.scripture.reference}
              </p>
              <p className="text-lg leading-relaxed text-amber-900 italic">
                {devotional.scripture.text}
              </p>
            </div>
          )}

          <p className="text-gray-700 leading-relaxed mb-6">{currentStep.content}</p>

          {/* Response Input */}
          {currentStep.prompt && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {currentStep.prompt}
              </label>
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Write your thoughts here..."
                value={stepResponses[currentStep.id] || ''}
                onChange={(e) => handleStepResponse(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {!isFirstStep && (
            <button
              onClick={goToPreviousStep}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
          )}

          {isLastStep ? (
            <button
              onClick={completeDevotional}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Complete
            </button>
          ) : (
            <button
              onClick={goToNextStep}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
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

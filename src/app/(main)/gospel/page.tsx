'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Heart,
  Cross,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  ArrowRight,
  Sparkles,
  HandHeart,
  Users,
  MessageSquare,
  Gift,
  Sun,
} from 'lucide-react';
import { clsx } from 'clsx';

// Gospel presentation steps
interface GospelStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: string[];
  verse: {
    reference: string;
    text: string;
  };
  color: string;
}

const GOSPEL_STEPS: GospelStep[] = [
  {
    id: 1,
    title: "God's Love",
    subtitle: 'God loves you and has a wonderful plan for your life',
    icon: Heart,
    content: [
      'God created you in His image and loves you unconditionally.',
      'He desires a personal relationship with you.',
      'God\'s plan for your life is filled with purpose, hope, and eternal significance.',
    ],
    verse: {
      reference: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Our Problem',
    subtitle: 'Sin separates us from God',
    icon: Cross,
    content: [
      'All people have sinned and fallen short of God\'s perfect standard.',
      'Sin creates a barrier between us and a holy God.',
      'The consequence of sin is spiritual death - eternal separation from God.',
      'We cannot earn our way to heaven through good works.',
    ],
    verse: {
      reference: 'Romans 3:23',
      text: 'For all have sinned and fall short of the glory of God.',
    },
    color: 'from-gray-600 to-gray-700',
  },
  {
    id: 3,
    title: "God's Solution",
    subtitle: 'Jesus Christ is the only way to God',
    icon: Gift,
    content: [
      'Jesus Christ, God\'s Son, lived a perfect, sinless life.',
      'He died on the cross to pay the penalty for our sins.',
      'He rose from the dead, proving He is God and has power over death.',
      'Jesus bridges the gap between sinful humanity and holy God.',
    ],
    verse: {
      reference: 'Romans 5:8',
      text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.',
    },
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 4,
    title: 'Our Response',
    subtitle: 'We must personally receive Jesus Christ',
    icon: HandHeart,
    content: [
      'Salvation is a free gift - we cannot earn it.',
      'We receive Jesus by faith, trusting in Him alone for salvation.',
      'This involves turning from sin (repentance) and trusting in Christ.',
      'When we receive Christ, we become children of God.',
    ],
    verse: {
      reference: 'Ephesians 2:8-9',
      text: 'For it is by grace you have been saved, through faith - and this is not from yourselves, it is the gift of God - not by works, so that no one can boast.',
    },
    color: 'from-brand-500 to-teal-500',
  },
];

const NEXT_STEPS = [
  {
    icon: BookOpen,
    title: 'Read the Bible',
    description: 'Start with the Gospel of John to learn more about Jesus',
    link: '/bible?book=John',
  },
  {
    icon: MessageSquare,
    title: 'Pray Daily',
    description: 'Talk to God through prayer - He is always listening',
    link: '/prayer',
  },
  {
    icon: Users,
    title: 'Find Community',
    description: 'Connect with other believers for encouragement and growth',
    link: '/community',
  },
  {
    icon: Sun,
    title: 'Start Quiet Time',
    description: 'Begin a daily practice of meeting with God',
    link: '/quiet-time',
  },
];

function StepCard({ step, isActive, onClick }: {
  step: GospelStep;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-4 p-4 rounded-xl border text-left transition-all w-full',
        isActive
          ? 'border-brand-300 bg-brand-50 ring-2 ring-brand-100'
          : 'border-gray-200 bg-white hover:border-brand-200 hover:bg-gray-50'
      )}
    >
      <div className={clsx(
        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
        isActive ? `bg-gradient-to-br ${step.color} text-white` : 'bg-gray-100 text-gray-500'
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={clsx(
          'font-semibold',
          isActive ? 'text-brand-700' : 'text-gray-900'
        )}>
          Step {step.id}: {step.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{step.subtitle}</p>
      </div>
      <ChevronRight className={clsx(
        'w-5 h-5 flex-shrink-0',
        isActive ? 'text-brand-500' : 'text-gray-300'
      )} />
    </button>
  );
}

export default function GospelPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrayer, setShowPrayer] = useState(false);
  const [prayedPrayer, setPrayedPrayer] = useState(false);

  const step = GOSPEL_STEPS[currentStep];
  const Icon = step.icon;

  const goToNext = () => {
    if (currentStep < GOSPEL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPrayer(true);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (prayedPrayer) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Celebration Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-400 to-teal-500 rounded-full mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to God&apos;s Family!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              If you prayed that prayer sincerely, you have begun a new life with Jesus Christ.
              The angels in heaven are rejoicing over your decision!
            </p>
          </div>

          {/* What Just Happened */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              What Just Happened?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Your sins are forgiven</p>
                  <p className="text-gray-600">God has wiped your slate clean (1 John 1:9)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">You became a child of God</p>
                  <p className="text-gray-600">You are now part of God&apos;s family (John 1:12)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">You received eternal life</p>
                  <p className="text-gray-600">You have the promise of heaven (John 5:24)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">The Holy Spirit lives in you</p>
                  <p className="text-gray-600">God&apos;s Spirit will guide and help you (Romans 8:9)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NEXT_STEPS.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.link}
                    className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all group"
                  >
                    <div className="p-3 bg-brand-100 rounded-xl group-hover:bg-brand-200 transition-colors">
                      <ItemIcon className="w-6 h-6 text-brand-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors self-center" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Share Your Decision */}
          <div className="bg-gradient-to-br from-brand-500 to-teal-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Share Your Decision</h2>
            <p className="text-brand-100 mb-6">
              Your testimony can encourage others! Consider sharing your decision with friends and family.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/community/testimonies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Share Your Testimony
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors border border-brand-400"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (showPrayer) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-400 to-teal-500 rounded-full mb-4">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Prayer of Salvation</h1>
            <p className="text-gray-600 mt-2">
              If you would like to receive Jesus Christ as your Lord and Savior, pray this prayer from your heart
            </p>
          </div>

          {/* Prayer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-xl p-8 border border-brand-100">
              <p className="text-lg text-gray-800 leading-relaxed italic">
                &ldquo;Dear God,
                <br /><br />
                I know that I am a sinner and that I need Your forgiveness. I believe that Jesus Christ died on the cross for my sins and rose again from the dead.
                <br /><br />
                I turn from my sins and I invite You, Jesus, to come into my heart and life. I want to trust and follow You as my Lord and Savior.
                <br /><br />
                Thank You for forgiving me and giving me eternal life. Help me to live for You from this day forward.
                <br /><br />
                In Jesus&apos; name I pray, Amen.&rdquo;
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                Did you pray this prayer sincerely, believing in your heart?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setPrayedPrayer(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Yes, I Prayed This Prayer
                </button>
                <button
                  onClick={() => setShowPrayer(false)}
                  className="inline-flex items-center gap-2 px-6 py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              If you are not ready to make this decision, that is okay.
              Take your time to learn more about God&apos;s love for you.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">The Good News</h1>
          <p className="text-gray-600 mt-2">
            Discover God&apos;s plan for your life and how you can have a personal relationship with Him
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Step Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Gospel Overview</h2>
              <div className="space-y-2">
                {GOSPEL_STEPS.map((s, index) => (
                  <StepCard
                    key={s.id}
                    step={s}
                    isActive={currentStep === index}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Step Header */}
              <div className={clsx('p-8 bg-gradient-to-br text-white', step.color)}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Step {step.id} of {GOSPEL_STEPS.length}</p>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                    <p className="text-white/90 mt-1">{step.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {step.content.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-700 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>

                {/* Scripture */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                    <span className="font-semibold text-brand-700">{step.verse.reference}</span>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    &ldquo;{step.verse.text}&rdquo;
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={goToPrev}
                  disabled={currentStep === 0}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
                    currentStep === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {/* Progress indicators */}
                <div className="flex items-center gap-2">
                  {GOSPEL_STEPS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={clsx(
                        'w-2.5 h-2.5 rounded-full transition-colors',
                        currentStep === index ? 'bg-brand-500' : 'bg-gray-300 hover:bg-gray-400'
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                >
                  {currentStep === GOSPEL_STEPS.length - 1 ? 'Receive Christ' : 'Next'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-gradient-to-br from-brand-50 to-teal-50 rounded-xl p-6 border border-brand-100">
              <h3 className="font-semibold text-gray-900 mb-2">Have Questions?</h3>
              <p className="text-gray-600 mb-4">
                We are here to help you on your spiritual journey. Feel free to reach out with any questions.
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700"
              >
                Get Help
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  CirclePlay,
  Trophy,
  Heart,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

// Type definitions
interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'reflection';
  content?: LessonContent;
}

interface LessonContent {
  videoUrl?: string;
  text?: string;
  sections?: ContentSection[];
  questions?: QuizQuestion[];
  reflectionPrompts?: string[];
  scriptures?: ScriptureReference[];
}

interface ContentSection {
  title: string;
  body: string;
  scripture?: ScriptureReference;
}

interface ScriptureReference {
  reference: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface StudyNavigation {
  studyTitle: string;
  currentLessonIndex: number;
  totalLessons: number;
  prevLesson?: { id: string; title: string };
  nextLesson?: { id: string; title: string };
}

// Mock lesson content
const MOCK_LESSON: Lesson = {
  id: 'l3',
  title: 'Understanding the Trinity',
  description: 'The Father, Son, and Holy Spirit - one God in three persons.',
  durationMinutes: 25,
  order: 3,
  isCompleted: false,
  isLocked: false,
  type: 'video',
  content: {
    videoUrl: 'https://example.com/video.mp4',
    sections: [
      {
        title: 'The Mystery of the Trinity',
        body: 'The Trinity is one of the most profound mysteries of the Christian faith. While the word "Trinity" does not appear in the Bible, the concept is clearly taught throughout Scripture. The Trinity describes one God who exists eternally in three distinct persons: the Father, the Son (Jesus Christ), and the Holy Spirit. Each person is fully God, yet there is only one God.\n\nThis is not a contradiction but a mystery that reveals the depth and richness of God\'s nature. Just as light can be experienced as illumination, warmth, and energy while remaining one phenomenon, God reveals Himself in three persons while remaining one God.',
        scripture: {
          reference: 'Matthew 28:19',
          text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
        },
      },
      {
        title: 'God the Father',
        body: 'God the Father is the first person of the Trinity. He is the creator of all things, the source of all life, and the one who sent His Son to save the world. The Father is characterized by His perfect love, holiness, and justice.\n\nJesus taught us to approach God as our Father, inviting us into an intimate relationship with the Creator of the universe. This does not diminish God\'s majesty but reveals His desire to be known and loved by His children.',
        scripture: {
          reference: 'John 3:16',
          text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
        },
      },
      {
        title: 'God the Son',
        body: 'Jesus Christ, the Son of God, is the second person of the Trinity. He is fully God and fully human, having taken on human nature through His incarnation. Jesus is the visible image of the invisible God, and through Him, we can know and understand the Father.\n\nJesus lived a perfect life, died on the cross for our sins, and rose again on the third day. He now sits at the right hand of the Father, interceding for us.',
        scripture: {
          reference: 'Colossians 1:15-16',
          text: 'He is the image of the invisible God, the firstborn of all creation. For by him all things were created, in heaven and on earth.',
        },
      },
      {
        title: 'God the Holy Spirit',
        body: 'The Holy Spirit is the third person of the Trinity. He is the presence of God dwelling within believers, guiding, empowering, and transforming us to be more like Christ. The Spirit convicts us of sin, illuminates Scripture, and produces spiritual fruit in our lives.\n\nPentecost marked the beginning of the Spirit\'s indwelling of all believers, making it possible for us to live the Christian life.',
        scripture: {
          reference: 'John 14:26',
          text: 'But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things and bring to your remembrance all that I have said to you.',
        },
      },
    ],
    reflectionPrompts: [
      'How does understanding the Trinity change the way you view God?',
      'Which person of the Trinity do you relate to most easily? Why?',
      'How can you grow in your relationship with each person of the Trinity this week?',
    ],
  },
};

const MOCK_NAVIGATION: StudyNavigation = {
  studyTitle: 'Foundations of Faith',
  currentLessonIndex: 3,
  totalLessons: 12,
  prevLesson: { id: 'l2', title: 'Who is God?' },
  nextLesson: { id: 'l4', title: 'The Bible: God\'s Word' },
};

function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
      {/* Placeholder for video - in production, use a proper video player */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800">
        <div className="text-center text-white">
          <CirclePlay className="w-20 h-20 mx-auto mb-4 opacity-50" />
          <p className="text-sm opacity-75">Video Player Placeholder</p>
          <p className="text-xs opacity-50 mt-1">{videoUrl}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer">
          <div
            className="h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-400 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-white text-sm">0:00 / 25:00</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-400 transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-400 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingContent({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{section.body}</div>
          {section.scripture && (
            <blockquote className="mt-4 p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg">
              <p className="text-gray-800 italic">&quot;{section.scripture.text}&quot;</p>
              <cite className="text-brand-700 font-medium">- {section.scripture.reference}</cite>
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}

function ReflectionSection({ prompts, onComplete }: { prompts: string[]; onComplete: () => void }) {
  const [answers, setAnswers] = useState<string[]>(prompts.map(() => ''));
  const [currentPrompt, setCurrentPrompt] = useState(0);

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900">Reflection Questions</h3>
          <p className="text-sm text-amber-700">Take time to think and respond</p>
        </div>
      </div>

      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div key={index} className={clsx(index !== currentPrompt && 'hidden')}>
            <p className="font-medium text-gray-900 mb-3">{prompt}</p>
            <textarea
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder="Write your thoughts here..."
              className="w-full p-4 rounded-xl border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none resize-none bg-white"
              rows={4}
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {prompts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPrompt(index)}
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  index === currentPrompt
                    ? 'bg-amber-500 text-white'
                    : answers[index]
                      ? 'bg-amber-200 text-amber-700'
                      : 'bg-amber-100 text-amber-600'
                )}
              >
                {answers[index] ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {currentPrompt > 0 && (
              <button
                onClick={() => setCurrentPrompt(currentPrompt - 1)}
                className="px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Previous
              </button>
            )}
            {currentPrompt < prompts.length - 1 ? (
              <button
                onClick={() => setCurrentPrompt(currentPrompt + 1)}
                className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onComplete}
                disabled={!allAnswered}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Save Reflections
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonSidebar({
  navigation,
  studyId,
  currentLessonId,
  onClose,
}: {
  navigation: StudyNavigation;
  studyId: string;
  currentLessonId: string;
  onClose: () => void;
}) {
  // Mock lesson list
  const lessons = [
    { id: 'l1', title: 'Introduction: Beginning Your Journey', completed: true },
    { id: 'l2', title: 'Who is God?', completed: true },
    { id: 'l3', title: 'Understanding the Trinity', completed: false },
    { id: 'l4', title: "The Bible: God's Word", completed: false },
    { id: 'l5', title: 'Quiz: Foundations Part 1', completed: false },
    { id: 'l6', title: 'Sin and Salvation', completed: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Lessons</h3>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/studies/${studyId}/lessons/${lesson.id}`}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-lg transition-colors',
              lesson.id === currentLessonId
                ? 'bg-brand-50 border border-brand-200'
                : 'hover:bg-gray-50'
            )}
          >
            <div
              className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                lesson.completed
                  ? 'bg-green-100'
                  : lesson.id === currentLessonId
                    ? 'bg-brand-100'
                    : 'bg-gray-100'
              )}
            >
              {lesson.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <span
                  className={clsx(
                    'text-xs font-medium',
                    lesson.id === currentLessonId ? 'text-brand-600' : 'text-gray-500'
                  )}
                >
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={clsx(
                'text-sm truncate',
                lesson.id === currentLessonId ? 'font-medium text-brand-700' : 'text-gray-700'
              )}
            >
              {lesson.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const studyId = params.id as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<StudyNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  async function fetchLesson() {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLesson(MOCK_LESSON);
      setNavigation(MOCK_NAVIGATION);
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
    }
    setLoading(false);
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to next lesson or back to study
      if (navigation?.nextLesson) {
        router.push(`/studies/${studyId}/lessons/${navigation.nextLesson.id}`);
      } else {
        router.push(`/studies/${studyId}`);
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
    setCompleting(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson || !navigation) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h2>
          <Link href={`/studies/${studyId}`} className="text-brand-600 font-medium hover:text-brand-700">
            Back to study
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const typeIcons = {
    video: CirclePlay,
    reading: BookOpen,
    quiz: Trophy,
    reflection: Heart,
  };
  const TypeIcon = typeIcons[lesson.type];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/studies/${studyId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{navigation.studyTitle}</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Lesson {navigation.currentLessonIndex} of {navigation.totalLessons}
            </span>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Lesson Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full capitalize flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" />
                  {lesson.type}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {lesson.durationMinutes} min
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600">{lesson.description}</p>
            </div>

            {/* Content based on type */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              {lesson.type === 'video' && lesson.content?.videoUrl && (
                <div className="mb-6">
                  <VideoPlayer videoUrl={lesson.content.videoUrl} />
                </div>
              )}

              {lesson.content?.sections && <ReadingContent sections={lesson.content.sections} />}
            </div>

            {/* Reflection Section */}
            {lesson.content?.reflectionPrompts && (
              <ReflectionSection prompts={lesson.content.reflectionPrompts} onComplete={handleComplete} />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {navigation.prevLesson ? (
                <Link
                  href={`/studies/${studyId}/lessons/${navigation.prevLesson.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Previous</p>
                    <p className="font-medium truncate max-w-[150px] sm:max-w-[250px]">
                      {navigation.prevLesson.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-70 transition-colors"
              >
                {completing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : lesson.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
                {completing
                  ? 'Saving...'
                  : lesson.isCompleted
                    ? 'Completed'
                    : navigation.nextLesson
                      ? 'Complete & Continue'
                      : 'Complete Lesson'}
              </button>

              {navigation.nextLesson ? (
                <Link
                  href={`/studies/${studyId}/lessons/${navigation.nextLesson.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Next</p>
                    <p className="font-medium truncate max-w-[150px] sm:max-w-[250px]">
                      {navigation.nextLesson.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <LessonSidebar
                navigation={navigation}
                studyId={studyId}
                currentLessonId={lessonId}
                onClose={() => setShowSidebar(false)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 p-4 overflow-y-auto">
              <LessonSidebar
                navigation={navigation}
                studyId={studyId}
                currentLessonId={lessonId}
                onClose={() => setShowSidebar(false)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

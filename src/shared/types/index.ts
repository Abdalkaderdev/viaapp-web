// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  churchId?: string;
  churchName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'student' | 'pastor' | 'church' | 'admin' | 'super_admin';

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  churchName?: string;
}

// Quiet Time types
export interface QuietTimeSession {
  id: string;
  userId: string;
  type: 'word_to_life' | 'word_to_heart';
  durationSeconds: number;
  verseReference?: string;
  reflectionNotes?: string;
  aiQuestions?: string[];
  userAnswers?: string[];
  completedAt: string;
  createdAt: string;
}

// Memory Verse types
export interface MemoryVerse {
  id: string;
  userId: string;
  verseId: string;
  reference: string;
  text?: string;
  masteryLevel: 'learning' | 'reviewing' | 'mastered';
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  createdAt: string;
}

// Prayer types
export interface PrayerRequest {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: PrayerCategory;
  visibility: 'private' | 'partner' | 'church' | 'public';
  status: 'active' | 'answered' | 'archived';
  isAnonymous: boolean;
  prayerCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PrayerCategory =
  | 'personal'
  | 'family'
  | 'health'
  | 'work'
  | 'spiritual'
  | 'relationships'
  | 'world'
  | 'other';

// Bible types
export interface BibleVerse {
  id: string;
  bookId: string;
  translationId: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  order: number;
  testament: 'old' | 'new';
  chapterCount: number;
}

export interface BibleTranslation {
  id: string;
  code: string;
  name: string;
  description?: string;
  language: string;
  isActive: boolean;
}

// Reading Plan types
export interface ReadingPlan {
  id: string;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationDays: number;
  versesPerDay: number;
  translationId?: string;
  isActive: boolean;
}

export interface UserReadingProgress {
  id: string;
  userId: string;
  planId: string;
  currentDay: number;
  startedAt: string;
  completedAt?: string;
  isActive: boolean;
}

// Church types
export interface Study {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  estimatedMinutes: number;
  enrolledCount: number;
  rating: number;
  imageUrl?: string;
  author?: string;
  authorBio?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  whatYouWillLearn?: string[];
  requirements?: string[];
  lessons: StudyLesson[];
}

export interface StudyLesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'reflection';
}

export interface EnrolledStudy {
  id: string;
  studyId: string;
  progress: number;
  study?: Study;
}

export interface UserStudyProgress {
  id: string;
  userId: string;
  studyId: string;
  lessonId: string;
  completedAt: string;
}

export interface Church {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  logoUrl?: string;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
}

export interface ChurchMember {
  id: string;
  userId: string;
  churchId: string;
  role: 'member' | 'leader' | 'pastor' | 'admin';
  serviceDay?: string;
  joinedAt: string;
}

export interface ChurchCheckIn {
  id: string;
  userId: string;
  churchId: string;
  checkedInAt: string;
}

export interface UserChurch extends Church {
  serviceDay?: string;
}

// Partnership types
export interface DisciplePartnership {
  id: string;
  userId: string;
  partnerId: string;
  status: 'pending' | 'active' | 'ended';
  createdAt: string;
  partner?: User;
  requester?: User;
}

export interface PartnershipRecommendation {
  id: string;
  name: string;
  email?: string;
  church?: string;
  streak: number;
  avatarUrl?: string;
}

export interface PartnershipStats {
  streak: number;
  qtSessions: number;
  prayersShared: number;
}

export interface PartnershipMessage {
  id: string;
  partnershipId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

// Stats types
export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalVersesMemorized: number;
  totalReadingTimeSeconds: number;
  monthlyQuietTimeCount: number;
  readingPlansStarted?: number;
  totalPrayers?: number;
  lastActivityAt?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
}

export type NotificationType =
  | 'quiet_time_reminder'
  | 'streak_milestone'
  | 'prayer_answered'
  | 'partner_message'
  | 'church_announcement'
  | 'system';

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

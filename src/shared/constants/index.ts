// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.viaapp.com/api';

// App Configuration
export const APP_NAME = 'ViaApp';
export const APP_DESCRIPTION = 'Grow in Faith Together';

// Prayer Categories
export const PRAYER_CATEGORIES = [
  { value: 'personal', label: 'Personal' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work/Career' },
  { value: 'spiritual', label: 'Spiritual Growth' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'world', label: 'World/Community' },
  { value: 'other', label: 'Other' },
] as const;

// Quiet Time Types
export const QUIET_TIME_TYPES = [
  {
    value: 'word_to_life',
    label: 'Word to Life',
    description: 'Apply Scripture to your daily life through reflection'
  },
  {
    value: 'word_to_heart',
    label: 'Word to Heart',
    description: 'Memorize and meditate on Scripture'
  },
] as const;

// Memory Verse Mastery Levels
export const MASTERY_LEVELS = [
  { value: 'learning', label: 'Learning', color: '#f59e0b' },
  { value: 'reviewing', label: 'Reviewing', color: '#3b82f6' },
  { value: 'mastered', label: 'Mastered', color: '#10b981' },
] as const;

// User Roles
export const USER_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'student', label: 'Student' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'church', label: 'Church Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
] as const;

// Reading Plan Difficulties
export const READING_DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', description: 'New to Bible reading' },
  { value: 'intermediate', label: 'Intermediate', description: 'Regular reader' },
  { value: 'advanced', label: 'Advanced', description: 'Deep study' },
] as const;

// Theme Colors (matching the app)
export const THEME_COLORS = {
  primary: '#0d9488', // teal-600
  primaryLight: '#14b8a6', // teal-500
  primaryDark: '#0f766e', // teal-700
  secondary: '#f59e0b', // amber-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
} as const;

// Streak Milestones
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'viaapp.accessToken',
  REFRESH_TOKEN: 'viaapp.refreshToken',
  USER: 'viaapp.user',
  THEME: 'viaapp.theme',
  LAST_SYNC: 'viaapp.lastSync',
} as const;

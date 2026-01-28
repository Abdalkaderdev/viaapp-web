/**
 * Simple client-side cache for semi-static data like Bible books and translations.
 * Uses localStorage with TTL (time-to-live) support.
 */

const CACHE_PREFIX = 'viaapp_cache_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Get cached data if it exists and hasn't expired
 */
export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const now = Date.now();

    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    // If parsing fails, remove corrupt data
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
}

/**
 * Set cached data with optional TTL
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    // localStorage might be full or disabled
    console.warn('Failed to cache data:', error);
  }
}

/**
 * Remove cached data
 */
export function removeCache(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CACHE_PREFIX + key);
}

/**
 * Clear all cached data for this app
 */
export function clearAllCache(): void {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Cache keys for the app
 */
export const CACHE_KEYS = {
  BIBLE_BOOKS: 'bible_books',
  BIBLE_TRANSLATIONS: 'bible_translations',
  READING_PLANS: 'reading_plans',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Helper to fetch with cache - first checks cache, then fetches and caches if needed
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  // Try cache first
  const cached = getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result
  setCache(key, data, ttl);

  return data;
}

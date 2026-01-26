import { createApiClient, STORAGE_KEYS } from '@shared/index';

/**
 * SECURITY: Secure Token Management
 * - Memory-first storage (not accessible to XSS in storage)
 * - sessionStorage fallback with obfuscation (cleared on tab close)
 * - CSRF token for state-changing requests
 * - Suspicious activity detection
 */
const tokenMemory: { accessToken: string | null; refreshToken: string | null } = {
  accessToken: null,
  refreshToken: null,
};

let csrfToken: string | null = null;
let failedRequestCount = 0;
const MAX_FAILED_REQUESTS = 3;
const FAILED_REQUEST_WINDOW = 60000; // 1 minute
let failedRequestResetTimer: ReturnType<typeof setTimeout> | null = null;

function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function getCsrfToken(): string {
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
  }
  return csrfToken;
}

function obfuscateToken(token: string): string {
  return btoa(token.split('').reverse().join(''));
}

function deobfuscateToken(obfuscated: string): string {
  try {
    return atob(obfuscated).split('').reverse().join('');
  } catch {
    return '';
  }
}

function clearTokensSync(): void {
  tokenMemory.accessToken = null;
  tokenMemory.refreshToken = null;
  csrfToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('viaapp-auth');
  }
}

function handleSuspiciousActivity(): void {
  clearTokensSync();
  if (typeof window !== 'undefined') {
    localStorage.setItem('viaapp-security-event', Date.now().toString());
    localStorage.removeItem('viaapp-security-event');
  }
}

export function trackFailedRequest(): void {
  failedRequestCount++;

  if (failedRequestResetTimer) {
    clearTimeout(failedRequestResetTimer);
  }

  failedRequestResetTimer = setTimeout(() => {
    failedRequestCount = 0;
  }, FAILED_REQUEST_WINDOW);

  if (failedRequestCount >= MAX_FAILED_REQUESTS) {
    console.warn('[Security] Suspicious activity detected - clearing tokens');
    handleSuspiciousActivity();
  }
}

// Listen for security events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'viaapp-security-event') {
      clearTokensSync();
    }
  });
}

// Token management for web with secure storage
async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // First check memory (preferred - not accessible to XSS in storage)
  if (tokenMemory.accessToken) {
    return tokenMemory.accessToken;
  }

  // Fallback to sessionStorage (cleared on tab close)
  const obfuscated = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (obfuscated) {
    const token = deobfuscateToken(obfuscated);
    if (token) {
      tokenMemory.accessToken = token;
      return token;
    }
  }

  return null;
}

async function getRefreshToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if (tokenMemory.refreshToken) {
    return tokenMemory.refreshToken;
  }

  const obfuscated = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (obfuscated) {
    const token = deobfuscateToken(obfuscated);
    if (token) {
      tokenMemory.refreshToken = token;
      return token;
    }
  }

  return null;
}

async function setTokens(access: string, refresh: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Store in memory first (primary)
  tokenMemory.accessToken = access;
  tokenMemory.refreshToken = refresh;

  // Also store obfuscated in sessionStorage as backup (tab-specific, cleared on close)
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, obfuscateToken(access));
  sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, obfuscateToken(refresh));

  // Generate new CSRF token on login
  csrfToken = generateCsrfToken();

  // Reset failed request counter on successful token set
  failedRequestCount = 0;
}

async function clearTokens(): Promise<void> {
  clearTokensSync();
}

// Create the API client with security enhancements
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.viaapp.com/api',
  getToken,
  setTokens,
  clearTokens,
  onUnauthorized: () => {
    trackFailedRequest();
  },
  getHeaders: () => ({
    'X-CSRF-Token': getCsrfToken(),
  }),
});

// Helper to attempt token refresh
export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const result = await api.auth.refresh(refreshToken);
    if (result.data) {
      failedRequestCount = 0;
      return true;
    }
    return false;
  } catch {
    trackFailedRequest();
    await clearTokens();
    return false;
  }
}

/**
 * Validate that the current session appears legitimate
 * Call this before sensitive operations
 */
export async function validateSession(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;
  if (failedRequestCount >= MAX_FAILED_REQUESTS) return false;
  return true;
}

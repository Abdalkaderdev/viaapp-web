import { createApiClient, STORAGE_KEYS } from '@viaapp/shared';

// Token management for web
async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

async function getRefreshToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

async function setTokens(access: string, refresh: string): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
}

async function clearTokens(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  // Also clear the persisted auth store
  localStorage.removeItem('viaapp-auth');
}

// Create the API client
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.viaapp.com/api',
  getToken,
  setTokens,
  clearTokens,
  // Don't auto-redirect on 401 - let components handle it
  onUnauthorized: undefined,
});

// Helper to attempt token refresh
export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const result = await api.auth.refresh(refreshToken);
    return !!result.data;
  } catch {
    await clearTokens();
    return false;
  }
}

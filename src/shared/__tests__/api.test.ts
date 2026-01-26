/**
 * Shared API Client Tests
 * Tests for the createApiClient function and API methods
 */

import { createApiClient } from '../api/index';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('createApiClient', () => {
  let apiClient: ReturnType<typeof createApiClient>;
  let mockGetToken: jest.Mock;
  let mockSetTokens: jest.Mock;
  let mockClearTokens: jest.Mock;
  let mockOnUnauthorized: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetToken = jest.fn().mockResolvedValue('test-token');
    mockSetTokens = jest.fn().mockResolvedValue(undefined);
    mockClearTokens = jest.fn().mockResolvedValue(undefined);
    mockOnUnauthorized = jest.fn();

    apiClient = createApiClient({
      baseUrl: 'http://test-api.com/api',
      getToken: mockGetToken,
      setTokens: mockSetTokens,
      clearTokens: mockClearTokens,
      onUnauthorized: mockOnUnauthorized,
    });
  });

  describe('Configuration', () => {
    it('should use provided base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.auth.me();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/auth/me',
        expect.any(Object)
      );
    });

    it('should include authorization header when token exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.auth.me();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should not include authorization header when no token', async () => {
      mockGetToken.mockResolvedValueOnce(null);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.auth.me();

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Handling', () => {
    it('should return data on successful response', async () => {
      const mockData = { id: '1', email: 'test@example.com' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiClient.auth.me();

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should return error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' }),
      });

      const result = await apiClient.auth.me();

      expect(result.error).toBe('Bad request');
      expect(result.data).toBeUndefined();
    });

    it('should return default error message when none provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      const result = await apiClient.auth.me();

      expect(result.error).toBe('Request failed');
    });

    it('should handle 401 unauthorized response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      });

      const result = await apiClient.auth.me();

      expect(result.error).toBe('Unauthorized');
      expect(mockClearTokens).toHaveBeenCalled();
      expect(mockOnUnauthorized).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.auth.me();

      expect(result.error).toBe('Network error');
    });

    it('should handle non-Error thrown values', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      const result = await apiClient.auth.me();

      expect(result.error).toBe('Network error');
    });
  });

  describe('Auth API', () => {
    it('should call login endpoint with credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            user: { id: '1', email: 'test@example.com' },
            accessToken: 'access',
            refreshToken: 'refresh',
          }),
      });

      await apiClient.auth.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });

    it('should store tokens on successful login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            user: { id: '1', email: 'test@example.com' },
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
          }),
      });

      await apiClient.auth.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockSetTokens).toHaveBeenCalledWith('new-access', 'new-refresh');
    });

    it('should not store tokens on failed login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      await apiClient.auth.login({
        email: 'test@example.com',
        password: 'wrong',
      });

      expect(mockSetTokens).not.toHaveBeenCalled();
    });

    it('should call register endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            user: { id: '1', email: 'new@example.com' },
            accessToken: 'access',
            refreshToken: 'refresh',
          }),
      });

      await apiClient.auth.register({
        email: 'new@example.com',
        password: 'password123',
        fullName: 'New User',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/auth/register',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should call logout and clear tokens', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.auth.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/auth/logout',
        expect.objectContaining({ method: 'POST' })
      );
      expect(mockClearTokens).toHaveBeenCalled();
    });
  });

  describe('User API', () => {
    it('should fetch user stats', async () => {
      const mockStats = { currentStreak: 5, totalSessions: 50 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockStats),
      });

      const result = await apiClient.user.getStats();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/progress/stats',
        expect.any(Object)
      );
      expect(result.data).toEqual(mockStats);
    });

    it('should update user profile', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ fullName: 'Updated Name' }),
      });

      await apiClient.user.updateProfile({ fullName: 'Updated Name' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/users/me',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ fullName: 'Updated Name' }),
        })
      );
    });
  });

  describe('Church API', () => {
    it('should search churches with query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });

      await apiClient.church.search('Community');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/churches/search?q=Community',
        expect.any(Object)
      );
    });

    it('should join church with service day', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.church.join('church-123', 'Sunday');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/churches/church-123/join',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ serviceDay: 'Sunday' }),
        })
      );
    });

    it('should join church without service day', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.church.join('church-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/churches/church-123/join',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('Partnership API', () => {
    it('should send partnership request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: '1', status: 'pending' }),
      });

      await apiClient.partnerships.sendRequest('partner-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/partnerships',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ partnerId: 'partner-123' }),
        })
      );
    });

    it('should accept partnership request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '1', status: 'active' }),
      });

      await apiClient.partnerships.acceptRequest('partnership-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/partnerships/partnership-123/accept',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should send partnership message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: '1', content: 'Hello!' }),
      });

      await apiClient.partnerships.sendMessage('partnership-123', 'Hello!');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/partnerships/partnership-123/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ content: 'Hello!' }),
        })
      );
    });
  });

  describe('Bible API', () => {
    it('should get verse by reference', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            reference: 'John 3:16',
            text: 'For God so loved the world...',
          }),
      });

      await apiClient.bible.getVerse('John 3:16');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/bible/verse/John%203%3A16',
        expect.any(Object)
      );
    });

    it('should get verse with translation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.bible.getVerse('John 3:16', 'ESV');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('translation=ESV'),
        expect.any(Object)
      );
    });

    it('should search verses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ results: [], count: 0 }),
      });

      await apiClient.bible.searchVerses('love', 'NIV');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/bible/search?q=love&translation=NIV'),
        expect.any(Object)
      );
    });
  });
});

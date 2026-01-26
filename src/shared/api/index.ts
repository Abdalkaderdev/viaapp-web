import { API_BASE_URL } from '../constants';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserStats,
  QuietTimeSession,
  MemoryVerse,
  PrayerRequest,
  BibleVerse,
  ReadingPlan,
  UserReadingProgress,
  Church,
  UserChurch,
  ChurchCheckIn,
  Notification,
  PaginatedResponse,
  DisciplePartnership,
  PartnershipRecommendation,
  PartnershipStats,
  PartnershipMessage,
} from '../types';

type TokenGetter = () => Promise<string | null>;
type TokenSetter = (access: string, refresh: string) => Promise<void>;
type TokenClearer = () => Promise<void>;

interface ApiClientConfig {
  baseUrl?: string;
  getToken: TokenGetter;
  setTokens: TokenSetter;
  clearTokens: TokenClearer;
  onUnauthorized?: () => void;
}

export function createApiClient(config: ApiClientConfig) {
  const baseUrl = config.baseUrl || API_BASE_URL;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await config.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        await config.clearTokens();
        config.onUnauthorized?.();
        return { error: 'Unauthorized' };
      }

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  return {
    // Auth
    auth: {
      async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        const result = await request<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        if (result.data) {
          await config.setTokens(result.data.accessToken, result.data.refreshToken);
        }
        return result;
      },

      async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        const result = await request<AuthResponse>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (result.data) {
          await config.setTokens(result.data.accessToken, result.data.refreshToken);
        }
        return result;
      },

      async me(): Promise<ApiResponse<User>> {
        return request<User>('/auth/me');
      },

      async logout(): Promise<void> {
        await request('/auth/logout', { method: 'POST' });
        await config.clearTokens();
      },

      async refresh(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
        const result = await request<AuthResponse>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
        if (result.data) {
          await config.setTokens(result.data.accessToken, result.data.refreshToken);
        }
        return result;
      },
    },

    // User
    user: {
      async getStats(): Promise<ApiResponse<UserStats>> {
        return request<UserStats>('/progress/stats');
      },

      async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        return request<User>('/users/me', {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      },
    },

    // Quiet Time
    quietTime: {
      async getSessions(params?: {
        page?: number;
        limit?: number;
      }): Promise<ApiResponse<PaginatedResponse<QuietTimeSession>>> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return request<PaginatedResponse<QuietTimeSession>>(`/progress/quiet-time?${query}`);
      },

      async createSession(data: {
        type: 'word_to_life' | 'word_to_heart';
        durationSeconds: number;
        verseReference?: string;
        reflectionNotes?: string;
      }): Promise<ApiResponse<QuietTimeSession>> {
        return request<QuietTimeSession>('/progress/quiet-time', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      async getDailyVerse(): Promise<ApiResponse<{ reference: string; text: string; translation: string }>> {
        return request<{ reference: string; text: string; translation: string }>('/content/daily-verse');
      },

      async getDailyReading(): Promise<ApiResponse<{
        reference: string;
        title: string;
        verses: { num: number; text: string }[];
        reflectionQuestions: string[];
        translation: string;
      }>> {
        return request<{
          reference: string;
          title: string;
          verses: { num: number; text: string }[];
          reflectionQuestions: string[];
          translation: string;
        }>('/content/daily-reading');
      },

      async getAIQuestions(passage: string, reference: string): Promise<ApiResponse<{ questions: string[]; reference: string }>> {
        return request<{ questions: string[]; reference: string }>('/ai/reflection', {
          method: 'POST',
          body: JSON.stringify({ passage, reference }),
        });
      },

      async getAIQuestionsFromReference(reference: string, context?: string): Promise<ApiResponse<{ questions: string[]; reference: string; passage: string }>> {
        return request<{ questions: string[]; reference: string; passage: string }>('/ai/reflection/from-reference', {
          method: 'POST',
          body: JSON.stringify({ reference, context }),
        });
      },
    },

    // Memory Verses
    memory: {
      async getVerses(): Promise<ApiResponse<MemoryVerse[]>> {
        return request<MemoryVerse[]>('/content/memory-verses');
      },

      async addVerse(data: {
        reference: string;
        text: string;
      }): Promise<ApiResponse<MemoryVerse>> {
        return request<MemoryVerse>('/content/memory-verses', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      async reviewVerse(
        id: string,
        correct: boolean
      ): Promise<ApiResponse<MemoryVerse>> {
        return request<MemoryVerse>(`/content/memory-verses/${id}/review`, {
          method: 'POST',
          body: JSON.stringify({ correct }),
        });
      },

      async deleteVerse(id: string): Promise<ApiResponse<void>> {
        return request<void>(`/content/memory-verses/${id}`, {
          method: 'DELETE',
        });
      },
    },

    // Prayer
    prayer: {
      async getRequests(params?: {
        status?: string;
        category?: string;
        page?: number;
        limit?: number;
      }): Promise<ApiResponse<PaginatedResponse<PrayerRequest>>> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return request<PaginatedResponse<PrayerRequest>>(`/prayers/my-requests?${query}`);
      },

      async createRequest(data: {
        title: string;
        description?: string;
        category: string;
        visibility: string;
        isAnonymous?: boolean;
      }): Promise<ApiResponse<PrayerRequest>> {
        return request<PrayerRequest>('/prayers', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      async updateRequest(
        id: string,
        data: Partial<PrayerRequest>
      ): Promise<ApiResponse<PrayerRequest>> {
        return request<PrayerRequest>(`/prayers/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      },

      async markAnswered(id: string): Promise<ApiResponse<PrayerRequest>> {
        return request<PrayerRequest>(`/prayers/${id}/answered`, {
          method: 'POST',
        });
      },

      async deleteRequest(id: string): Promise<ApiResponse<void>> {
        return request<void>(`/prayers/${id}`, {
          method: 'DELETE',
        });
      },
    },

    // Bible
    bible: {
      async getTranslations(): Promise<ApiResponse<{ id: string; code: string; name: string; language: string }[]>> {
        return request<{ id: string; code: string; name: string; language: string }[]>('/bible/translations');
      },

      async getBooks(): Promise<ApiResponse<{ id: string; name: string; abbreviation: string; order: number; testament: 'old' | 'new'; chapter_count: number }[]>> {
        return request<{ id: string; name: string; abbreviation: string; order: number; testament: 'old' | 'new'; chapter_count: number }[]>('/bible/books');
      },

      async getBooksByTestament(testament: 'old' | 'new'): Promise<ApiResponse<{ id: string; name: string; abbreviation: string; order: number; testament: 'old' | 'new'; chapter_count: number }[]>> {
        return request<{ id: string; name: string; abbreviation: string; order: number; testament: 'old' | 'new'; chapter_count: number }[]>(`/bible/books/testament/${testament}`);
      },

      async getChapter(bookId: string, chapter: number, translation?: string): Promise<ApiResponse<{
        book: { id: string; name: string; chapter_count: number };
        chapter: number;
        translation: { id: string; code: string; name: string };
        verses: BibleVerse[];
      }>> {
        const query = translation ? `?translation=${translation}` : '';
        return request<{
          book: { id: string; name: string; chapter_count: number };
          chapter: number;
          translation: { id: string; code: string; name: string };
          verses: BibleVerse[];
        }>(`/bible/books/${bookId}/chapters/${chapter}${query}`);
      },

      async getVerse(reference: string, translation?: string): Promise<ApiResponse<BibleVerse>> {
        const query = translation ? `?translation=${translation}` : '';
        return request<BibleVerse>(`/bible/verse/${encodeURIComponent(reference)}${query}`);
      },

      async searchVerses(query: string, translation?: string): Promise<ApiResponse<{ results: BibleVerse[]; count: number }>> {
        const params = new URLSearchParams({ q: query });
        if (translation) params.append('translation', translation);
        return request<{ results: BibleVerse[]; count: number }>(`/bible/search?${params}`);
      },
    },

    // Reading Plans
    readingPlans: {
      async getPlans(): Promise<ApiResponse<ReadingPlan[]>> {
        const response = await request<{ plans: ReadingPlan[] }>('/content/reading-plans');
        return {
          ...response,
          data: response.data?.plans || [],
        };
      },

      async getProgress(): Promise<ApiResponse<UserReadingProgress[]>> {
        return request<UserReadingProgress[]>('/progress/reading');
      },

      async startPlan(planId: string): Promise<ApiResponse<UserReadingProgress>> {
        return request<UserReadingProgress>(`/progress/reading/${planId}/start`, {
          method: 'POST',
        });
      },

      async completeDay(progressId: string): Promise<ApiResponse<UserReadingProgress>> {
        return request<UserReadingProgress>(`/progress/reading/${progressId}/complete-day`, {
          method: 'POST',
        });
      },
    },

    // Church
    church: {
      async search(query: string): Promise<ApiResponse<Church[]>> {
        return request<Church[]>(`/churches/search?q=${encodeURIComponent(query)}`);
      },

      async getApproved(): Promise<ApiResponse<{ churches: Church[]; count: number }>> {
        return request<{ churches: Church[]; count: number }>('/churches/approved');
      },

      async join(churchId: string, serviceDay?: string): Promise<ApiResponse<void>> {
        return request<void>(`/churches/${churchId}/join`, {
          method: 'POST',
          body: serviceDay ? JSON.stringify({ serviceDay }) : undefined,
        });
      },

      async leave(churchId: string): Promise<ApiResponse<void>> {
        return request<void>(`/churches/${churchId}/leave`, {
          method: 'DELETE',
        });
      },

      async getMyChurch(): Promise<ApiResponse<UserChurch>> {
        return request<UserChurch>('/churches/me');
      },

      async getUserChurch(): Promise<ApiResponse<UserChurch>> {
        return request<UserChurch>('/churches/me');
      },

      async checkIn(churchId: string): Promise<ApiResponse<ChurchCheckIn>> {
        return request<ChurchCheckIn>(`/churches/${churchId}/check-in`, {
          method: 'POST',
        });
      },

      async getCheckIns(churchId: string): Promise<ApiResponse<ChurchCheckIn[]>> {
        return request<ChurchCheckIn[]>(`/churches/${churchId}/check-ins`);
      },

      async getMembers(churchId: string): Promise<ApiResponse<{ id: string; userId: string; role: string; user?: User }[]>> {
        return request<{ id: string; userId: string; role: string; user?: User }[]>(`/churches/${churchId}/members`);
      },

      async getEvents(churchId: string): Promise<ApiResponse<{ events: { id: string; title: string }[]; count: number }>> {
        return request<{ events: { id: string; title: string }[]; count: number }>(`/churches/${churchId}/events`);
      },
    },

    // Notifications
    notifications: {
      async getAll(): Promise<ApiResponse<Notification[]>> {
        return request<Notification[]>('/notifications');
      },

      async markRead(id: string): Promise<ApiResponse<void>> {
        return request<void>(`/notifications/${id}/read`, {
          method: 'POST',
        });
      },

      async markAllRead(): Promise<ApiResponse<void>> {
        return request<void>('/notifications/read-all', {
          method: 'POST',
        });
      },
    },

    // Partnerships
    partnerships: {
      async getAll(): Promise<ApiResponse<DisciplePartnership[]>> {
        return request<DisciplePartnership[]>('/partnerships');
      },

      async getActive(): Promise<ApiResponse<DisciplePartnership[]>> {
        return request<DisciplePartnership[]>('/partnerships/active');
      },

      async getPending(): Promise<ApiResponse<DisciplePartnership[]>> {
        return request<DisciplePartnership[]>('/partnerships/pending');
      },

      async getStats(): Promise<ApiResponse<PartnershipStats>> {
        return request<PartnershipStats>('/partnerships/stats');
      },

      async getRecommendations(): Promise<ApiResponse<PartnershipRecommendation[]>> {
        return request<PartnershipRecommendation[]>('/partnerships/recommendations');
      },

      async sendRequest(partnerId: string): Promise<ApiResponse<DisciplePartnership>> {
        return request<DisciplePartnership>('/partnerships', {
          method: 'POST',
          body: JSON.stringify({ partnerId }),
        });
      },

      async acceptRequest(partnershipId: string): Promise<ApiResponse<DisciplePartnership>> {
        return request<DisciplePartnership>(`/partnerships/${partnershipId}/accept`, {
          method: 'POST',
        });
      },

      async rejectRequest(partnershipId: string): Promise<ApiResponse<void>> {
        return request<void>(`/partnerships/${partnershipId}/reject`, {
          method: 'POST',
        });
      },

      async endPartnership(partnershipId: string): Promise<ApiResponse<void>> {
        return request<void>(`/partnerships/${partnershipId}/end`, {
          method: 'POST',
        });
      },

      async getMessages(partnershipId: string): Promise<ApiResponse<PartnershipMessage[]>> {
        return request<PartnershipMessage[]>(`/partnerships/${partnershipId}/messages`);
      },

      async sendMessage(partnershipId: string, content: string): Promise<ApiResponse<PartnershipMessage>> {
        return request<PartnershipMessage>(`/partnerships/${partnershipId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ content }),
        });
      },
    },

    // AI Features
    ai: {
      async getReflectionQuestions(passage: string, reference: string, context?: string): Promise<ApiResponse<{ questions: string[]; reference: string }>> {
        return request<{ questions: string[]; reference: string }>('/ai/reflection', {
          method: 'POST',
          body: JSON.stringify({ passage, reference, context }),
        });
      },

      async getReflectionFromReference(reference: string, translation?: string): Promise<ApiResponse<{ questions: string[]; reference: string; passage: string }>> {
        return request<{ questions: string[]; reference: string; passage: string }>('/ai/reflection/from-reference', {
          method: 'POST',
          body: JSON.stringify({ reference, translation }),
        });
      },

      async getPrayerPrompt(passage: string, reference: string, mood?: 'gratitude' | 'confession' | 'petition' | 'praise' | 'general'): Promise<ApiResponse<{ prompt: string; reference: string }>> {
        return request<{ prompt: string; reference: string }>('/ai/prayer-prompt', {
          method: 'POST',
          body: JSON.stringify({ passage, reference, mood }),
        });
      },

      async getInsight(passage: string, reference: string): Promise<ApiResponse<{ insight: string; reference: string }>> {
        return request<{ insight: string; reference: string }>('/ai/insight', {
          method: 'POST',
          body: JSON.stringify({ passage, reference }),
        });
      },

      async getEncouragement(verse: string, reference: string): Promise<ApiResponse<{ message: string; reference: string }>> {
        return request<{ message: string; reference: string }>('/ai/encouragement', {
          method: 'POST',
          body: JSON.stringify({ verse, reference }),
        });
      },

      async getJournalPrompt(passage: string, reference: string): Promise<ApiResponse<{ prompt: string; reference: string }>> {
        return request<{ prompt: string; reference: string }>('/ai/journal-prompt', {
          method: 'POST',
          body: JSON.stringify({ passage, reference }),
        });
      },

      async getDailyVerse(translation?: string): Promise<ApiResponse<{ reference: string; text: string; encouragement: string; copyright: string }>> {
        const query = translation ? `?translation=${translation}` : '';
        return request<{ reference: string; text: string; encouragement: string; copyright: string }>(`/ai/daily-verse${query}`);
      },
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

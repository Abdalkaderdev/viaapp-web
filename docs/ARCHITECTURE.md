# Architecture

This document describes the frontend architecture of ViaApp Web, including the application structure, state management patterns, API integration, and styling approach.

## Table of Contents

- [Overview](#overview)
- [App Router Structure](#app-router-structure)
- [Component Organization](#component-organization)
- [State Management](#state-management)
- [API Client](#api-client)
- [Authentication Flow](#authentication-flow)
- [Styling Approach](#styling-approach)
- [Error Handling](#error-handling)

## Overview

ViaApp Web is built with Next.js 15 using the App Router, React 19, and TypeScript. The architecture emphasizes:

- **Server Components by default** - Client components only when interactivity is needed
- **Centralized state management** - Zustand for global state with persistence
- **Type-safe API calls** - Fully typed API client shared with mobile app
- **Secure token management** - Memory-first storage with session fallback

## App Router Structure

The application uses Next.js App Router with file-system based routing:

```
src/app/
├── layout.tsx              # Root layout with Providers
├── page.tsx                # Home page (redirects to /login)
├── globals.css             # Global styles and Tailwind imports
│
├── (auth)/                 # Auth route group (no layout wrapper)
│   ├── forgot-password/
│   │   └── page.tsx
│   └── ...
│
├── (main)/                 # Main app route group
│   ├── bookmarks/
│   ├── community/
│   │   ├── prayer-wall/
│   │   └── testimonies/
│   ├── gospel/
│   ├── help/
│   ├── search/
│   └── sermons/
│
├── login/                  # Authentication pages
│   └── page.tsx
├── register/
│   └── page.tsx
│
├── dashboard/              # Protected dashboard
│   ├── layout.tsx          # Dashboard layout
│   └── page.tsx
│
├── quiet-time/             # QT experiences
│   ├── layout.tsx
│   ├── page.tsx            # QT type selector
│   ├── word_to_life/       # Word to Life experience
│   ├── word_to_heart/      # Word to Heart experience
│   ├── guided/             # Guided QT
│   ├── custom/             # Custom QT
│   └── reading-plans/
│
├── bible/                  # Bible reader
│   ├── layout.tsx
│   └── page.tsx            # Books list and chapter viewer
│
├── prayer/                 # Prayer journal
│   ├── layout.tsx
│   └── page.tsx
│
├── memory/                 # Scripture memorization
│   ├── layout.tsx
│   └── page.tsx
│
├── partner/                # Disciple partnerships
│   ├── layout.tsx
│   └── page.tsx
│
├── church/                 # Church features
│   ├── layout.tsx
│   └── page.tsx
│
├── community/              # Community features
│   ├── layout.tsx
│   ├── page.tsx            # Community feed
│   ├── discussions/
│   ├── events/
│   └── groups/
│       ├── page.tsx
│       └── [id]/page.tsx   # Dynamic group page
│
├── notifications/
├── settings/
├── progress/
│   ├── badges/
│   ├── statistics/
│   └── streaks/
│
├── reading-plans/
│   ├── active/
│   ├── history/
│   └── [id]/
│       └── calendar/
│
└── studies/
    ├── enrolled/
    ├── my-progress/
    └── [id]/
        ├── page.tsx
        └── lessons/
            └── [lessonId]/page.tsx
```

### Route Groups

Route groups `(auth)` and `(main)` organize routes without affecting the URL structure:

- `(auth)` - Authentication-related pages with minimal UI
- `(main)` - Secondary features that share common layout patterns

### Dynamic Routes

Dynamic segments are used for:
- `/community/groups/[id]` - Individual group pages
- `/reading-plans/[id]/calendar` - Reading plan calendars
- `/studies/[id]` - Study details
- `/studies/[id]/lessons/[lessonId]` - Individual lessons

### Layouts

Each major feature has its own layout that can include:
- Loading states
- Error boundaries
- Navigation context
- Feature-specific providers

## Component Organization

### Directory Structure

```
src/components/
├── index.ts                # Public exports
├── providers.tsx           # App-level providers (AuthProvider wrapper)
├── dashboard-layout.tsx    # Main authenticated layout with sidebar
├── sidebar.tsx             # Navigation sidebar
└── error-boundary.tsx      # React error boundary
```

### Component Patterns

#### Dashboard Layout

The `DashboardLayout` component wraps all authenticated pages:

```tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function MyPage() {
  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

Features:
- Authentication guard (redirects to login if not authenticated)
- Responsive sidebar (collapsible on desktop, drawer on mobile)
- Loading state while checking auth
- Error boundary wrapping

#### Client Components

Pages that need interactivity use the `'use client'` directive:

```tsx
'use client';
export const dynamic = 'force-dynamic';  // Prevent static generation

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function InteractivePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <DashboardLayout>
      {/* Interactive content */}
    </DashboardLayout>
  );
}
```

## State Management

### Zustand Stores

The application uses Zustand for global state management, defined in `src/lib/store.ts`:

#### Auth Store

```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'viaapp-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

Features:
- Persisted to localStorage for session continuity
- Selective persistence (doesn't persist loading state)
- Used by both AuthProvider and components directly

#### Stats Store

```tsx
interface StatsState {
  stats: UserStats | null;
  setStats: (stats: UserStats | null) => void;
}

export const useStatsStore = create<StatsState>()((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));
```

Used for caching user statistics across page navigations.

#### UI Store

```tsx
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
```

Manages sidebar collapsed state.

### Usage Example

```tsx
'use client';

import { useAuthStore, useStatsStore } from '@/lib/store';

function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  const { stats, setStats } = useStatsStore();

  // Use state...
}
```

## API Client

### Architecture

The API client is defined in `src/shared/api/index.ts` as a factory function that can be configured for different environments (web, mobile):

```tsx
function createApiClient(config: ApiClientConfig) {
  return {
    auth: { login, register, me, logout, refresh },
    user: { getStats, updateProfile },
    quietTime: { getSessions, createSession, getDailyVerse, ... },
    prayer: { getRequests, createRequest, markAnswered, ... },
    bible: { getBooks, getChapter, searchVerses, ... },
    church: { search, join, leave, checkIn, ... },
    partnerships: { getActive, sendRequest, acceptRequest, ... },
    notifications: { getAll, markRead, markAllRead },
    ai: { getReflectionQuestions, getPrayerPrompt, ... },
    // ... more modules
  };
}
```

### Web-Specific Configuration

The web client (`src/lib/api.ts`) adds security enhancements:

```tsx
const api = createApiClient({
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
```

### Token Management

Secure token storage strategy:

1. **Memory-first** - Tokens stored in memory (not accessible via XSS in storage)
2. **Session storage fallback** - Obfuscated tokens in sessionStorage (cleared on tab close)
3. **CSRF protection** - Generated token included in state-changing requests
4. **Suspicious activity detection** - Auto-logout after multiple failed requests

```tsx
// Memory storage (primary)
const tokenMemory = {
  accessToken: null,
  refreshToken: null,
};

// Obfuscation for storage fallback
function obfuscateToken(token: string): string {
  return btoa(token.split('').reverse().join(''));
}

// Token retrieval prioritizes memory
async function getToken(): Promise<string | null> {
  if (tokenMemory.accessToken) return tokenMemory.accessToken;

  const obfuscated = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (obfuscated) {
    const token = deobfuscateToken(obfuscated);
    tokenMemory.accessToken = token;
    return token;
  }
  return null;
}
```

### Request/Response Types

All API operations are fully typed:

```tsx
// Response wrapper
interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Usage
const result = await api.prayer.getRequests({ status: 'active' });
if (result.data) {
  // result.data is PaginatedResponse<PrayerRequest>
}
```

## Authentication Flow

### Login Flow

```
1. User submits credentials on /login
2. api.auth.login() called
3. On success:
   a. Tokens stored in memory + sessionStorage
   b. User object stored in Zustand (persisted to localStorage)
   c. Router navigates to /dashboard
4. On failure:
   a. Error displayed to user
   b. Tokens not stored
```

### Session Persistence

```
1. User refreshes page or opens new tab
2. Root layout renders with Providers
3. AuthProvider's useEffect runs:
   a. If user in Zustand store -> mark as loaded
   b. If no user, check for token in storage
   c. If token found -> call api.auth.me()
   d. If me() succeeds -> set user in store
   e. If me() fails -> clear tokens, redirect to /login
```

### Protected Routes

The `DashboardLayout` component handles route protection:

```tsx
function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
```

## Styling Approach

### Tailwind CSS

The application uses Tailwind CSS with a custom configuration:

```tsx
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          // ... teal color palette
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
};
```

### Design Tokens

| Token | Usage |
|-------|-------|
| `brand-*` | Primary teal color palette |
| `gray-*` | Neutral backgrounds and text |
| `amber-*` | Streaks, warnings, Word to Life |
| `rose-*` | Prayer, likes, Word to Heart |
| `green-*` | Success, answered prayers, check-ins |
| `purple-*` | Memory verses, groups |
| `blue-*` | Bible, discussions |

### Component Styling Patterns

#### Conditional Classes

Using `clsx` for conditional class composition:

```tsx
import { clsx } from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded-lg font-medium',
  isActive
    ? 'bg-brand-500 text-white'
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
)}>
```

#### Common Patterns

```tsx
// Card
<div className="bg-white rounded-2xl border border-gray-200 p-6">

// Icon container
<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-100">
  <Icon className="w-6 h-6 text-brand-600" />
</div>

// Gradient button
<button className="bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">

// Form input
<input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none">
```

## Error Handling

### Error Boundary

A React Error Boundary wraps the main content:

```tsx
// src/components/error-boundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```tsx
const result = await api.prayer.getRequests();

if (result.error) {
  // Handle error (show toast, set error state, etc.)
  setError(result.error);
  return;
}

// Safe to use result.data
setData(result.data);
```

### Inline Error Component

For section-level errors:

```tsx
import { ErrorCard } from '@/components/error-boundary';

{error && (
  <ErrorCard
    message="Failed to load prayers"
    onRetry={() => fetchPrayers()}
  />
)}
```

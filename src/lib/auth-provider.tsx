'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import { useAuthStore } from './store';
import type { User, LoginRequest, RegisterRequest } from '@shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: clearAuth } = useAuthStore();
  const checkedRef = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (checkedRef.current) return;
    checkedRef.current = true;

    async function checkAuth() {
      // If user is already set (e.g., from login), just mark as loaded
      if (user) {
        setLoading(false);
        return;
      }

      // Check if we have a token first (stored in sessionStorage, not localStorage)
      const token = typeof window !== 'undefined'
        ? sessionStorage.getItem('viaapp.accessToken')
        : null;

      if (!token) {
        setUser(null);
        setLoading(false);
        // Only redirect protected routes - allow public pages without auth
        const publicPaths = ['/', '/features', '/about', '/faq', '/download', '/for-churches', '/login', '/register', '/terms', '/privacy'];
        const currentPath = window.location.pathname;
        const isPublicPath = publicPaths.some(p => currentPath === p || currentPath.startsWith('/login') || currentPath.startsWith('/register'));
        if (!isPublicPath) {
          router.replace('/login');
        }
        return;
      }

      // Try to fetch user from API
      const result = await api.auth.me();
      if (result.data) {
        setUser(result.data);
      } else {
        // API call failed - clear tokens and redirect
        setUser(null);
        router.replace('/login');
      }
    }
    checkAuth();
  }, [user, setUser, setLoading, router]);

  const login = async (credentials: LoginRequest) => {
    const result = await api.auth.login(credentials);
    if (result.data) {
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Login failed' };
  };

  const register = async (data: RegisterRequest) => {
    const result = await api.auth.register(data);
    if (result.data) {
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Registration failed' };
  };

  const logout = async () => {
    await api.auth.logout();
    clearAuth();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { useUIStore } from '@/lib/store';
import { Sidebar } from './sidebar';
import { ErrorBoundary } from './error-boundary';
import { clsx } from 'clsx';
import { Loader2, Menu } from 'lucide-react';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/viaapp-logo.jpeg"
              alt="ViaApp"
              width={64}
              height={64}
              className="rounded-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/viaapp-logo.jpeg"
              alt="ViaApp"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="font-bold text-lg bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
              ViaApp
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile unless menu is open */}
        <div className={clsx(
          'lg:block',
          mobileMenuOpen ? 'block' : 'hidden'
        )}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <main
          className={clsx(
            'transition-all duration-300 min-h-screen',
            'pt-16 lg:pt-0', // Account for mobile header
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20',
            'ml-0' // No margin on mobile
          )}
        >
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

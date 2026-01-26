'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { useUIStore } from '@/lib/store';
import { api } from '@/lib/api';
import { clsx } from 'clsx';
import type { UserStats } from '@shared/types';
import {
  Home,
  BookHeart,
  BookOpen,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Church,
  Brain,
} from 'lucide-react';

// Main 5 tabs matching mobile app
const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/quiet-time', label: 'QT Experiences', icon: BookHeart },
  { href: '/bible', label: 'Bible', icon: BookOpen },
  { href: '/partner', label: 'Disciple Partner', icon: Users },
];

// Additional features
const moreNavItems = [
  { href: '/prayer', label: 'Prayer', icon: Heart },
  { href: '/memory', label: 'Memory Verses', icon: Brain },
  { href: '/church', label: 'Church', icon: Church },
];

const accountNavItems = [
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavSection({
  title,
  items,
  pathname,
  sidebarOpen
}: {
  title?: string;
  items: typeof mainNavItems;
  pathname: string;
  sidebarOpen: boolean;
}) {
  return (
    <div className="space-y-1">
      {title && sidebarOpen && (
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon className={clsx(
              'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
              isActive && 'text-brand-600'
            )} />
            {sidebarOpen && (
              <span className={clsx('font-medium truncate', isActive && 'text-brand-700')}>
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function StreakBadge({ streak, sidebarOpen }: { streak: number; sidebarOpen: boolean }) {
  const nextMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => m > streak) || 365;

  if (!sidebarOpen) {
    return (
      <div className="px-3 py-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto">
          <Flame className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Flame className={clsx('w-5 h-5 text-white', streak > 0 && 'animate-pulse')} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-amber-700 font-medium">Current Streak</p>
            <p className="text-lg font-bold text-amber-900">{streak} days</p>
          </div>
        </div>
        {streak > 0 && streak < nextMilestone && (
          <div className="mt-2">
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${(streak / nextMilestone) * 100}%` }}
              />
            </div>
            <p className="text-xs text-amber-600 mt-1">
              {nextMilestone - streak} days to {nextMilestone}-day badge
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await api.user.getStats();
        if (result.data) {
          setStats(result.data);
        }
      } catch {
        // Silently fail - streak will show 0
      }
    }
    fetchStats();
  }, []);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/viaapp-logo.jpeg"
            alt="ViaApp"
            width={40}
            height={40}
            className="rounded-xl shadow-lg flex-shrink-0"
          />
          {sidebarOpen && (
            <span className="font-bold text-xl bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
              ViaApp
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Streak Badge */}
      <StreakBadge streak={stats?.currentStreak || 0} sidebarOpen={sidebarOpen} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        <NavSection
          items={mainNavItems}
          pathname={pathname}
          sidebarOpen={sidebarOpen}
        />

        <div className="border-t border-gray-100 pt-4">
          <NavSection
            title="More"
            items={moreNavItems}
            pathname={pathname}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <NavSection
          items={accountNavItems}
          pathname={pathname}
          sidebarOpen={sidebarOpen}
        />

        {/* User & Logout */}
        <div className="pt-2 mt-2 border-t border-gray-100">
          {sidebarOpen && user && (
            <div className="px-3 py-2 mb-2">
              <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all group"
            title={!sidebarOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

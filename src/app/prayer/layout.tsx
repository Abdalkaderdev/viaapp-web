'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-provider';

export default function PrayerLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

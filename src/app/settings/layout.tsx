'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-provider';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-provider';

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

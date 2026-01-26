'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-provider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

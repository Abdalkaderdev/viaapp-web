'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-provider';

export default function WordToLifeLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

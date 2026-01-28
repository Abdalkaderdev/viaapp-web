'use client';

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth-provider';
import { ToastProvider, useToast, setGlobalToast } from '@/components/ui/toast';

// Initialize global toast reference
function ToastInitializer() {
  const toast = useToast();
  useEffect(() => {
    setGlobalToast(toast);
  }, [toast]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastInitializer />
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}

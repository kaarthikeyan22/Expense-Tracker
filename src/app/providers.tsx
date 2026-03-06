'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
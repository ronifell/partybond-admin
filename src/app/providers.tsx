'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/lib/auth';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(20,20,32,0.92)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              backdropFilter: 'blur(20px)',
              fontSize: 13,
            },
            success: {
              iconTheme: { primary: '#00C853', secondary: '#0A0A12' },
            },
            error: {
              iconTheme: { primary: '#FF5252', secondary: '#0A0A12' },
            },
          }}
        />
      </AuthProvider>
    </I18nProvider>
  );
}

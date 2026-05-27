'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function PanelLayout({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();

  if (!ready || !user) return <LoadingScreen />;

  return <AppShell>{children}</AppShell>;
}

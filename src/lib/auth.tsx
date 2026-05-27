'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, getStoredToken, setStoredToken } from './api';
import type { AdminUser } from './types';

interface AuthContextValue {
  user: AdminUser | null;
  ready: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AdminUser>;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ROUTES = new Set(['/login']);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMe = useCallback(async (): Promise<AdminUser | null> => {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const { data } = await api.get<{ user: AdminUser }>('/auth/me');
      if (!data.user.isAdmin) {
        setStoredToken(null);
        return null;
      }
      return data.user;
    } catch {
      setStoredToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const me = await fetchMe();
      if (!cancelled) {
        setUser(me);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMe]);

  useEffect(() => {
    if (!ready) return;
    const isPublic = PUBLIC_ROUTES.has(pathname);
    if (!user && !isPublic) {
      router.replace('/login');
    }
    if (user && isPublic) {
      router.replace('/dashboard');
    }
  }, [user, ready, pathname, router]);

  const signIn = useCallback(async (email: string, password: string): Promise<AdminUser> => {
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string; user: AdminUser }>(
        '/auth/admin/login',
        { email, password },
      );
      setStoredToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    router.replace('/login');
  }, [router]);

  const refresh = useCallback(async () => {
    const me = await fetchMe();
    setUser(me);
  }, [fetchMe]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, loading, signIn, signOut, refresh }),
    [user, ready, loading, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

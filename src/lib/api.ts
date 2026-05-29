import axios, { type AxiosError } from 'axios';

const STORAGE_KEY = 'partybond-admin:token';

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) return 'http://localhost:4000';
  return url.replace(/\/$/, '');
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const api = axios.create({
  baseURL: `${getApiUrl()}/api/v1`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  // Let the browser set multipart boundaries for file uploads.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

/** Upload a game thumbnail via multipart/form-data (fetch avoids axios FormData issues). */
export async function uploadGameImage(gameId: string, file: File): Promise<void> {
  const form = new FormData();
  form.append('image', file);
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/admin/games/${encodeURIComponent(gameId)}/image`, {
      method: 'POST',
      headers,
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: ApiErrorShape };
      if (body.error) throw { response: { data: { error: body.error } } };
      throw new Error(`Upload failed (${res.status})`);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export interface ApiErrorShape {
  code?: string;
  message: string;
  details?: unknown;
}

export function getApiError(err: unknown): ApiErrorShape {
  const e = err as AxiosError<{ error?: ApiErrorShape }>;
  const payload = e.response?.data?.error;
  if (payload) return payload;
  return { message: e.message || 'Network error' };
}

export function isUnauthorized(err: unknown): boolean {
  const e = err as AxiosError;
  return e.response?.status === 401;
}

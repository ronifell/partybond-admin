'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { getApiError } from '@/lib/api';
import type { Locale } from '@/i18n';

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.82 18.82 0 0 1-4.11 5.11M6.61 6.61C3.78 8.4 2 12 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.39-.89"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === 'pt') {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" className="shrink-0">
        <rect width="18" height="12" rx="1.5" fill="#009B3A" />
        <polygon points="9,1.5 16.5,6 9,10.5 1.5,6" fill="#FEDF00" />
        <circle cx="9" cy="6" r="2.4" fill="#002776" />
      </svg>
    );
  }

  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" className="shrink-0">
      <rect width="18" height="12" rx="1.5" fill="#B22234" />
      <path d="M0 1.85h18M0 4.62h18M0 7.38h18M0 10.15h18" stroke="#fff" strokeWidth="0.92" />
      <rect width="7.2" height="6.46" fill="#3C3B6E" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      toast.success(t('common.saved'));
      router.replace('/dashboard');
    } catch (err) {
      const e = getApiError(err);
      if (e.code === 'not_admin') {
        setErrorMessage(t('auth.notAdmin'));
      } else if (e.code === 'account_banned') {
        setErrorMessage(t('auth.accountBanned'));
      } else if (e.code === 'invalid_credentials') {
        setErrorMessage(t('auth.invalidCredentials'));
      } else {
        setErrorMessage(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="login-card relative w-full max-w-[420px]">
        <div className="relative space-y-6 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="login-logo">
              <span className="text-2xl font-black text-white">P</span>
            </div>
            <div>
              <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight">
                <span className="text-white">Partybond</span>
                <span className="login-title-admin"> Admin</span>
              </h1>
              <p className="mt-2 text-sm text-ink-secondary">{t('auth.loginSubtitle')}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label-base">
                {t('auth.email')}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-blue">
                  <UserIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="login-input pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@partybond.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label-base">
                {t('auth.password')}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-purple">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="login-input pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-secondary transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errorMessage ? (
                <p className="mt-1.5 text-xs text-status-error">{errorMessage}</p>
              ) : null}
            </div>

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          <div className="space-y-4 pt-1">
            <div className="login-divider">{t('auth.selectLanguage')}</div>
            <div className="flex gap-2">
              {(['pt', 'en'] as Locale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={
                    'login-lang-btn' + (locale === l ? ' login-lang-btn-active' : '')
                  }
                >
                  <FlagIcon locale={l} />
                  {l === 'pt' ? t('settings.portuguese') : t('settings.english')}
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] leading-relaxed text-ink-disabled">
              {t('auth.needBootstrapPrefix')}{' '}
              <span className="login-bootstrap-code">{t('auth.needBootstrapCommand')}</span>{' '}
              {t('auth.needBootstrapSuffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

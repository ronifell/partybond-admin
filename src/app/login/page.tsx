'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { getApiError } from '@/lib/api';
import type { Locale } from '@/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Card className="w-full max-w-md border-glass-border-strong shadow-soft">
        <div className="space-y-6 p-7">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl font-black text-white shadow-glow">
              P
            </span>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{t('app.name')}</h1>
              <p className="mt-1 text-sm text-ink-secondary">{t('auth.loginSubtitle')}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              label={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@partybond.com"
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errorMessage ?? undefined}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
            >
              {submitting ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>

          <div className="space-y-3 border-t border-glass-border pt-4 text-center">
            <div className="flex justify-center gap-1.5">
              {(['pt', 'en'] as Locale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={
                    'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ' +
                    (locale === l
                      ? 'bg-brand-gradient text-white shadow-glow-soft'
                      : 'border border-glass-border text-ink-secondary hover:text-ink')
                  }
                >
                  {l === 'pt' ? t('settings.portuguese') : t('settings.english')}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-disabled">{t('auth.needBootstrap')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

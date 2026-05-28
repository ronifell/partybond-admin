'use client';

import { useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/lib/auth';
import { api, getApiError } from '@/lib/api';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/cn';

// ─── Password field with show/hide toggle ────────────────────────────────────

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder = '••••••••',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="label-base">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-disabled">
          <Icon.Lock size={15} />
        </span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          className="input-base pl-9 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute inset-y-0 right-3 flex items-center text-ink-disabled transition-colors hover:text-ink"
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <Icon.EyeOff size={15} /> : <Icon.Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { user, refresh } = useAuth();

  // ── Edit-profile form ──────────────────────────────────────────────────────
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSaving(true);
    try {
      await api.patch('/admin/account', {
        name: profileName.trim() || undefined,
        email: profileEmail.trim() || undefined,
      });
      await refresh();
      toast.success(t('toasts.saved'));
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === 'email_taken') {
        setProfileError(t('settings.emailTaken'));
      } else {
        setProfileError(apiErr.message);
      }
    } finally {
      setProfileSaving(false);
    }
  }

  // ── Change-password form ───────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (newPw !== confirmPw) {
      setPwError(t('settings.passwordMismatch'));
      return;
    }
    setPwSaving(true);
    try {
      await api.patch('/admin/account', {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      toast.success(t('toasts.saved'));
    } catch (err) {
      const apiErr = getApiError(err);
      if (apiErr.code === 'wrong_password') {
        setPwError(t('settings.wrongPassword'));
      } else {
        setPwError(apiErr.message);
      }
    } finally {
      setPwSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {/* ── Language ─────────────────────────────────────────────────────── */}
      <Card>
        <CardBody>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            <Icon.Globe size={16} />
            {t('settings.language')}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{t('settings.languageHint')}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(['pt', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all',
                  locale === l
                    ? 'border-transparent bg-brand-gradient-soft shadow-[inset_0_0_0_1px_rgba(123,63,242,0.45)]'
                    : 'border-glass-border bg-glass-surface hover:border-glass-border-strong',
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {l === 'pt' ? t('settings.portuguese') : t('settings.english')}
                  </p>
                  <p className="text-[11px] text-ink-disabled">{l === 'pt' ? 'PT-BR' : 'EN-US'}</p>
                </div>
                {locale === l ? <Icon.Check className="text-status-success" /> : null}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ── Profile (read-only summary) ───────────────────────────────────── */}
      <Card>
        <CardBody className="pb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            {t('settings.profile')}
          </h2>
          <div className="mt-4 flex items-start gap-4">
            <Avatar src={user?.photoUrl ?? null} name={user?.name ?? ''} size={64} />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-ink">{user?.name}</p>
              <p className="break-all text-sm text-ink-secondary">{user?.email}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="brand">{t('users.tag.admin')}</Badge>
                <Badge tone="success">{t('users.tag.active')}</Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Edit profile ─────────────────────────────────────────────────── */}
      <Card>
        <CardBody className="pb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            <Icon.Edit size={16} />
            {t('settings.editProfile')}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{t('settings.editProfileHint')}</p>

          <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
            <div>
              <label htmlFor="profile-name" className="label-base">
                {t('settings.name')}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-disabled">
                  <Icon.User size={15} />
                </span>
                <input
                  id="profile-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={60}
                  className="input-base pl-9"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="label-base">
                {t('settings.email')}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-disabled">
                  <Icon.Mail size={15} />
                </span>
                <input
                  id="profile-email"
                  type="email"
                  required
                  className="input-base pl-9"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>
            </div>

            {profileError ? (
              <p className="text-xs text-status-error">{profileError}</p>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={profileSaving} className="w-full sm:w-auto">
                {profileSaving ? t('settings.savingProfile') : t('settings.saveProfile')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* ── Change password ───────────────────────────────────────────────── */}
      <Card>
        <CardBody className="pb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            <Icon.Lock size={16} />
            {t('settings.changePassword')}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{t('settings.changePasswordHint')}</p>

          <form onSubmit={handlePasswordSave} className="mt-5 space-y-4">
            <PasswordInput
              id="current-password"
              label={t('settings.currentPassword')}
              value={currentPw}
              onChange={setCurrentPw}
              autoComplete="current-password"
            />
            <PasswordInput
              id="new-password"
              label={t('settings.newPassword')}
              value={newPw}
              onChange={setNewPw}
              autoComplete="new-password"
            />
            <PasswordInput
              id="confirm-password"
              label={t('settings.confirmPassword')}
              value={confirmPw}
              onChange={setConfirmPw}
              autoComplete="new-password"
            />

            {pwError ? (
              <p className="text-xs text-status-error">{pwError}</p>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={pwSaving} className="w-full sm:w-auto">
                {pwSaving ? t('settings.savingPassword') : t('settings.savePassword')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

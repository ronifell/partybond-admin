'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { getApiError } from '@/lib/api';
import { AppBrand } from '@/components/ui/AppBrand';
import type { Locale } from '@/i18n';

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
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
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.82 18.82 0 0 1-4.11 5.11M6.61 6.61C3.78 8.4 2 12 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.39-.89"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersFeatureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 20c.5-3.5 3.5-6 6-6s6.5 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M21 18c-.4-2.5-2-4-4.5-4.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoltFeatureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyFeatureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4h8v3a4 4 0 0 1-8 0V4ZM6 4H4a2 2 0 0 0 2 2v1a4 4 0 0 0 4 4M18 4h2a2 2 0 0 1-2 2v1a4 4 0 0 1-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 11v3M9 20h6M10 14h4v3H10v-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.04c-.216 1.224-.972 2.268-2.064 2.964l3.312 2.568C19.908 17.64 21 15.516 21 12.996c0-.684-.06-1.344-.168-1.968H12Z"
      />
      <path
        fill="#34A853"
        d="M6.516 14.328 5.304 15.3 3.996 16.272A8.988 8.988 0 0 0 12 21c2.424 0 4.464-.792 5.952-2.148l-3.312-2.568c-.912.612-2.088.972-2.64.972-2.028 0-3.744-1.368-4.356-3.204Z"
      />
      <path
        fill="#4A90E2"
        d="M3.996 7.728A8.958 8.958 0 0 0 3 12c0 .828.144 1.62.396 2.364l3.12-2.412A5.364 5.364 0 0 1 6.6 12c0-.588.108-1.152.3-1.68L3.996 7.728Z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.388c1.332 0 2.532.456 3.48 1.344l2.604-2.604C16.452 2.88 14.412 2 12 2 8.676 2 5.796 3.672 3.996 6.228l3.12 2.412C7.656 6.756 9.372 5.388 12 5.388Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.894 3.2a13.05 13.05 0 0 0-.635 1.308 18.272 18.272 0 0 0-5.518 0A12.64 12.64 0 0 0 9.106 3.2 19.736 19.736 0 0 0 4.682 4.37 20.413 20.413 0 0 0 2.04 16.512a19.9 19.9 0 0 0 6.086 3.088 14.67 14.67 0 0 0 1.302-2.125 12.8 12.8 0 0 1-2.05-.996 8.93 8.93 0 0 0 .396-.317 13.803 13.803 0 0 0 9.452 0c.13.11.26.216.396.317-.657.37-1.338.696-2.05.996.372.756.768 1.47 1.302 2.125a19.88 19.88 0 0 0 6.086-3.088 20.36 20.36 0 0 0-2.643-12.143ZM8.683 13.725c-.794 0-1.446-.73-1.446-1.625 0-.902.66-1.632 1.446-1.632.794 0 1.44.73 1.446 1.632 0 .895-.652 1.625-1.446 1.625Zm6.634 0c-.794 0-1.446-.73-1.446-1.625 0-.902.66-1.632 1.446-1.632.794 0 1.44.73 1.446 1.632 0 .895-.652 1.625-1.446 1.625Z" />
    </svg>
  );
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #ff4da6, #7b3ff2)',
  'linear-gradient(135deg, #7b3ff2, #00d1ff)',
  'linear-gradient(135deg, #00d1ff, #00c853)',
  'linear-gradient(135deg, #ffb020, #ff4da6)',
];

function LanguageSelector() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [open]);

  const label = locale === 'pt' ? t('settings.portuguese') : t('settings.english');

  return (
    <div ref={rootRef} className="login-lang-dropdown">
      <button
        type="button"
        className="login-lang-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <GlobeIcon />
        <span>{label}</span>
        <ChevronDownIcon />
      </button>
      {open ? (
        <div
          className="login-lang-menu"
          role="listbox"
          onClick={(e) => e.stopPropagation()}
        >
          {(['en', 'pt'] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={locale === l}
              className={'login-lang-option' + (locale === l ? ' login-lang-option-active' : '')}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
            >
              {l === 'pt' ? t('settings.portuguese') : t('settings.english')}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function LoginHeroPanel() {
  const { t } = useI18n();

  const features = [
    { key: 'findPlayers', icon: <UsersFeatureIcon />, iconClass: 'login-feature-icon-pink' },
    { key: 'playTogether', icon: <BoltFeatureIcon />, iconClass: 'login-feature-icon-cyan' },
    { key: 'winAsOne', icon: <TrophyFeatureIcon />, iconClass: 'login-feature-icon-amber' },
  ] as const;

  return (
    <aside className="login-left-panel">
      <div className="login-left-content">
        <AppBrand size="sm" href={false} className="login-left-brand" />

        <div className="login-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" aria-hidden className="login-hero-logo" />
          <h1 className="login-hero-headline">
            <span className="login-hero-line">
              {t('auth.hero.line1Prefix')}{' '}
              <span className="login-hero-highlight-cyan">{t('auth.hero.line1Highlight')}</span>
            </span>
            <span className="login-hero-line">
              {t('auth.hero.line2Prefix')}{' '}
              <span className="login-hero-highlight-pink">{t('auth.hero.line2Highlight')}</span>
            </span>
            <span className="login-hero-line">
              {t('auth.hero.line3Prefix')}{' '}
              <span className="login-hero-highlight-cyan">{t('auth.hero.line3Highlight')}</span>
            </span>
          </h1>
          <p className="login-hero-tagline">{t('auth.loginTagline')}</p>
        </div>

        <div className="login-feature-panel">
          <div className="login-feature-grid">
            {features.map(({ key, icon, iconClass }) => (
              <div key={key} className="login-feature-item">
                <div className={`login-feature-icon ${iconClass}`}>{icon}</div>
                <h2 className="login-feature-title">{t(`auth.features.${key}.title`)}</h2>
                <p className="login-feature-copy">{t(`auth.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="login-status-bar">
          <span className="login-status-dot" aria-hidden />
          <span className="login-status-text">{t('auth.playersOnline')}</span>
          <div className="login-status-avatars" aria-hidden>
            {AVATAR_GRADIENTS.map((gradient, i) => (
              <span key={i} className="login-status-avatar" style={{ background: gradient }} />
            ))}
          </div>
          <span className="login-status-more">{t('auth.morePlayers')}</span>
        </div>
      </div>
    </aside>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="login-page">
      <LoginHeroPanel />

      <section className="login-right-panel">
        <div className="login-card">
          <div className="login-card-inner">
            <div className="login-card-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/login%20logo.png" alt="" aria-hidden className="login-card-logo" />
              <h1 className="login-welcome-title">{t('auth.welcomeBack')}</h1>
              <p className="login-card-subtitle">{t('auth.loginSubtitle')}</p>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              <div>
                <label htmlFor="email" className="login-field-label">
                  {t('auth.email')}
                </label>
                <div className="login-field-wrap">
                  <span className="login-field-icon login-field-icon-mail">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="login-field-label">
                  {t('auth.password')}
                </label>
                <div className="login-field-wrap">
                  <span className="login-field-icon login-field-icon-lock">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="login-input login-input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="login-field-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errorMessage ? <p className="login-field-error">{errorMessage}</p> : null}
              </div>

              <div className="login-form-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-remember-checkbox"
                  />
                  <span>{t('auth.rememberMe')}</span>
                </label>
                <button type="button" className="login-forgot-link">
                  {t('auth.forgotPassword')}
                </button>
              </div>

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? t('auth.signingIn') : t('auth.signIn')}
              </button>
            </form>

            <div className="login-divider">{t('auth.orContinueWith')}</div>

            <div className="login-social-row">
              <button type="button" className="login-social-btn">
                <GoogleIcon />
                <span>{t('auth.continueWithGoogle')}</span>
              </button>
              <button type="button" className="login-social-btn">
                <DiscordIcon />
                <span>{t('auth.continueWithDiscord')}</span>
              </button>
            </div>

            <p className="login-signup-footer">
              {t('auth.noAccount')}{' '}
              <button type="button" className="login-signup-link">
                {t('auth.createOne')}
              </button>
            </p>

            <p className="login-bootstrap-note">
              {t('auth.needBootstrapPrefix')}{' '}
              <span className="login-bootstrap-code">{t('auth.needBootstrapCommand')}</span>{' '}
              {t('auth.needBootstrapSuffix')}
            </p>
          </div>
        </div>

        <LanguageSelector />
      </section>
    </div>
  );
}

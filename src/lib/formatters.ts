import type { Locale } from '@/i18n';

const localeMap: Record<Locale, string> = {
  en: 'en-US',
  pt: 'pt-BR',
};

export function formatDate(value: string | Date | null | undefined, locale: Locale): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(localeMap[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(
  value: string | Date | null | undefined,
  locale: Locale,
): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(localeMap[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(
  value: string | Date | null | undefined,
  locale: Locale,
): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';

  const diff = d.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], { numeric: 'auto' });
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (abs < minute) return rtf.format(Math.round(diff / 1000), 'second');
  if (abs < hour) return rtf.format(Math.round(diff / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diff / hour), 'hour');
  if (abs < week) return rtf.format(Math.round(diff / day), 'day');
  return formatDate(d, locale);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale]).format(value);
}

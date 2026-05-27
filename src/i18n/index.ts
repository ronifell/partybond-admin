import en from './locales/en.json';
import pt from './locales/pt.json';

export type Locale = 'en' | 'pt';

export const LOCALES: readonly Locale[] = ['en', 'pt'] as const;
export const DEFAULT_LOCALE: Locale = 'pt';

export const messages: Record<Locale, typeof en> = { en, pt };

export type Messages = typeof en;

type Primitive = string | number;

function lookup(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

export function format(template: string, vars?: Record<string, Primitive>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, Primitive>,
): string {
  const value = lookup(messages[locale], key) ?? lookup(messages.en, key);
  if (typeof value !== 'string') return key;
  return format(value, vars);
}

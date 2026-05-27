'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const { t, locale } = useI18n();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const itemsLabel = locale === 'pt' ? (total === 1 ? 'item' : 'itens') : total === 1 ? 'item' : 'items';

  if (total <= pageSize) {
    return (
      <div className="flex items-center justify-between px-1 py-3 text-xs text-ink-secondary">
        <span>
          {total} {itemsLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 px-1 py-3 text-xs text-ink-secondary">
      <span>
        {t('common.page')} <span className="text-ink">{page}</span> {t('common.of')}{' '}
        <span className="text-ink">{totalPages}</span> · {total} {itemsLabel}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 1}>
          {t('common.previous')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
}

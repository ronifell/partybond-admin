'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
} as const;

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        className={cn(
          'glass-card w-full animate-fade-in border-glass-border-strong bg-glass-surface backdrop-blur-md',
          sizeClass[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle) && (
          <div className="border-b border-glass-border px-5 py-4">
            {title ? <h3 className="text-base font-semibold text-ink">{title}</h3> : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>
            ) : null}
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-glass-border px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

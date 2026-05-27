'use client';

import { useEffect, type ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.dataset.page = 'login';
    return () => {
      delete document.body.dataset.page;
    };
  }, []);

  return children;
}

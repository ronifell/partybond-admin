'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Topbar onOpenSidebar={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-7xl space-y-6 animate-fade-in">{children}</div>
        </main>
        <footer className="border-t border-glass-border px-6 py-4 text-center text-[11px] text-ink-disabled">
          © {new Date().getFullYear()} Partybond Admin
        </footer>
      </div>
    </div>
  );
}

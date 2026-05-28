'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-0 flex-1 flex-col lg:pl-72">
        <Topbar onOpenSidebar={() => setOpen(true)} />
        <main
          className={
            'flex min-h-0 flex-1 flex-col px-[2%] py-[1%] sm:px-[3%] scrollbar-thin ' +
            (isDashboard ? 'overflow-hidden' : 'overflow-y-auto')
          }
        >
          <div
            className={
              'mx-auto flex w-full max-w-7xl animate-fade-in ' +
              (isDashboard
                ? 'h-full min-h-0 flex-col'
                : 'flex-1 flex-col gap-[1.5%] py-[1%]')
            }
          >
            {children}
          </div>
        </main>
        <footer className="shrink-0 border-t border-glass-border bg-transparent px-[2%] py-[0.4%] text-center text-[clamp(0.55rem,0.9vw,0.7rem)] text-ink-disabled">
          © {new Date().getFullYear()} Partybond Admin
        </footer>
      </div>
    </div>
  );
}

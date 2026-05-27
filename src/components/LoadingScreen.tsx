export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-brand-purple border-r-brand-pink" />
        <span className="text-xs uppercase tracking-widest text-ink-disabled">Partybond</span>
      </div>
    </div>
  );
}

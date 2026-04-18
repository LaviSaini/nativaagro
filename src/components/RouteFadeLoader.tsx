/**
 * Full-viewport loading overlay for App Router `loading.tsx` segments.
 * Fixed z-index above header so the screen feels “blocked” until content is ready.
 */
export default function RouteFadeLoader() {
  return (
    <div
      className="route-fade-loader fixed inset-0 z-[200] flex items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="route-fade-loader__backdrop absolute inset-0 bg-[color:var(--surface)]/92 backdrop-blur-sm" />
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/90 bg-white/95 px-10 py-9 shadow-lg">
        <div
          className="h-11 w-11 animate-spin rounded-full border-2 border-[color:var(--accent)]/35 border-t-[color:var(--ink)]"
          role="status"
        />
        <p className="text-sm font-medium tracking-wide text-zinc-600">Loading…</p>
      </div>
    </div>
  );
}

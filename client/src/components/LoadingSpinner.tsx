export default function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"
        role="status"
        aria-label={label}
      />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

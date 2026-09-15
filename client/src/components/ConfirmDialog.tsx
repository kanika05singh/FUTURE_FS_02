import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isDangerous = true,
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex min-h-screen items-center justify-center bg-black/40 px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg animate-scale-in">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isDangerous ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' : 'bg-brand-50 text-brand-600'
            }`}
          >
            <AlertTriangle size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="font-medium text-ink">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isBusy}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors duration-150 disabled:opacity-60 ${
              isDangerous ? 'bg-[var(--color-danger)] hover:opacity-90' : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {isBusy ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

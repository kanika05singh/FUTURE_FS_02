import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ToastKind = 'success' | 'error';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  leaving: boolean;
}

interface ToastContextValue {
  notify: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let nextId = 1;
const EXIT_DURATION = 200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const startExit = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => remove(id), EXIT_DURATION);
  }, []);

  const notify = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, kind, message, leaving: false }]);
      window.setTimeout(() => startExit(id), 4000);
    },
    [startExit]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-sm ${
              t.leaving ? 'toast-leaving' : 'animate-toast-in'
            } ${
              t.kind === 'success'
                ? 'border-brand-300 bg-white text-brand-700'
                : 'border-red-200 bg-white text-[var(--color-danger)]'
            }`}
          >
            <span className="text-sm font-medium">{t.message}</span>
            <button
              onClick={() => startExit(t.id)}
              className="text-ink-faint transition-colors duration-150 hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

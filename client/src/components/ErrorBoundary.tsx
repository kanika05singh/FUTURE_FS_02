import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this is where you'd forward to an error-tracking service.
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
          <TriangleAlert size={22} aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Something went wrong</h1>
          <p className="mt-1 max-w-sm text-sm text-ink-muted">
            An unexpected error occurred. Reloading the page usually fixes it — your data is safe.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Reload
        </button>
      </div>
    );
  }
}

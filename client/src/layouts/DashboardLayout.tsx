import type { ReactNode } from 'react';
import { LayoutDashboard, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { initials } from '../utils/format';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuth();
  const { notify } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      notify('success', 'Logged out');
    } catch {
      notify('error', "Couldn't log out. Try again.");
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-white md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sprout size={16} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold text-ink">Mini CRM</span>
        </div>
        <nav className="flex-1 px-3">
          <span className="flex items-center gap-2.5 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
            <LayoutDashboard size={16} aria-hidden="true" />
            Dashboard
          </span>
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-paper hover:text-ink"
          >
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sprout size={14} aria-hidden="true" />
            </span>
            <span className="font-display text-base font-semibold text-ink">Mini CRM</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-ink-muted">Welcome back</p>
            <p className="font-medium text-ink">{admin?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-100 text-xs font-semibold text-gold-600">
              {admin ? initials(admin.name) : ''}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-ink-muted transition-colors duration-150 hover:bg-paper hover:text-ink md:hidden"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

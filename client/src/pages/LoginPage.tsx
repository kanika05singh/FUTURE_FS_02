import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

export default function LoginPage() {
  const { admin, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && admin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-600 p-10 text-brand-50 md:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50/15">
            <Sprout size={16} aria-hidden="true" />
          </span>
          <span className="font-medium">Mini CRM</span>
        </div>
        <div>
          <p className="font-display text-4xl font-semibold italic leading-tight text-white">
            Every lead is a seed.
            <br />
            Track what makes it grow.
          </p>
          <p className="mt-4 max-w-sm text-sm text-brand-100">
            Log follow-ups, watch leads move from first contact to closed deal, and see exactly
            where your pipeline stands.
          </p>
        </div>
        <p className="text-xs text-brand-100/70">Client Lead Management System</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sprout size={16} aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold text-ink">Mini CRM</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">Admin access to your lead pipeline.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@minicrm.com"
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand-500"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

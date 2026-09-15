import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: 'brand' | 'new' | 'contacted' | 'converted' | 'gold';
  suffix?: string;
}

const ACCENTS: Record<NonNullable<StatCardProps['accent']>, { rail: string; iconBg: string; iconText: string }> = {
  brand: { rail: 'bg-brand-600', iconBg: 'bg-brand-50', iconText: 'text-brand-600' },
  new: { rail: 'bg-[var(--color-status-new)]', iconBg: 'bg-[var(--color-status-new-bg)]', iconText: 'text-[var(--color-status-new)]' },
  contacted: { rail: 'bg-[var(--color-status-contacted)]', iconBg: 'bg-[var(--color-status-contacted-bg)]', iconText: 'text-[var(--color-status-contacted)]' },
  converted: { rail: 'bg-[var(--color-status-converted)]', iconBg: 'bg-[var(--color-status-converted-bg)]', iconText: 'text-[var(--color-status-converted)]' },
  gold: { rail: 'bg-gold-500', iconBg: 'bg-gold-100', iconText: 'text-gold-600' },
};

export default function StatCard({ label, value, icon, accent = 'brand', suffix }: StatCardProps) {
  const style = ACCENTS[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white p-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${style.rail}`} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.iconBg} ${style.iconText}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold text-ink font-tabular">
        {value}
        {suffix && <span className="ml-0.5 text-lg text-ink-muted">{suffix}</span>}
      </p>
    </div>
  );
}

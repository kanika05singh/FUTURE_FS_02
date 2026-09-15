import type { LeadStatus } from '../types';

export const STATUS_STYLES: Record<
  LeadStatus,
  { rail: string; border: string; bg: string; text: string; dot: string }
> = {
  New: {
    rail: 'bg-[var(--color-status-new)]',
    border: 'border-[var(--color-status-new)]',
    bg: 'bg-[var(--color-status-new-bg)]',
    text: 'text-[var(--color-status-new)]',
    dot: 'bg-[var(--color-status-new)]',
  },
  Contacted: {
    rail: 'bg-[var(--color-status-contacted)]',
    border: 'border-[var(--color-status-contacted)]',
    bg: 'bg-[var(--color-status-contacted-bg)]',
    text: 'text-[var(--color-status-contacted)]',
    dot: 'bg-[var(--color-status-contacted)]',
  },
  Converted: {
    rail: 'bg-[var(--color-status-converted)]',
    border: 'border-[var(--color-status-converted)]',
    bg: 'bg-[var(--color-status-converted-bg)]',
    text: 'text-[var(--color-status-converted)]',
    dot: 'bg-[var(--color-status-converted)]',
  },
};

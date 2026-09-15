import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types';

export default function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, total, limit } = pagination;
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-ink-muted">
      <span>
        Showing <span className="font-medium text-ink">{start}–{end}</span> of{' '}
        <span className="font-medium text-ink">{total}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors duration-150 disabled:opacity-40 hover:not-disabled:bg-paper"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <span className="font-tabular font-mono">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors duration-150 disabled:opacity-40 hover:not-disabled:bg-paper"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

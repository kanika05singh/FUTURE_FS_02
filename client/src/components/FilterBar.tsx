import { SOURCE_VALUES, STATUS_VALUES, type LeadSource, type LeadStatus } from '../types';
import type { LeadQuery } from '../services/leadService';

type SortOption = NonNullable<LeadQuery['sort']>;

interface FilterBarProps {
  status: LeadStatus | 'All';
  source: LeadSource | 'All';
  sort: SortOption;
  onStatusChange: (status: LeadStatus | 'All') => void;
  onSourceChange: (source: LeadSource | 'All') => void;
  onSortChange: (sort: SortOption) => void;
}

const selectClass =
  'rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink transition-colors duration-150 focus:border-brand-500';

export default function FilterBar({
  status,
  source,
  sort,
  onStatusChange,
  onSourceChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as LeadStatus | 'All')}
        className={selectClass}
      >
        <option value="All">All statuses</option>
        {STATUS_VALUES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by source"
        value={source}
        onChange={(e) => onSourceChange(e.target.value as LeadSource | 'All')}
        className={selectClass}
      >
        <option value="All">All sources</option>
        {SOURCE_VALUES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort leads"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className={selectClass}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
      </select>
    </div>
  );
}

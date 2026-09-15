import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Lead } from '../types';
import StatusBadge from './StatusBadge';
import { STATUS_STYLES } from '../utils/statusStyles';
import { formatDate } from '../utils/format';

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDeleteRequest: (lead: Lead) => void;
}

function RowActions({ lead, onView, onEdit, onDeleteRequest }: LeadTableProps & { lead: Lead }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onView(lead)}
        aria-label={`View ${lead.name}`}
        className="rounded-md p-1.5 text-ink-faint transition-colors duration-150 hover:bg-paper hover:text-ink"
      >
        <Eye size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(lead)}
        aria-label={`Edit ${lead.name}`}
        className="rounded-md p-1.5 text-ink-faint transition-colors duration-150 hover:bg-paper hover:text-ink"
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDeleteRequest(lead)}
        aria-label={`Delete ${lead.name}`}
        className="rounded-md p-1.5 text-ink-faint transition-colors duration-150 hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function LeadTable({ leads, onView, onEdit, onDeleteRequest }: LeadTableProps) {
  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className={`cursor-pointer border-b border-border border-l-[3px] transition-colors duration-150 last:border-b-0 hover:bg-paper/70 ${STATUS_STYLES[lead.status].border}`}
              onClick={() => onView(lead)}
            >
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{lead.name}</p>
                <p className="text-xs text-ink-muted">{lead.email}</p>
              </td>
              <td className="px-4 py-3 text-ink-muted">{lead.company || '—'}</td>
              <td className="px-4 py-3 text-ink-muted">{lead.source}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                  <RowActions lead={lead} leads={leads} onView={onView} onEdit={onEdit} onDeleteRequest={onDeleteRequest} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-border md:hidden">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className={`cursor-pointer border-l-[3px] p-4 transition-colors duration-150 active:bg-paper/70 ${STATUS_STYLES[lead.status].border}`}
            onClick={() => onView(lead)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{lead.name}</p>
                <p className="text-xs text-ink-muted">{lead.email}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
              <span>
                {lead.company || 'No company'} · {lead.source}
              </span>
              <span className="font-mono">{formatDate(lead.createdAt)}</span>
            </div>
            <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
              <RowActions lead={lead} leads={leads} onView={onView} onEdit={onEdit} onDeleteRequest={onDeleteRequest} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { useState, type FormEvent } from 'react';
import { Building2, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import type { Lead } from '../types';
import { formatDate, formatDateTime } from '../utils/format';

interface LeadDetailsModalProps {
  lead: Lead;
  isAddingNote: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => Promise<void>;
}

export default function LeadDetailsModal({
  lead,
  isAddingNote,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
}: LeadDetailsModalProps) {
  const [noteText, setNoteText] = useState('');

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await onAddNote(noteText.trim());
    setNoteText('');
  };

  const sortedNotes = [...lead.notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Modal
      title="Lead details"
      onClose={onClose}
      widthClass="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onDelete}
            className="mr-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors duration-150 hover:bg-[var(--color-danger-bg)]"
          >
            <Trash2 size={15} aria-hidden="true" /> Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-paper"
          >
            <Pencil size={15} aria-hidden="true" /> Edit
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">{lead.name}</h3>
            {lead.company && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
                <Building2 size={14} aria-hidden="true" /> {lead.company}
              </p>
            )}
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg bg-paper p-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-ink">
            <Mail size={14} className="text-ink-faint" aria-hidden="true" />
            <a href={`mailto:${lead.email}`} className="transition-colors duration-150 hover:text-brand-600 hover:underline">
              {lead.email}
            </a>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-ink">
              <Phone size={14} className="text-ink-faint" aria-hidden="true" />
              {lead.phone}
            </div>
          )}
          <div className="text-ink-muted">
            Source: <span className="text-ink">{lead.source}</span>
          </div>
          <div className="text-ink-muted">
            Added: <span className="text-ink">{formatDate(lead.createdAt)}</span>
          </div>
          <div className="text-ink-muted sm:col-span-2">
            Last updated: <span className="text-ink">{formatDateTime(lead.updatedAt)}</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-ink">Follow-up notes</h4>
          <form onSubmit={handleAddNote} className="mb-3 flex gap-2">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Log a call, requirement, or next step…"
              aria-label="Add a follow-up note"
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-ink-faint transition-colors duration-150 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={isAddingNote || !noteText.trim()}
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700 disabled:opacity-50"
            >
              {isAddingNote ? 'Adding…' : 'Add'}
            </button>
          </form>

          {sortedNotes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-ink-muted">
              No notes yet. Log the first follow-up above.
            </p>
          ) : (
            <ol className="space-y-3 border-l border-border pl-4">
              {sortedNotes.map((note) => (
                <li key={note._id} className="relative animate-fade-in">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
                  <p className="text-sm text-ink">{note.text}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{formatDateTime(note.createdAt)}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Modal>
  );
}

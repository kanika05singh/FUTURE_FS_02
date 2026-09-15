import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { SOURCE_VALUES, STATUS_VALUES, type Lead, type LeadFormValues } from '../types';

interface LeadFormModalProps {
  mode: 'create' | 'edit';
  initial?: Lead;
  isSubmitting: boolean;
  onSubmit: (values: LeadFormValues, notes?: string) => Promise<void>;
  onClose: () => void;
}

type Errors = Partial<Record<keyof LeadFormValues, string>>;

const inputClass =
  'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand-500';
const labelClass = 'mb-1 block text-sm font-medium text-ink';

export default function LeadFormModal({ mode, initial, isSubmitting, onSubmit, onClose }: LeadFormModalProps) {
  const [values, setValues] = useState<LeadFormValues>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    company: initial?.company ?? '',
    source: initial?.source ?? 'Website',
    status: initial?.status ?? 'New',
  });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (!values.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = 'Enter a valid email address';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values, mode === 'create' ? notes.trim() || undefined : undefined);
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add lead' : 'Edit lead'}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="lead-form"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : mode === 'create' ? 'Add lead' : 'Save changes'}
          </button>
        </>
      }
    >
      <form id="lead-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className={inputClass}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Jane Cooper"
          />
          {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="jane@company.com"
          />
          {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className={inputClass}
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="company">
              Company
            </label>
            <input
              id="company"
              className={inputClass}
              value={values.company}
              onChange={(e) => set('company', e.target.value)}
              placeholder="Acme Inc"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="source">
              Source
            </label>
            <select
              id="source"
              className={inputClass}
              value={values.source}
              onChange={(e) => set('source', e.target.value as LeadFormValues['source'])}
            >
              {SOURCE_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className={inputClass}
              value={values.status}
              onChange={(e) => set('status', e.target.value as LeadFormValues['status'])}
            >
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {mode === 'create' && (
          <div>
            <label className={labelClass} htmlFor="notes">
              Notes <span className="font-normal text-ink-faint">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              className={`${inputClass} resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How this lead came in, initial requirements, anything worth logging now…"
            />
          </div>
        )}
      </form>
    </Modal>
  );
}

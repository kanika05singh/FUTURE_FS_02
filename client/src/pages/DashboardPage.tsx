import { Suspense, lazy, useState } from 'react';
import { CheckCircle2, Plus, Sparkles, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import LeadFormModal from '../components/LeadFormModal';
import LeadDetailsModal from '../components/LeadDetailsModal';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useLeads } from '../hooks/useLeads';
import { useToast } from '../context/ToastContext';
import * as leadService from '../services/leadService';
import type { Lead, LeadFormValues } from '../types';
import { getErrorMessage } from '../utils/format';

const StatusDistributionChart = lazy(() => import('../components/StatusDistributionChart'));

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; lead: Lead }
  | { type: 'view'; lead: Lead }
  | { type: 'delete'; lead: Lead };

export default function DashboardPage() {
  const { stats, isLoading: statsLoading, refresh: refreshStats } = useDashboardStats();
  const leadsState = useLeads();
  const { notify } = useToast();

  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const closeModal = () => setModal({ type: 'none' });

  const refreshAll = async () => {
    await Promise.all([leadsState.refresh(), refreshStats()]);
  };

  const handleCreate = async (values: LeadFormValues, notes?: string) => {
    setIsSubmitting(true);
    try {
      await leadService.createLead({ ...values, notes });
      notify('success', `${values.name} added to your leads.`);
      closeModal();
      await refreshAll();
    } catch (err) {
      notify('error', getErrorMessage(err, "Couldn't add this lead."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, values: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      await leadService.updateLead(id, values);
      notify('success', 'Lead updated.');
      closeModal();
      await refreshAll();
    } catch (err) {
      notify('error', getErrorMessage(err, "Couldn't update this lead."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    setIsSubmitting(true);
    try {
      await leadService.deleteLead(lead._id);
      notify('success', `${lead.name} deleted.`);
      closeModal();
      await refreshAll();
    } catch (err) {
      notify('error', getErrorMessage(err, "Couldn't delete this lead."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (leadId: string, text: string) => {
    setIsAddingNote(true);
    try {
      const updated = await leadService.addNote(leadId, text);
      notify('success', 'Note added.');
      setModal({ type: 'view', lead: updated });
    } catch (err) {
      notify('error', getErrorMessage(err, "Couldn't add that note."));
    } finally {
      setIsAddingNote(false);
    }
  };

  const hasActiveFilters =
    leadsState.search || leadsState.status !== 'All' || leadsState.source !== 'All';

  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-muted">An overview of every lead in your pipeline.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700"
        >
          <Plus size={16} aria-hidden="true" />
          Add lead
        </button>
      </div>

      {/* Stats */}
      {statsLoading || !stats ? (
        <div className="mt-6">
          <LoadingSpinner label="Loading stats" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total leads" value={stats.total} icon={<Users size={16} aria-hidden="true" />} accent="brand" />
            <StatCard label="New" value={stats.new} icon={<Sparkles size={16} aria-hidden="true" />} accent="new" />
            <StatCard label="Contacted" value={stats.contacted} icon={<TrendingUp size={16} aria-hidden="true" />} accent="contacted" />
            <StatCard label="Converted" value={stats.converted} icon={<CheckCircle2 size={16} aria-hidden="true" />} accent="converted" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <StatCard label="Conversion rate" value={stats.conversionRate} suffix="%" icon={<TrendingUp size={16} aria-hidden="true" />} accent="gold" />
            </div>
            <div className="lg:col-span-2">
              <Suspense
                fallback={
                  <div className="flex h-[228px] items-center justify-center rounded-xl border border-border bg-white">
                    <LoadingSpinner label="Loading chart" />
                  </div>
                }
              >
                <StatusDistributionChart stats={stats} />
              </Suspense>
            </div>
          </div>
        </>
      )}

      {/* Lead management */}
      <div className="mt-8 rounded-xl border border-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <SearchBar value={leadsState.search} onChange={leadsState.setSearch} />
          <FilterBar
            status={leadsState.status}
            source={leadsState.source}
            sort={leadsState.sort}
            onStatusChange={leadsState.setStatus}
            onSourceChange={leadsState.setSource}
            onSortChange={leadsState.setSort}
          />
        </div>

        {leadsState.isLoading ? (
          <LoadingSpinner label="Loading leads" />
        ) : leadsState.error ? (
          <div className="p-6">
            <EmptyState title="Couldn't load leads" description={leadsState.error} />
          </div>
        ) : leadsState.leads.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={hasActiveFilters ? 'No leads match your search' : 'No leads found'}
              description={
                hasActiveFilters
                  ? 'Try a different search term or clear your filters.'
                  : 'Add your first lead to get started.'
              }
              action={
                !hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'create' })}
                    className="mt-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700"
                  >
                    Add your first lead
                  </button>
                )
              }
            />
          </div>
        ) : (
          <>
            <LeadTable
              leads={leadsState.leads}
              onView={(lead) => setModal({ type: 'view', lead })}
              onEdit={(lead) => setModal({ type: 'edit', lead })}
              onDeleteRequest={(lead) => setModal({ type: 'delete', lead })}
            />
            <Pagination pagination={leadsState.pagination} onPageChange={leadsState.setPage} />
          </>
        )}
      </div>

      {modal.type === 'create' && (
        <LeadFormModal mode="create" isSubmitting={isSubmitting} onSubmit={handleCreate} onClose={closeModal} />
      )}

      {modal.type === 'edit' && (
        <LeadFormModal
          mode="edit"
          initial={modal.lead}
          isSubmitting={isSubmitting}
          onSubmit={(values) => handleUpdate(modal.lead._id, values)}
          onClose={closeModal}
        />
      )}

      {modal.type === 'view' && (
        <LeadDetailsModal
          lead={modal.lead}
          isAddingNote={isAddingNote}
          onClose={closeModal}
          onEdit={() => setModal({ type: 'edit', lead: modal.lead })}
          onDelete={() => setModal({ type: 'delete', lead: modal.lead })}
          onAddNote={(text) => handleAddNote(modal.lead._id, text)}
        />
      )}

      <ConfirmDialog
        open={modal.type === 'delete'}
        title="Delete this lead?"
        description={
          modal.type === 'delete'
            ? `This permanently removes ${modal.lead.name} and their notes. This can't be undone.`
            : ''
        }
        confirmLabel="Delete"
        isBusy={isSubmitting}
        onConfirm={() => modal.type === 'delete' && handleDelete(modal.lead)}
        onCancel={closeModal}
      />
    </DashboardLayout>
  );
}

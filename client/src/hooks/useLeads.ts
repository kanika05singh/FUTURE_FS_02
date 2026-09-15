import { useCallback, useEffect, useState } from 'react';
import type { Lead, LeadSource, LeadStatus, Pagination } from '../types';
import * as leadService from '../services/leadService';
import type { LeadQuery } from '../services/leadService';

const EMPTY_PAGINATION: Pagination = { total: 0, page: 1, limit: 10, totalPages: 1 };

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | 'All'>('All');
  const [source, setSource] = useState<LeadSource | 'All'>('All');
  const [sort, setSort] = useState<NonNullable<LeadQuery['sort']>>('newest');
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever a filter changes so results stay in view
  useEffect(() => {
    setPage(1);
  }, [search, status, source, sort]);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await leadService.getLeads({ search, status, source, sort, page, limit: 10 });
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch {
      setError("Couldn't load leads. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [search, status, source, sort, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    pagination,
    isLoading,
    error,
    search,
    status,
    source,
    sort,
    page,
    setSearch,
    setStatus,
    setSource,
    setSort,
    setPage,
    refresh: fetchLeads,
  };
}

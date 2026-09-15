import api from './api';
import type { ApiSuccess, Lead, LeadFormValues, Pagination } from '../types';

export interface LeadQuery {
  search?: string;
  status?: string;
  source?: string;
  sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc';
  page?: number;
  limit?: number;
}

export interface LeadListResult {
  leads: Lead[];
  pagination: Pagination;
}

export async function getLeads(query: LeadQuery): Promise<LeadListResult> {
  const res = await api.get<ApiSuccess<Lead[]>>('/leads', { params: query });
  return {
    leads: res.data.data,
    pagination: res.data.pagination as Pagination,
  };
}

export async function getLeadById(id: string): Promise<Lead> {
  const res = await api.get<ApiSuccess<Lead>>(`/leads/${id}`);
  return res.data.data;
}

export async function createLead(values: LeadFormValues & { notes?: string }): Promise<Lead> {
  const res = await api.post<ApiSuccess<Lead>>('/leads', values);
  return res.data.data;
}

export async function updateLead(id: string, values: Partial<LeadFormValues>): Promise<Lead> {
  const res = await api.put<ApiSuccess<Lead>>(`/leads/${id}`, values);
  return res.data.data;
}

export async function deleteLead(id: string): Promise<void> {
  await api.delete(`/leads/${id}`);
}

export async function addNote(id: string, text: string): Promise<Lead> {
  const res = await api.post<ApiSuccess<Lead>>(`/leads/${id}/notes`, { text });
  return res.data.data;
}

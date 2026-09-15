export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export type LeadSource = 'Website' | 'LinkedIn' | 'Referral' | 'Advertisement' | 'Email' | 'Other';

export interface LeadNote {
  _id: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  conversionRate: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  message: string;
}

export const STATUS_VALUES: LeadStatus[] = ['New', 'Contacted', 'Converted'];
export const SOURCE_VALUES: LeadSource[] = [
  'Website',
  'LinkedIn',
  'Referral',
  'Advertisement',
  'Email',
  'Other',
];

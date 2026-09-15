import api from './api';
import type { ApiSuccess, DashboardStats } from '../types';

export async function getStats(): Promise<DashboardStats> {
  const res = await api.get<ApiSuccess<DashboardStats>>('/dashboard/stats');
  return res.data.data;
}

import api from './api';
import type { Admin, ApiSuccess } from '../types';

export async function login(email: string, password: string): Promise<Admin> {
  const res = await api.post<ApiSuccess<Admin>>('/auth/login', { email, password });
  return res.data.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<Admin> {
  const res = await api.get<ApiSuccess<Admin>>('/auth/me');
  return res.data.data;
}

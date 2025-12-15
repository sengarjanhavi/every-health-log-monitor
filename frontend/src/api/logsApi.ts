import axios from 'axios';
import type { LogDTO, LogStats } from '../types/log';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function uploadLogs(logs: unknown[]): Promise<number> {
  const response = await axios.post(`${API_BASE_URL}/logs/upload`, {
    logs,
  });

  return response.data.inserted;
}

export async function fetchLogs(filters?: {
  severity?: string;
  from?: string;
  to?: string;
}): Promise<LogDTO[]> {
  const params: Record<string, string> = {};

  if (filters?.severity) params.severity = filters.severity;
  if (filters?.from) params.from = filters.from;
  if (filters?.to) params.to = filters.to;

  console.log('fetchLogs params =>', params);

  const response = await axios.get(`${API_BASE_URL}/logs`, { params });

  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  return [];
}

export async function fetchStats(): Promise<LogStats> {
  const response = await axios.get(`${API_BASE_URL}/logs/stats`);
  return response.data;
}

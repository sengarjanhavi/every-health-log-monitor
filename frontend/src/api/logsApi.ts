import axios from 'axios';
import type { LogDTO, LogStats } from '../types/log';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function uploadLogs(logs: unknown[]): Promise<number> {
  const response = await axios.post(`${API_BASE_URL}/logs/upload`, {
    logs,
  });

  return response.data.inserted;
}

export async function fetchLogs(params?: {
  severity?: string;
  from?: string;
  to?: string;
}): Promise<LogDTO[]> {
  const response = await axios.get(`${API_BASE_URL}/logs`, {
    params,
  });

  return response.data.data;
}

export async function fetchStats(): Promise<LogStats> {
  const response = await axios.get(`${API_BASE_URL}/logs/stats`);
  return response.data;
}

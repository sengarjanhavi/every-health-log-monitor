import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { fetchLogs, fetchStats } from '../api/logsApi';
import type { LogDTO, LogStats } from '../types/log';
import FileUpload from '../components/FileUpload';
import StatsSummary from '../components/StatsSummary';
import Filters from '../components/Filters';
import LogTable from '../components/LogTable';

type ActiveFilters = {
  severity?: string;
  from?: string;
  to?: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogDTO[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [logsData, statsData] = await Promise.all([
          fetchLogs(filters),
          fetchStats(),
        ]);
        if (cancelled) return;
        setLogs(logsData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load logs', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <Stack spacing={3}>
      <FileUpload
        onUploadSuccess={() => {
          setFilters((prev) => ({ ...prev }));
        }}
      />

      <StatsSummary stats={stats} />
      <Filters
        onChange={(newFilters) => {
          setFilters(newFilters);
        }}
      />
      <LogTable logs={logs} />
    </Stack>
  );
}

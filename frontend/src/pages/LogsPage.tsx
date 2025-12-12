import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { fetchLogs, fetchStats } from '../api/logsApi';
import type { LogDTO, LogStats } from '../types/log';
import FileUpload from '../components/FileUpload';
import StatsSummary from '../components/StatsSummary';
import Filters from '../components/Filters';
import LogTable from '../components/LogTable';

export default function LogsPage() {
  const [logs, setLogs] = useState<LogDTO[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [filters, setFilters] = useState<{
    severity?: string;
    from?: string;
    to?: string;
  }>({});

  async function refresh(updatedFilters = filters) {
    const [logsData, statsData] = await Promise.all([
      fetchLogs(updatedFilters),
      fetchStats(),
    ]);
    setLogs(logsData);
    setStats(statsData);
  }

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
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <FileUpload onUploadSuccess={refresh} />
      <StatsSummary stats={stats} />
      <Filters
        onChange={(newFilters) => {
          setFilters(newFilters);
          refresh(newFilters);
        }}
      />
      <LogTable logs={logs} />
    </Stack>
  );
}

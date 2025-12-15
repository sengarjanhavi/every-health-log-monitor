import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import type { Severity } from '../types/log';

interface FiltersProps {
  onChange: (filters: {
    severity?: Severity;
    from?: string; 
    to?: string;  
  }) => void;
}

function toISOFromLocal(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return dt.toISOString();
}

export default function Filters({ onChange }: FiltersProps) {
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [fromTime, setFromTime] = useState('00:00');

  const [toDate, setToDate] = useState('');
  const [toTime, setToTime] = useState('23:59');

  function applyFilters() {
    const payload: { severity?: Severity; from?: string; to?: string } = {};

    if (severity) payload.severity = severity;
    if (fromDate) payload.from = toISOFromLocal(fromDate, fromTime || '00:00');
    if (toDate) payload.to = toISOFromLocal(toDate, toTime || '23:59');

    console.log('Filters payload =>', payload);
    onChange(payload);
  }

  function resetFilters() {
    setSeverity('');
    setFromDate('');
    setFromTime('00:00');
    setToDate('');
    setToTime('23:59');
    onChange({});
  }

  const filtersApplied =
    Boolean(severity) || Boolean(fromDate) || Boolean(toDate);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              select
              label="Severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity | '')}
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
            </TextField>

            <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
              <TextField
                label="From date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 170 }}
              />
              <TextField
                label="From time"
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />

              <TextField
                label="To date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 170 }}
              />
              <TextField
                label="To time"
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="contained" onClick={applyFilters}>
                Apply
              </Button>
              <Button variant="text" onClick={resetFilters}>
                Reset
              </Button>
            </Stack>
          </Stack>

          {filtersApplied && (
            <Typography variant="caption" color="text.secondary">
              Filters applied
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

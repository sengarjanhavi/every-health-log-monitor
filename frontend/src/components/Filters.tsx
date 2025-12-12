import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
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

export default function Filters({ onChange }: FiltersProps) {
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [from, setFrom] = useState(''); // datetime-local string
  const [to, setTo] = useState('');   // datetime-local string

  function applyFilters() {
    onChange({
      severity: severity || undefined,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to).toISOString() : undefined,
    });
  }

  function resetFilters() {
    setSeverity('');
    setFrom('');
    setTo('');
    onChange({});
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
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

          <TextField
            label="From"
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="To"
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={applyFilters}>
                Apply
              </Button>
              <Button variant="text" onClick={resetFilters}>
                Reset
              </Button>
            </Stack>

            {(severity || from || to) && (
              <Typography variant="caption" color="text.secondary">
                Filters applied
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

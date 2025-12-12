import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from '@mui/material';
import type { LogDTO, Severity } from '../types/log';

interface LogTableProps {
  logs: LogDTO[];
}

const severityColorMap: Record<Severity, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
};

export default function LogTable({ logs }: LogTableProps) {
  if (logs.length === 0) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        No logs to display
      </Typography>
      <Typography variant="body2">
        Upload a JSON file or adjust your filters.
      </Typography>
    </Paper>
  );
}


  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} sx={{'&:nth-of-type(odd)': {backgroundColor: 'rgba(255,255,255,0.02)', }, '&:hover': {backgroundColor: 'rgba(79,140,255,0.08)',},}}>
              <TableCell>
                {new Date(log.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>{log.source}</TableCell>
              <TableCell>
                <Chip
                  label={log.severity}
                  color={severityColorMap[log.severity]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ maxWidth: 500 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                   {log.message}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

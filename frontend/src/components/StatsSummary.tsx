import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import type { LogStats, Severity } from '../types/log';
import { Skeleton } from '@mui/material';


interface StatsSummaryProps {
  stats: LogStats | null;
}

const severityColorMap: Record<Severity, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
};

export default function StatsSummary({ stats }: StatsSummaryProps) {
  if (!stats) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4} alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total logs
            </Typography>
            <Skeleton variant="text" width={60} height={40} />
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={90} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4} alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total logs
            </Typography>
            <Typography
  variant="h4"
  fontWeight={700}
  sx={{ letterSpacing: '-0.02em' }}
>
  {stats.total}
</Typography>

          </Box>

          <Stack direction="row" spacing={1}>
            {(Object.keys(stats.bySeverity) as Severity[]).map((severity) => (
              <Chip
                key={severity}
                label={`${severity}: ${stats.bySeverity[severity]}`}
                color={severityColorMap[severity]}
                size="small"
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

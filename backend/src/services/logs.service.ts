import { prisma } from '../db/prisma';
import { LogDTO, LogStats, Severity } from '../types/log';
import { anonymizePatientId } from '../utils/privacy';
import { logArraySchema, logFilterSchema } from '../validation/logSchemas';

export async function saveLogs(rawLogs: unknown): Promise<number> {
  const logs = logArraySchema.parse(rawLogs);

  const data = logs.map((log) => ({
    timestamp: new Date(log.timestamp),
    source: log.source,
    severity: log.severity,
    message: log.message,
    anonymizedPatientId: anonymizePatientId(log.patient_id),
  }));

  const result = await prisma.logEntry.createMany({
    data,
  });

  return result.count;
}

interface FilterParams {
  severity?: string;
  from?: string;
  to?: string;
}

export async function getLogs(filters: FilterParams): Promise<LogDTO[]> {
  const validated = logFilterSchema.parse(filters);

  const where: any = {};

  if (validated.severity) {
    where.severity = validated.severity;
  }

  if (validated.from || validated.to) {
    where.timestamp = {};

    if (validated.from) {
      const fromDate = new Date(validated.from);

      // Respect time if provided, otherwise use start of day
      if (!validated.from.includes('T')) {
        fromDate.setHours(0, 0, 0, 0);
      }

      where.timestamp.gte = fromDate;
    }

    if (validated.to) {
      const toDate = new Date(validated.to);

      // Respect time if provided, otherwise use end of day
      if (!validated.to.includes('T')) {
        toDate.setHours(23, 59, 59, 999);
      }

      where.timestamp.lte = toDate;
    }
  }

  const rows = await prisma.logEntry.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });

  return rows.map((row) => ({
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    source: row.source,
    severity: row.severity as Severity,
    message: row.message,
  }));
}

export async function getStats(): Promise<LogStats> {
  const [total, infoCount, warningCount, errorCount] = await Promise.all([
    prisma.logEntry.count(),
    prisma.logEntry.count({ where: { severity: 'info' } }),
    prisma.logEntry.count({ where: { severity: 'warning' } }),
    prisma.logEntry.count({ where: { severity: 'error' } }),
  ]);

  return {
    total,
    bySeverity: {
      info: infoCount,
      warning: warningCount,
      error: errorCount,
    },
  };
}

import { Request, Response } from 'express';
import { saveLogs, getLogs, getStats } from '../services/logs.service';

export async function uploadLogsHandler(req: Request, res: Response) {
  try {
    const { logs } = req.body;

    if (!logs) {
      return res.status(400).json({ error: 'Missing "logs" in request body' });
    }

    const insertedCount = await saveLogs(logs);
    return res.status(201).json({ inserted: insertedCount });
  } catch (err: any) {
    console.error('Error uploading logs:', err);

    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid log format', details: err.errors });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLogsHandler(req: Request, res: Response) {
  try {
    const { severity, from, to } = req.query;

    const logs = await getLogs({
      severity: severity as string | undefined,
      from: from as string | undefined,
      to: to as string | undefined,
    });

    return res.json({ data: logs });
  } catch (err: any) {
    console.error('Error getting logs:', err);

    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid filter parameters', details: err.errors });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStatsHandler(req: Request, res: Response) {
  try {
    const stats = await getStats();
    return res.json(stats);
  } catch (err) {
    console.error('Error getting stats:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export type Severity = 'info' | 'warning' | 'error';

export interface LogDTO {
  id: number;
  timestamp: string;
  source: string;
  severity: Severity;
  message: string;
}

export interface LogStats {
  total: number;
  bySeverity: Record<Severity, number>;
}

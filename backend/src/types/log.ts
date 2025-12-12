export type Severity = 'info' | 'warning' | 'error';

export interface RawLogInput {
  timestamp: string;
  source: string;
  severity: Severity;
  message: string;
  patient_id?: string;
}

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

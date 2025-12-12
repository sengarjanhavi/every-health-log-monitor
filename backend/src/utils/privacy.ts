import crypto from 'crypto';

/**
 * Returns a hash of the patient ID, or null if not provided.
 */
export function anonymizePatientId(patientId?: string): string | null {
  if (!patientId) return null;
  return crypto.createHash('sha256').update(patientId).digest('hex');
}

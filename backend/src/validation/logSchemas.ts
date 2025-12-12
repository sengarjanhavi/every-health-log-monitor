import { z } from 'zod';

export const severitySchema = z.enum(['info', 'warning', 'error']);

export const logInputSchema = z.object({
  timestamp: z.string().datetime(),
  source: z.string().min(1),
  severity: severitySchema,
  message: z.string().min(1),
  patient_id: z.string().optional(),
});

export const logArraySchema = z.array(logInputSchema);

export const logFilterSchema = z.object({
  severity: severitySchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

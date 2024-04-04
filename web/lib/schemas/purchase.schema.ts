import { z } from 'zod';
import { roomSchema } from './room.schema';

export const purchaseSchema = z.object({
  id: z.string(),
  room: roomSchema,
  invoiceUrl: z.string(),
});

export type Purchase = z.infer<typeof purchaseSchema>;

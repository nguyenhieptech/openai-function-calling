import { z } from 'zod';

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

export type Room = z.infer<typeof roomSchema>;

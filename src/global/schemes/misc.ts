import { z } from 'nestjs-zod/z';

export const hasId = z.object({
  id: z.string().or(z.number().int().positive()),
});

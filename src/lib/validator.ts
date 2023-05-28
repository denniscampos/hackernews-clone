import { z } from 'zod';

export const accountValidatorSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  about: z.string().max(500),
});

export type AccountFormRequest = z.infer<typeof accountValidatorSchema>;

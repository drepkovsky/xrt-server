import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

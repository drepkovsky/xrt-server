import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { hasId } from 'src/global/schemes/misc';

export const createTaskSchema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().min(1).max(256),
  isRequired: z.boolean().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().merge(hasId);

export class CreateTaskDto extends createZodDto(createTaskSchema) {}
export class UpdateTaskDto extends createZodDto(updateTaskSchema) {}

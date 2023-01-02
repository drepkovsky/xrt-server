import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { hasId } from 'src/global/schemes/misc';
import { updateQuestionnaireSchema } from 'src/studies/dto/questionnaire.dto';
import { updateTaskSchema } from 'src/studies/dto/tasks.dto';

export const updateStudySchema = z.object({
  name: z.string().min(1).max(128).optional(),
  description: z.string().min(1).max(256).optional(),
  tasks: z.array(updateTaskSchema.merge(hasId)).optional(),
  preStudyQuestionnaire: updateQuestionnaireSchema.optional(),
  postStudyQuestionnaire: updateQuestionnaireSchema.optional(),
});

export class UpdateStudyDto extends createZodDto(updateStudySchema) {}

import { Study } from '#app/studies/entities/study.entity';
import { PickType } from '@nestjs/mapped-types';

// export const updateStudySchema = z.object({
//   name: z.string().min(1).max(128).optional(),
//   description: z.string().min(1).max(256).optional(),
//   tasks: z.array(updateTaskSchema.merge(hasId)).optional(),
//   preStudyQuestionnaire: updateQuestionnaireSchema.optional(),
//   postStudyQuestionnaire: updateQuestionnaireSchema.optional(),
// });

export class UpdateStudyDto extends PickType(Study, ['name']) {}

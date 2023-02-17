import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { hasId } from 'src/global/schemes/misc';

// export const createQuestionSchema = z.object({
//   text: z.string().min(1).max(500),
//   type: z.nativeEnum(QuestionType),
// });

// export const updateQuestionSchema = createQuestionSchema.partial().merge(hasId);

export class CreateQuestionDto extends createZodDto(createQuestionSchema) {}
export class UpdateQuestionDto extends createZodDto(updateQuestionSchema) {}

// export const createQuestionnaireSchema = z.object({});
// export const updateQuestionnaireSchema = createQuestionnaireSchema
//   .extend({
//     questions: z.array(updateQuestionSchema.merge(hasId.required())).optional(),
//   })
//   .merge(hasId.partial());

export class CreateQuestionnaireDto extends createZodDto(
  createQuestionnaireSchema,
) {}

export class UpdateQuestionnaireDto extends createZodDto(
  updateQuestionnaireSchema,
) {}

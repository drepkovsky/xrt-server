import { CRUDGroup } from '#app/global/types/common.types';
import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Question } from '#app/studies/entities/question.entity';

@ValidationGroup(CRUDGroup.CREATE)
export class CreateQuestionDto extends PickType(Question, ['text', 'type']) {}

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateQuestionDto extends IntersectionType(
  PartialType(CreateQuestionDto),
  PickType(Question, ['id', 'text', 'type', 'options']),
) {}

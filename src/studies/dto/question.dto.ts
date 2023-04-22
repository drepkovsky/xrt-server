import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { CRUDGroup } from '#app/global/types/common.types';
import { Question } from '#app/studies/entities/question.entity';
import { PartialType, PickType } from '@nestjs/mapped-types';

@ValidationGroup(CRUDGroup.CREATE)
export class CreateQuestionDto extends PickType(Question, ['text', 'type']) {}

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateQuestionDto extends PartialType(PickType(Question, ['id', 'text', 'type', 'options'])) {}

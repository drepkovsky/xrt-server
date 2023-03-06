import { CRUDGroup } from '#app/global/types/common.types';
import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { Questionnaire } from '#app/studies/entities/questionnaire.entity';
import { UpdateQuestionDto } from '#app/studies/dto/question.dto';

@ValidationGroup(CRUDGroup.CREATE)
export class CreateQuestionnaireDto {}

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateQuestionnaireDto extends IntersectionType(
  PickType(Questionnaire, ['id']),
) {
  @Type(() => UpdateQuestionDto)
  @ValidateNested({ each: true })
  questions: UpdateQuestionDto[];
}

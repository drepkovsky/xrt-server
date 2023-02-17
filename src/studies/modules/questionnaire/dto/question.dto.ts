
import { CRUDGroup } from "#app/global/common.types";
import { ValidationGroup } from "#app/global/decorators/validation-group.decorator";
import { Question } from "#app/studies/modules/questionnaire/entities/question.entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/mapped-types";


@ValidationGroup(CRUDGroup.CREATE)
export class CreateQuestionDto extends PickType(Question, ['text','type']) {}

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateQuestionDto extends IntersectionType(
    PartialType(CreateQuestionDto),
    PickType(Question,['id'])
) {}

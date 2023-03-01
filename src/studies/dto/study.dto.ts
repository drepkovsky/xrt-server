import { CRUDGroup } from '#app/global/types/common.types';
import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { Study } from '#app/studies/entities/study.entity';
import { PickType } from '@nestjs/mapped-types';

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateStudyDto extends PickType(Study, [
  'name',
  'id',
  'preStudyQuestionnaire',
  'postStudyQuestionnaire',
  'tasks',
]) {}

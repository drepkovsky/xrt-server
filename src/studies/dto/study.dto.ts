import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { CRUDGroup, UpdateOperation } from '#app/global/types/common.types';
import { Study } from '#app/studies/entities/study.entity';
import { UpdateQuestionDto } from '#app/studies/modules/questionnaire/dto/question.dto';
import { UpdateTaskDto } from '#app/studies/modules/task/dto/task.dto';
import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateStudyDto {
  @IsString()
  id: string;

  @Type(() => StudyUpdatePayloadDto)
  @ValidateNested()
  @IsOptional()
  update?: StudyUpdatePayloadDto;

  @Type(() => StudyRemovePayloadDto)
  @ValidateNested()
  @IsOptional()
  remove?: StudyRemovePayloadDto;

  @Type(() => StudyAddPayloadDto)
  @ValidateNested()
  @IsOptional()
  add?: StudyAddPayloadDto;
}

export class StudyUpdatePayloadDto extends PickType(Study, ['name']) {
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  tasks?: UpdateTaskDto[];

  @ValidateNested()
  @Type(() => UpdateQuestionDto)
  postStudyQuestionnaire?: UpdateQuestionDto;

  @ValidateNested()
  @Type(() => UpdateQuestionDto)
  preStudyQuestionnaire?: UpdateQuestionDto;
}

export enum StudyResource {
  TASK = 'task',
  POST_STUDY_QUESTIONNAIRE = 'postStudyQuestionnaire',
  PRE_STUDY_QUESTIONNAIRE = 'preStudyQuestionnaire',
}
export class StudyRemovePayloadDto {
  @IsEnum(StudyResource)
  resource: UpdateOperation.REMOVE;

  @ValidateIf((o) => o.resource === StudyResource.TASK)
  @IsString()
  id?: string;
}

export class StudyAddPayloadDto {
  @IsEnum(StudyResource)
  resource: UpdateOperation.ADD;
}

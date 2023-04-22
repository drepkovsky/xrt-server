import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { CRUDGroup, UpdateOperation } from '#app/global/types/common.types';
import { UpdateQuestionDto } from '#app/studies/dto/question.dto';
import { UpdateQuestionnaireDto } from '#app/studies/dto/questionnaire.dto';
import { UpdateTaskDto } from '#app/studies/dto/task.dto';
import { Study } from '#app/studies/entities/study.entity';
import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class StudyUpdatePayloadDto extends PickType(Study, ['name', 'description']) {
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  tasks?: UpdateTaskDto[];

  @ValidateNested()
  @Type(() => UpdateQuestionnaireDto)
  postStudyQuestionnaire?: UpdateQuestionnaireDto;

  @ValidateNested()
  @Type(() => UpdateQuestionnaireDto)
  preStudyQuestionnaire?: UpdateQuestionnaireDto;
}

export enum StudyRemoveResource {
  TASK = 'task',
  QUESTIONNAIRE = 'questionnaire',
  QUESTION = 'question',
  OPTION = 'option',
}
export class StudyRemovePayloadDto {
  @IsEnum(StudyRemoveResource)
  resource: StudyRemoveResource;

  @ValidateIf(o => o.resource === StudyRemoveResource.TASK)
  @IsString()
  id: string;
}

export enum StudyAddResource {
  TASK = 'task',
  PRE_STUDY_QUESTIONNAIRE = 'preStudyQuestionnaire',
  POST_STUDY_QUESTIONNAIRE = 'postStudyQuestionnaire',
  QUESTION = 'question',
  OPTION = 'option',
}
export class StudyAddPayloadDto {
  @IsEnum(StudyAddResource)
  resource: StudyAddResource;

  @ValidateIf(o => o.resource === StudyAddResource.QUESTION)
  @IsString()
  questionnaireId?: string;

  @ValidateIf(o => o.resource === StudyAddResource.OPTION)
  @IsString()
  questionId?: string;
}

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

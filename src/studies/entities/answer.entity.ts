import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Option } from '#app/studies/modules/questionnaire/entities/option.entity';
import { Question } from '#app/studies/modules/questionnaire/entities/question.entity';
import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

@Entity()
export class Answer extends XrBaseEntity<Answer> {
  @ManyToOne(() => Question, { serializer: (q) => q.id })
  question!: Ref<Question>;

  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  @Property({ nullable: true })
  text?: string;

  @ManyToOne(() => Option)
  option?: Ref<Option>;

  @ManyToOne(() => Respondent)
  respondent?: Respondent;
}

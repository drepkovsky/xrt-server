import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Answer } from '#app/studies/modules/questionnaire/entities/answer.entity';
import { Option } from '#app/studies/modules/questionnaire/entities/option.entity';
import { Questionnaire } from '#app/studies/modules/questionnaire/entities/questionnaire.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Ref,
  Enum,
  Property,
} from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export enum QuestionType {
  SINGLE_LINE = 'single-line',
  MULTI_LINE = 'multi-line',
  NUMBER = 'number',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
}

@Entity()
export class Question extends XrBaseEntity<Question> {
  @MinLength(3)
  @MaxLength(500)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  @Property()
  text!: string;

  @ManyToOne(() => Questionnaire)
  questionnaire!: Ref<Questionnaire>;

  @Enum(() => QuestionType)
  type!: QuestionType;

  @OneToMany(() => Answer, 'question')
  answers: Collection<Answer> = new Collection<Answer>(this);

  @OneToMany(() => Option, 'question')
  options: Collection<Option> = new Collection<Option>(this);
}

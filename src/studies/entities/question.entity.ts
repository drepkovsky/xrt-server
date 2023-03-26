import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Ref,
  Enum,
  Property,
} from '@mikro-orm/core';
import {
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Answer } from '#app/studies/entities/answer.entity';
import { Questionnaire } from '#app/studies/entities/questionnaire.entity';
import { Option } from '#app/studies/entities/option.entity';
import { Type } from 'class-transformer';

export enum QuestionType {
  TEXT = 'text',
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

  @ManyToOne(() => Questionnaire, { ref: true })
  questionnaire!: Ref<Questionnaire>;

  @Enum(() => QuestionType)
  type!: QuestionType;

  @OneToMany(() => Answer, 'question')
  answers: Collection<Answer> = new Collection<Answer>(this);

  @Type(() => Option)
  @ValidateNested({ each: true, groups: [CRUDGroup.UPDATE] })
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  @OneToMany(() => Option, 'question')
  options: Collection<Option> = new Collection<Option>(this);
}

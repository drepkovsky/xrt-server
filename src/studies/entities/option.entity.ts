import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Answer } from '#app/studies/modules/questionnaire/entities/answer.entity';
import { Question } from '#app/studies/modules/questionnaire/entities/question.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
} from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

@Entity()
export class Option extends XrBaseEntity<Option> {
  @Property()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  text!: string;

  @ManyToOne(() => Question)
  question!: Ref<Question>;

  @OneToMany(() => Answer, (a) => a.option)
  answers: Collection<Answer> = new Collection<Answer>(this);
}

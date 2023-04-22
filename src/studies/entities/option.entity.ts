import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Ref } from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { Answer } from '#app/studies/entities/answer.entity';
import { Question } from '#app/studies/entities/question.entity';

@Entity()
export class Option extends XrBaseEntity<Option> {
  @Property()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  text = '';

  @ManyToOne(() => Question, { ref: true })
  question!: Ref<Question>;

  @ManyToMany(() => Answer, (a) => a.options)
  answers: Collection<Answer> = new Collection<Answer>(this);
}

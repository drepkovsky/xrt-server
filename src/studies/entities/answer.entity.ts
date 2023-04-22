import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Option } from '#app/studies/entities/option.entity';
import { Question } from '#app/studies/entities/question.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

@Entity()
export class Answer extends XrBaseEntity<Answer> {
  @ManyToOne(() => Question, { serializer: q => q.id, ref: true })
  question!: Ref<Question>;

  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  @Property({ nullable: true })
  text?: string;

  @ManyToMany(() => Option)
  options?: Collection<Option> = new Collection<Option>(this);

  @ManyToOne(() => Respondent, { ref: true })
  respondent?: Ref<Respondent>;
}

import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Question } from '#app/studies/entities/question.entity';
import { Collection, Entity, OneToMany, QueryOrder } from '@mikro-orm/core';

@Entity()
export class Questionnaire extends XrBaseEntity<Questionnaire> {
  @OneToMany(() => Question, 'questionnaire', { orphanRemoval: true, orderBy: { id: QueryOrder.ASC } })
  questions: Collection<Question> = new Collection<Question>(this);
}

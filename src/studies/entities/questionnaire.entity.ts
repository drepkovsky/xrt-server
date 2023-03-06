import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Question } from '#app/studies/modules/questionnaire/entities/question.entity';
import { Collection, Entity, OneToMany } from '@mikro-orm/core';

@Entity()
export class Questionnaire extends XrBaseEntity<Questionnaire> {
  @OneToMany(() => Question, 'questionnaire')
  questions: Collection<Question> = new Collection<Question>(this);
}

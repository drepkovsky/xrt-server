import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import { Collection, Entity, ManyToOne, OneToMany, Ref } from '@mikro-orm/core';

@Entity()
export class Respondent extends XrBaseEntity<Respondent> {
  @ManyToOne(() => Study)
  study!: Ref<Study>;

  @OneToMany(() => TaskResponse, (rt) => rt.respondent)
  responses: Collection<TaskResponse> = new Collection<TaskResponse>(this);
}

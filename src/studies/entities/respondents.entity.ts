import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Recording } from '#app/recording/entities/recording.entity';
import { Event } from '#app/studies/entities/event.entity';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
} from '@mikro-orm/core';

export enum RespondentStatus {
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  ABANDONED = 'ABANDONED',
}

@Entity()
export class Respondent extends XrBaseEntity<Respondent> {
  @ManyToOne(() => Study, { ref: true })
  study!: Ref<Study>;

  @OneToMany(() => TaskResponse, (rt) => rt.respondent)
  responses: Collection<TaskResponse> = new Collection<TaskResponse>(this);

  @OneToMany(() => Recording, (r) => r.respondent)
  recordings: Collection<Recording> = new Collection<Recording>(this);

  @OneToMany(() => Event, (e) => e.respondent)
  events: Collection<Event> = new Collection<Event>(this);

  @Enum(() => RespondentStatus)
  status: RespondentStatus = RespondentStatus.RUNNING;

  @Property({ nullable: true })
  finishedAt?: Date;

  @Property({ nullable: true })
  abandonedAt?: Date;
}

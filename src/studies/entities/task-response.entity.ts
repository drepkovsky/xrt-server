import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Task } from '#app/studies/entities/task.entity';
import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';

@Entity()
export class TaskResponse extends XrBaseEntity<TaskResponse> {
  @ManyToOne(() => Respondent, { ref: true })
  respondent!: Ref<Respondent>;

  @ManyToOne(() => Task, { ref: true })
  task!: Ref<Task>;

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ nullable: true })
  skippedAt?: Date;
}

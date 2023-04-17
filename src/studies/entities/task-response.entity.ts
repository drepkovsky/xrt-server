import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Task } from '#app/studies/entities/task.entity';
import { Entity, ManyToOne, Property, Ref, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['respondent', 'task'] })
export class TaskResponse extends XrBaseEntity<TaskResponse> {
  @ManyToOne(() => Respondent, { ref: true })
  respondent!: Ref<Respondent>;

  @ManyToOne(() => Task, { ref: true })
  task!: Ref<Task>;

  // TODO: time when task start should be different than created_at

  @Property({ nullable: true })
  completedAt?: Date;
}

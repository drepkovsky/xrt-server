import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { CRUDGroup } from '#app/global/types/common.types';
import { normalizeEventName } from '#app/global/utils/task.utils';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import {
  Collection,
  Entity,
  EventArgs,
  EventSubscriber,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
} from '@mikro-orm/core';
import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { nanoid } from 'nanoid';

@Entity()
export class Task extends XrBaseEntity<Task> {
  @Property()
  @MaxLength(255)
  @MinLength(2)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  name: string = 'New Task ' + nanoid(4);

  /**
   * Event to listen to in order to trigger this task
   * matches only lowercase alphanumeric strings withouth spaces, with dashes and underscores allowed
   */
  @Property()
  @MaxLength(255)
  @MinLength(2)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Event name must be lowercase alphanumeric with dashes',
  })
  eventName: string = normalizeEventName(this.name);

  @Property()
  @MaxLength(500)
  @MinLength(1)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  text: string = 'Enter task text here';

  @ManyToOne(() => Study)
  study!: Ref<Study>;

  @Property()
  isRequired: boolean = false;

  @OneToMany(() => TaskResponse, (r) => r.task)
  responses: Collection<TaskResponse> = new Collection<TaskResponse>(this);
}

export class TaskSubscriber implements EventSubscriber<Task> {
  getSubscribedEntities() {
    return [Task];
  }

  async beforeUpdate(args: EventArgs<Task>) {
    args.entity.eventName = normalizeEventName(args.entity.name);
  }

  async beforeCreate(args: EventArgs<Task>) {
    args.entity.eventName = normalizeEventName(args.entity.name);
  }
}

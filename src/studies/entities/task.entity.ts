import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Study } from '#app/studies/entities/study.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
} from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import { nanoid } from 'nanoid';

@Entity()
export class Task extends XrBaseEntity<Task> {
  @Property()
  @MaxLength(255)
  @MinLength(2)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  name: string = 'New Task ' + nanoid(4);

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

import { CRUDGroup } from '#app/global/types/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Questionnaire } from '#app/studies/modules/questionnaire/entities/questionnaire.entity';
import { Task } from '#app/studies/modules/task/entities/task.entity';
import { User } from '#app/users/entities/user.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { Type } from 'class-transformer';
import {
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { nanoid } from 'nanoid';
import { Property } from 'node_modules/@mikro-orm/core/decorators/Property.js';

export enum StudyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  FINISHED = 'finished',
}


@Entity()
export class Study extends XrBaseEntity<Study> {
  @Property()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional({ groups: [CRUDGroup.UPDATE, CRUDGroup.FIND, CRUDGroup.CREATE] })
  name: string = `New Study #${nanoid(4)}`;

  @Unique({
    options: { partialFilterExpression: { deletedAt: { $exists: false } } },
  })
  @Property()
  token = nanoid();

  @Property({type:'enum'})
  status: StudyStatus = StudyStatus.DRAFT;

  @ManyToOne(() => User,{serializer: (u: User) => u?.name})
  createdBy!: Ref<User>;

  @OneToMany(() => Task, 'study')
  tasks: Collection<Task> = new Collection<Task>(this);

  @ManyToOne(() => Questionnaire)
  @ValidateNested({ groups: [CRUDGroup.UPDATE] })
  preStudyQuestionnaire!: Ref<Questionnaire>;

  @ManyToOne(() => Questionnaire)
  @ValidateNested({ groups: [CRUDGroup.UPDATE] })
  postStudyQuestionnaire!: Ref<Questionnaire>;
}

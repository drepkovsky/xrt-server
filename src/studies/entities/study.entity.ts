import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { CRUDGroup } from '#app/global/types/common.types';
import { Questionnaire } from '#app/studies/modules/questionnaire/entities/questionnaire.entity';
import { Task } from '#app/studies/modules/task/entities/task.entity';
import { User } from '#app/users/entities/user.entity';
import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import {
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { nanoid } from 'nanoid';

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
  name = `New Study #${nanoid(4)}`;

  @Unique({
    options: { partialFilterExpression: { deletedAt: { $exists: false } } },
  })
  @Property()
  token = nanoid();

  @Enum(() => StudyStatus)
  status: StudyStatus = StudyStatus.DRAFT;

  @ManyToOne(() => User, { serializer: (u: User) => u?.name })
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

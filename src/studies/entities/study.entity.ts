import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { CRUDGroup } from '#app/global/types/common.types';
import { Questionnaire } from '#app/studies/entities/questionnaire.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Task } from '#app/studies/entities/task.entity';
import { User } from '#app/users/entities/user.entity';
import type { Ref } from '@mikro-orm/core';
import { Collection, Entity, Enum, ManyToOne, OneToMany, Property, QueryOrder, Unique } from '@mikro-orm/core';
import { IsOptional, MaxLength, MinLength, ValidateNested } from 'class-validator';
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

  @Property({ nullable: true })
  @MaxLength(500)
  @MinLength(0)
  @IsOptional({ groups: [CRUDGroup.UPDATE, CRUDGroup.FIND, CRUDGroup.CREATE] })
  description?: string;

  @Unique({
    options: { partialFilterExpression: { deletedAt: { $exists: false } } },
  })
  @Property()
  token = nanoid();

  @Enum(() => StudyStatus)
  status: StudyStatus = StudyStatus.DRAFT;

  @ManyToOne(() => User, { serializer: (u: User) => u?.name, ref: true })
  createdBy!: Ref<User>;

  @OneToMany(() => Task, 'study', { orderBy: { id: QueryOrder.ASC }, orphanRemoval: true })
  tasks: Collection<Task> = new Collection<Task>(this);

  @OneToMany(() => Respondent, r => r.study)
  respondents: Collection<Respondent> = new Collection<Respondent>(this);

  @ManyToOne(() => Questionnaire, { nullable: true, ref: true })
  @ValidateNested({ groups: [CRUDGroup.UPDATE] })
  preStudyQuestionnaire?: Ref<Questionnaire>;

  @ManyToOne(() => Questionnaire, { nullable: true, ref: true })
  @ValidateNested({ groups: [CRUDGroup.UPDATE] })
  postStudyQuestionnaire?: Ref<Questionnaire>;
}

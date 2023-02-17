import { CRUDGroup } from '#app/global/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { User } from '#app/users/entities/user.entity';
import { Entity, ManyToOne, Ref, Unique } from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { nanoid } from 'nanoid';
import { Property } from 'node_modules/@mikro-orm/core/decorators/Property.js';

@Entity()
export class Study extends XrBaseEntity {
  @Property()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional({ groups: [CRUDGroup.UPDATE, CRUDGroup.FIND, CRUDGroup.CREATE] })
  name!: string;

  @Unique({
    options: { partialFilterExpression: { deletedAt: { $exists: false } } },
  })
  @Property()
  token = nanoid();

  @ManyToOne(() => User)
  user!: Ref<User>;
}

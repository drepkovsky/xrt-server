import { CRUDGroup } from '#app/global/common.types';
import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Entity, Property } from '@mikro-orm/core';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

@Entity()
export class User extends XrBaseEntity {
  @Property()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional({ groups: [CRUDGroup.UPDATE, CRUDGroup.FIND] })
  name!: string;

  @Property()
  @MaxLength(255)
  @MinLength(3)
  @IsEmail()
  @IsOptional({ groups: [CRUDGroup.UPDATE, CRUDGroup.FIND] })
  email!: string;

  @Property({ hidden: true })
  @MaxLength(255)
  @MinLength(3)
  @IsOptional({ groups: [CRUDGroup.UPDATE] })
  password!: string;
}

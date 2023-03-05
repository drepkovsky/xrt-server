import WithSoftDelete from '#app/global/filters/with-soft-delete.filter';
import { CRUDGroup } from '#app/global/types/common.types';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@WithSoftDelete()
@Entity({ abstract: true })
export class XrBaseEntity<E extends { id: string }> extends BaseEntity<
  E,
  'id'
> {
  @PrimaryKey({ autoincrement: true, type: 'bigint' })
  @IsOptional({ groups: [CRUDGroup.FIND] })
  @IsString()
  @IsNotEmpty({ groups: [CRUDGroup.UPDATE] })
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property()
  deletedAt?: Date;

  /**
   * Soft remove the entity and related entities
   */
  softRemove(): void {
    this.deletedAt = new Date();
  }
}

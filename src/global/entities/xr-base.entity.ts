import { CRUDGroup } from '#app/global/common.types';
import { DateProperty } from '#app/global/decorators/date-property.decorator';
import WithSoftDelete from '#app/global/filters/with-soft-delete.filter';
import { BaseEntity, Entity, PrimaryKey } from '@mikro-orm/core';
import { IsOptional, IsNotEmpty } from 'class-validator';

@WithSoftDelete()
@Entity({ abstract: true })
export class XrBaseEntity<E extends { id: string }> extends BaseEntity<
  E,
  'id'
> {
  @PrimaryKey({ autoincrement: true, type: 'bigint' })
  @IsOptional({ groups: [CRUDGroup.FIND] })
  @IsNotEmpty({ groups: [CRUDGroup.UPDATE] })
  id!: string;

  @DateProperty({ default: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @DateProperty({})
  updatedAt: Date = new Date();

  @DateProperty()
  deletedAt?: Date;

  /**
   * Soft remove the entity and related entities
   */
  softRemove(): void {
    this.deletedAt = new Date();
  }
}

import WithSoftDelete from '#app/global/filters/with-soft-delete.filter';
import { CRUDGroup } from '#app/global/types/common.types';
import {
  BaseEntity,
  Collection,
  Entity,
  EntityData,
  EntityRepositoryType,
  OptionalProps,
  Populate,
  PrimaryKey,
  Property,
  Reference,
} from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityRepository } from '@mikro-orm/postgresql';

@WithSoftDelete()
@Entity({ abstract: true })
export class XrBaseEntity<
  E extends { id: string },
  O extends keyof EntityData<E> = never,
  Repository extends EntityRepository<E> = EntityRepository<E>,
> extends BaseEntity<E, 'id'> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | O;
  [EntityRepositoryType]?: Repository;

  @PrimaryKey({ autoincrement: true, type: 'bigint' })
  @IsOptional({ groups: [CRUDGroup.FIND] })
  @IsString()
  @IsNotEmpty({ groups: [CRUDGroup.UPDATE] })
  id!: string;

  @Property({ defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ defaultRaw: 'now()' })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  /**
   * Soft remove the entity and related entities
   */

  softRemove<Hint extends string = never>(relations: Populate<E, Hint> = []): void {
    this.deletedAt = new Date();

    if (!Array.isArray(relations)) return;

    relations.forEach(relation => {
      const [key, ...suffix] = relation.split('.');
      const value = this[key];

      if (!value) return;

      if (value instanceof Collection) {
        value.getItems().forEach(item => item.softDelete(suffix as any));
      }

      if (value instanceof Reference) {
        value.getEntity().softDelete(suffix as any);
      }

      if (value instanceof XrBaseEntity) {
        value.softRemove(suffix as any);
      }
    });
  }
}

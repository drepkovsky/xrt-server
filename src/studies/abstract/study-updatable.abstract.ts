import { EntityManager } from '@mikro-orm/core';

export interface StudyUpdatable<T, U extends { id?: string | number }> {
  update(em: EntityManager, id: string, data: U): Promise<T>;
  updateMany(em: EntityManager, data: U[]): Promise<T[]>;
}

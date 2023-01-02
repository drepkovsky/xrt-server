import { Prisma } from '@prisma/client';

export interface StudyUpdatable<T, U extends { id?: string | number }> {
  update(prisma: Prisma.TransactionClient, id: number, data: U): Promise<T>;
  updateMany(prisma: Prisma.TransactionClient, data: U[]): Promise<T[]>;
}

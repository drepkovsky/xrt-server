import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { StudyUpdatable } from 'src/studies/abstract/study-updatable.abstract';
import { UpdateTaskDto } from 'src/studies/dto/tasks.dto';

@Injectable()
export class TasksService implements StudyUpdatable<Task, UpdateTaskDto> {
  update(
    prisma: Prisma.TransactionClient,
    id: number,
    data: UpdateTaskDto,
  ): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  updateMany(
    prisma: Prisma.TransactionClient,
    data: UpdateTaskDto[],
  ): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }
}

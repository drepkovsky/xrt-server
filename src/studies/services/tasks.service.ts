import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import _omit from 'lodash/omit';
import { StudyUpdatable } from 'src/studies/abstract/study-updatable.abstract';
import { UpdateTaskDto } from 'src/studies/dto/tasks.dto';

@Injectable()
export class TasksService implements StudyUpdatable<Task, UpdateTaskDto> {
  update(
    prisma: Prisma.TransactionClient,
    id: number,
    data: UpdateTaskDto,
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: {
        ..._omit(data, ['id']),
      },
    });
  }
  updateMany(
    prisma: Prisma.TransactionClient,
    data: UpdateTaskDto[],
  ): Promise<Task[]> {
    return Promise.all(
      data.map((task) => this.update(prisma, Number(task.id), task)),
    );
  }
}

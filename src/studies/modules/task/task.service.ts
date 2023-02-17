import { StudyUpdatable } from '#app/studies/abstract/study-updatable.abstract';
import { UpdateTaskDto } from '#app/studies/modules/task/dto/task.dto';
import { Task } from '#app/studies/modules/task/entities/task.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService implements StudyUpdatable<Task, UpdateTaskDto> {
  update(em: EntityManager, dto: UpdateTaskDto): Promise<Task> {
    return em.upsert(Task, {
      ...dto,
    });
  }
  async updateMany(em: EntityManager, dtos: UpdateTaskDto[]): Promise<Task[]> {
    await em.upsertMany(Task, { ...dtos });
    // TODO: probably do this better
    return em.find(Task, {
      id: dtos.map((t) => t.id),
    });
  }
}

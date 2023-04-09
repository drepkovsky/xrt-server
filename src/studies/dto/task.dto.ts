import { Task } from '#app/studies/entities/task.entity';
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';

export class CreateTaskDto extends PickType(Task, ['name', 'text']) {}

export class UpdateTaskDto extends IntersectionType(
  PartialType(CreateTaskDto),
  PickType(Task, ['id']),
) {}

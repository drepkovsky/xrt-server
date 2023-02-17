import { TaskService } from '#app/studies/modules/task/task.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}

import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';

@Module({
  providers: [StudiesService],
})
export class StudiesModule {}

import { Module } from '@nestjs/common';
import { StudiesService } from './services/studies.service';

@Module({
  providers: [StudiesService],
})
export class StudiesModule {}

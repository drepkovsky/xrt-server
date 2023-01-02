import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesResolver } from './studies.resolver';

@Module({
  providers: [StudiesResolver, StudiesService],
})
export class StudiesModule {}

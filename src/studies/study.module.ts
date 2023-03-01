import { StudyController } from '#app/studies/study.controller';
import { StudyGateway } from '#app/studies/study.gateway';
import { StudyService } from '#app/studies/study.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [StudyService, StudyGateway],
  controllers: [StudyController],
})
export class StudyModule {}

import { StudyUpdaterService } from '#app/studies/services/study-updater.service';
import { StudyService } from '#app/studies/services/study.service';
import { StudyController } from '#app/studies/study.controller';
import { StudyGateway } from '#app/studies/study.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [StudyService, StudyGateway, StudyUpdaterService],
  controllers: [StudyController],
})
export class StudyModule {}

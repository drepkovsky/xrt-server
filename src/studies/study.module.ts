import { RecordingModule } from '#app/recording/recording.module';
import { RespondentScheduler } from '#app/studies/providers/respondent.scheduler';
import { ResultsService } from '#app/studies/providers/results.service';
import { StudyUpdaterService } from '#app/studies/providers/study-updater.service';
import { StudyService } from '#app/studies/providers/study.service';
import { StudyController } from '#app/studies/study.controller';
import { StudyGateway } from '#app/studies/study.gateway';
import { Module } from '@nestjs/common';

@Module({
  imports: [RecordingModule],
  providers: [
    StudyService,
    StudyGateway,
    StudyUpdaterService,
    ResultsService,
    RespondentScheduler,
  ],
  controllers: [StudyController],
})
export class StudyModule {}

import { StudyController } from '#app/studies/study.controller';
import { StudyService } from '#app/studies/StudyService';
import { Module } from '@nestjs/common';

@Module({
  providers: [StudyService],
  controllers: [StudyController],
})
export class StudyModule {}

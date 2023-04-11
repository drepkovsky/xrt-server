import { RecordingType } from '#app/recording/entities/recording.entity';
import { RecordingService } from '#app/recording/recording.service';
import { RespondentStatus } from '#app/studies/entities/respondents.entity';
import { Study } from '#app/studies/entities/study.entity';
import { StudyService } from '#app/studies/services/study.service';
import {
  ResolvedRespondent,
  RespondentResults,
  RespondentsStatistics,
} from '#app/studies/types/results.types';
import { User } from '#app/users/entities/user.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  constructor(
    private readonly studyService: StudyService,
    private readonly recordingService: RecordingService,
  ) {}

  async getRespondents(em: EntityManager, studyId: string, user: User) {
    // TODO: add pagination
    const respondents = await em.findOne(
      Study,
      {
        id: studyId,
        createdBy: user.id,
      },
      {
        populate: ['respondents.responses', 'respondents.recordings', 'tasks'],
      },
    );

    const statistics: RespondentsStatistics = {
      abandoned: 0,
      completed: 0,
      running: 0,
      total: 0,
      totalTime: 0,
      totalTimeCompleted: 0,
    };

    const resolvedRespondents: ResolvedRespondent[] = [];

    // TODO: calculate statistics in one query, not in JS
    for (const respondent of respondents.respondents.getItems()) {
      const time = respondent.finishedAt
        ? (respondent.finishedAt.getTime() - respondent.createdAt.getTime()) /
          1000
        : 0;
      statistics.total++;
      statistics.totalTime += time;
      if (respondent.status === RespondentStatus.ABANDONED) {
        statistics.abandoned++;
      } else if (respondent.status === RespondentStatus.FINISHED) {
        statistics.completed++;
        statistics.totalTimeCompleted += time;
      } else {
        statistics.running++;
      }

      const recordings: ResolvedRespondent['recordings'] = [];
      for (const recording of respondent.recordings.getItems()) {
        recordings.push({
          type: recording.type,
          url: await this.recordingService.getUrl(recording),
        });
      }

      resolvedRespondents.push({
        ...respondent.toJSON(),
        recordings,
      });
    }

    return {
      respondents: resolvedRespondents,
      statistics,
    } satisfies RespondentResults;
  }
}

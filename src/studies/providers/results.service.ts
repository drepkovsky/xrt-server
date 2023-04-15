import { RecordingService } from '#app/recording/recording.service';
import { RespondentStatus } from '#app/studies/entities/respondents.entity';
import { Study } from '#app/studies/entities/study.entity';
import {
  ResolvedRespondent,
  RespondentResults,
  RespondentsStatistics as RespondentStatistics,
  StudyResults,
} from '#app/studies/types/results.types';
import { User } from '#app/users/entities/user.entity';
import { EntityManager, Loaded } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  constructor(private readonly recordingService: RecordingService) {}

  async getResults(
    em: EntityManager,
    studyId: string,
    user: User,
  ): Promise<StudyResults> {
    const study = await em.findOne(
      Study,
      {
        id: studyId,
        createdBy: user.id,
      },
      {
        populate: ['respondents.responses', 'respondents.recordings', 'tasks'],
      },
    );

    if (!study) {
      throw new Error('Study not found');
    }

    const respondents = await this.getRespondents(study);

    return {
      respondents,
    } satisfies StudyResults;
  }

  async getRespondents(
    study: Loaded<
      Study,
      'respondents.responses' | 'respondents.recordings' | 'tasks'
    >,
  ): Promise<RespondentResults> {
    const statistics: RespondentStatistics = {
      abandoned: 0,
      completed: 0,
      running: 0,
      total: 0,
      totalTime: 0,
      totalTimeCompleted: 0,
    };

    const resolvedRespondents: ResolvedRespondent[] = [];

    // TODO: calculate statistics in one query, not in JS
    for (const respondent of study.respondents.getItems()) {
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
        recording.location &&
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
      data: resolvedRespondents,
      statistics,
    } satisfies RespondentResults;
  }
}

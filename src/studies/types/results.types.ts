import { RecordingType } from '#app/recording/entities/recording.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { EntityDTO } from 'node_modules/@mikro-orm/core/typings.js';

export type RespondentsStatistics = {
  total: number;

  completed: number;
  running: number;
  abandoned: number;

  totalTime: number;
  totalTimeCompleted: number;
};

export type ResolvedRespondent = Omit<EntityDTO<Respondent>, 'recordings'> & {
  recordings: {
    type: RecordingType;
    url: string;
  }[];
};

export type RespondentResults = {
  data: ResolvedRespondent[];
  statistics: RespondentsStatistics;
};

export type StudyResults = {
  respondents: RespondentResults;
};

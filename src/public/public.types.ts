import type { Study } from '#app/studies/entities/study.entity';

declare module 'express-session' {
  interface SessionData {
    runs: Record<string, RunData>;
  }
}

declare module 'express' {
  interface Request {
    publicStudy?: Study;
  }
}

export type RunData = {
  studyId: string;
  respondentId: string;
  tasksDone: string[];
  currentTaskId?: string;
};

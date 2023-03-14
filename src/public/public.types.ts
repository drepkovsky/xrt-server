declare module 'express-session' {
  interface SessionData {
    runs: Map<string, RunData>;
  }
}

export type RunData = {
  studyId: string;
  respondentId: string;
  tasksDone: string[];
  currentTaskId?: string;
};

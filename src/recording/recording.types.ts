import { RecordingType } from '#app/recording/entities/recording.entity';

export enum RecordingJob {
  PROCESS = 'recording:process',
}

export interface RecordingJobProcessPayload {
  type: RecordingType;
  token: string;
  location: string;
}

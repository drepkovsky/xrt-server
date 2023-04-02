import { QueueName } from '#app/config/queue.config';
import {
  Recording,
  RecordingType,
} from '#app/recording/entities/recording.entity';
import {
  RecordingJob,
  RecordingJobProcessPayload,
} from '#app/recording/recording.types';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { EntityManager, Ref } from '@mikro-orm/core';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class RecordingService {
  constructor(
    @InjectQueue(QueueName.RECORDING) private readonly recordingsQueue: Queue,
  ) {}
  createForRespondent(em: EntityManager, respondent: Ref<Respondent>) {
    const recordings: Recording[] = [];

    for (const type of Object.values(RecordingType)) {
      const r = new Recording({
        respondent: respondent,
        type: type,
      });
      em.persist(r);
      recordings.push(r);
    }

    return recordings;
  }

  async addToQueue(jobData: RecordingJobProcessPayload) {
    return this.recordingsQueue.add(RecordingJob.PROCESS, jobData, {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}

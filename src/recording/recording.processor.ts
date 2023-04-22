import { QueueName } from '#app/config/queue.config';
import type { RecordingJobProcessPayload } from '#app/recording/recording.types';
import { RecordingJob } from '#app/recording/recording.types';
import { MikroORM } from '@mikro-orm/core';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor({ name: QueueName.RECORDING })
export class RecordingProcessor {
  private readonly logger = new Logger(RecordingProcessor.name);
  constructor(
    // private readonly recordingService: RecordingService,
    // private readonly ffmpegService: FfmpegService,
    private readonly orm: MikroORM,
  ) {}
  /**
   * Merges all video/audio files for given namespace into one file and saves it to storage
   */
  @Process(RecordingJob.PROCESS)
  async process(job: Job<RecordingJobProcessPayload>) {
    console.log(job.data);
    // const chunks = await this.recordingStorageService.getChunkStreams(
    //   job.data.namespace,
    // );
    // console.log(chunks);
    // // convert raw stream to processed stream with ffmpeg
    // // const concatStream = await this.ffmpegService.concat(job.data.type, urls);
    // const concatStream = await this.ffmpegService.concatChunks(
    //   job.data.type,
    //   chunks,
    // );
    // // save processed stream to storage
    // const { promise, location } = this.recordingStorageService.saveStream(
    //   job.data.namespace,
    //   StreamMediaState.PROCESSED,
    //   concatStream,
    // );
    // // update recording entity with location of processed file
    // this.orm.em.transactional(async (em) => {
    //   const token = this.recordingService.parseNamespace(
    //     job.data.namespace,
    //   ).token;
    //   const { recording, tokenType } = await this.recordingService.findByToken(
    //     em,
    //     token,
    //   );
    //   recording[tokenType].location = location;
    //   em.persist(recording);
    // });
    // // wait for stream to finish saving
    // await promise;
    // this.logger.debug(
    //   `Recording for ${job.data.namespace} processed and saved to ${location}`,
    // );
  }
  // DEBUGGING
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}...`);
  }
  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(`Completed job ${job.id} of type ${job?.name}`);
  }
  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error?.message}`,
    );
  }
  @OnQueueError()
  onError(job: Job, error: Error) {
    this.logger.error(
      `Error in job ${job.id} of type ${job.name}: ${error?.message}`,
    );
  }
}

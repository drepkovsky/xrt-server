import ffmpeg from '@bropat/fluent-ffmpeg';
import { promisify } from 'node:util';
import { Logger } from '@nestjs/common';

const [{ path: ffmpegPath }, { path: ffprobePath }] = await Promise.all(
  process.env.NODE_ENV === 'development'
    ? [import('node-ffmpeg-installer'), import('@ffprobe-installer/ffprobe')]
    : [{ path: null }, { path: null }],
);

const logger = new Logger('ffmpeg');

export interface FfmpegCommand extends ffmpeg.FfmpegCommand {
  logger: ffmpeg.FfmpegCommandLogger;
  ffprobeAsync(index: number, options?: string[]): Promise<ffmpeg.FfprobeData>;
  ffprobeAll(options?: string[]): Promise<ffmpeg.FfprobeData[]>;
}

export type AudioVideoFilter = ffmpeg.AudioVideoFilter;

export default function getFfmpegCommand(...args: Parameters<typeof ffmpeg>) {
  const command = ffmpeg(...args) as FfmpegCommand;

  command
    .on('start', (cmd: string) => {
      logger.log(`Running command: ${cmd}`);
    })
    .on('codecData', (codecObject: any) => {
      logger.log(`Codec:`, codecObject);
    });

  if (ffmpegPath) {
    command.setFfmpegPath(ffmpegPath);
  }

  if (ffprobePath) {
    command.setFfprobePath(ffprobePath);
  }

  command.logger = {
    debug(message: string, ...params: any[]) {
      logger.debug(message, ...params);
    },
    info(message: string, ...params: any[]) {
      logger.log(message, ...params);
    },
    warn(message: string, ...params: any[]) {
      logger.warn(message, ...params);
    },
    error(message: string, ...params: any[]) {
      logger.error(message, ...params);
    },
  };

  command.ffprobeAsync = promisify(command.ffprobe).bind(command);

  command.ffprobeAll = function ffprobeAll(options: string[] = []) {
    return Promise.all(
      this._inputs.map((_, index) => this.ffprobeAsync(index, options)),
    );
  };

  return command;
}

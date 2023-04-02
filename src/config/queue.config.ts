import { ConfigKey } from '#app/config/config.types';
import { BullModuleOptions } from '@nestjs/bull';
import { registerAs } from '@nestjs/config';

export type QueueConfig = BullModuleOptions;

export enum QueueName {
  RECORDING = 'queue:recording',
}

export default registerAs(
  ConfigKey.QUEUE,
  (): QueueConfig => ({
    redis: {
      // we are not reusing the redis config here because we want to use a different redis client
      name: 'bull',
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
  }),
);

import { ConfigKey } from '#app/config/config.types';
import {
  RedisModuleOptions,
  RedisModuleOptionsMulti,
} from '#app/global/redis/redis.types';
import { registerAs } from '@nestjs/config';

export type RedisConfig = RedisModuleOptionsMulti;

export enum RedisClient {
  SESSION = 'session',
}

export default registerAs(ConfigKey.REDIS, (): RedisConfig => {
  const baseConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
  } satisfies RedisModuleOptions;

  const config = [
    {
      name: RedisClient.SESSION,
    },
  ] satisfies RedisConfig;

  return config.map((c) => ({ ...c, ...baseConfig }));
});

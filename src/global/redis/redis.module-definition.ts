import type { RedisModuleOptions, RedisModuleOptionsMulti } from '#app/global/redis/redis.types';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: RedisConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: REDIS_MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE: REDIS_MODULE_ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE: REDIS_MODULE_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RedisModuleOptions | RedisModuleOptionsMulti>().build();

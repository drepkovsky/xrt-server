import { registerClients } from '#app/global/redis/redis-clients.provider';
import { RedisConfigurableModuleClass } from '#app/global/redis/redis.module-definition';
import { RedisService } from '#app/global/redis/redis.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [registerClients(), RedisService],
  exports: [RedisService],
})
export class RedisModule extends RedisConfigurableModuleClass {}

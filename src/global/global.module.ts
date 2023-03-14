import { RedisModule } from '#app/global/redis/redis.module';
import { Module } from '@nestjs/common/decorators/index.js';

@Module({
  imports: [RedisModule],
  exports: [RedisModule],
})
export class GlobalModule {}

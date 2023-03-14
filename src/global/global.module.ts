import { ConfigKey } from '#app/config/config.types';
import { RedisModule } from '#app/global/redis/redis.module';
import { Module } from '@nestjs/common/decorators/index.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(ConfigKey.REDIS),
      imports: [ConfigModule],
    }),
  ],
  exports: [RedisModule],
})
export class GlobalModule {}

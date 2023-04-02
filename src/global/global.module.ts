import { ConfigKey } from '#app/config/config.types';
import { FfmpegModule } from '#app/global/ffmpeg/ffmpeg.module';
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
    FfmpegModule,
  ],
  exports: [RedisModule, FfmpegModule],
})
export class GlobalModule {}

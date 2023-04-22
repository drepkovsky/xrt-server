import { ConfigKey } from '#app/config/config.types';
import { RedisModule } from '#app/global/redis/redis.module';
import { DriverType, StorageService } from '@codebrew/nestjs-storage';
import { Module } from '@nestjs/common/decorators/index.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';

@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get(ConfigKey.REDIS),
      imports: [ConfigModule],
    }),
  ],
  exports: [RedisModule],
})
export class GlobalModule {
  constructor(private readonly storageService: StorageService) {
    this.storageService.registerDriver(DriverType.S3, AmazonWebServicesS3Storage);
  }
}

import { AuthModule } from '#app/auth/auth.module';
import { ConfigKey } from '#app/config/config.types';
import { configs } from '#app/config/main';
import { OrmConfig } from '#app/config/orm.config';
import { RedisClient } from '#app/config/redis.config';
import { SessionConfig } from '#app/config/session.config';
import { StorageConfig } from '#app/config/storage.config';
import { GlobalModule } from '#app/global/global.module';
import { XrValidationPipe } from '#app/global/pipe/xr-validation.pipe';
import { RedisService } from '#app/global/redis/redis.service';
import { PublicModule } from '#app/public/public.module';
import { RecordingModule } from '#app/recording/recording.module';
import { StudyModule } from '#app/studies/study.module';
import { UsersModule } from '#app/users/users.module';
import { StorageModule } from '@codebrew/nestjs-storage';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import RedisStore from 'connect-redis';
import expressSession from 'express-session';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { QueueConfig } from './config/queue.config.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      load: configs,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<OrmConfig>(ConfigKey.ORM),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<QueueConfig>(ConfigKey.QUEUE),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.url, '..', 'storage'),
      serveRoot: '/storage',
    }),
    MulterModule.register(),
    StorageModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<StorageConfig>(ConfigKey.STORAGE),
      }),
    }),
    GlobalModule,
    AuthModule,
    StudyModule,
    UsersModule,
    PublicModule,
    RecordingModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: XrValidationPipe,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    const sessionConfig = this.configService.get<SessionConfig>(
      ConfigKey.SESSION,
    );

    const client = this.redisService.getClient(RedisClient.SESSION);
    const redisStore = new RedisStore({ client });

    consumer
      .apply(
        expressSession({
          ...sessionConfig,
          store: redisStore,
        }),
      )
      .forRoutes('*');
  }
}

import { AuthModule } from '#app/auth/auth.module';
import { ConfigKey } from '#app/config/config.types';
import { configs } from '#app/config/main';
import { OrmConfig } from '#app/config/orm.config';
import { GlobalModule } from '#app/global/global.module';
import { XrValidationPipe } from '#app/global/pipe/xr-validation.pipe';
import { PublicModule } from '#app/public/public.module';
import { StudyModule } from '#app/studies/study.module';
import { UsersModule } from '#app/users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
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
    GlobalModule,
    AuthModule,
    StudyModule,
    UsersModule,
    PublicModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: XrValidationPipe,
    },
  ],
})
export class AppModule {}

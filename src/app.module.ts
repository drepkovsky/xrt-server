import { configs } from '#app/config/main';
import { XrValidationPipe } from '#app/global/pipe/xr-validation.pipe';
import { PublicModule } from '#app/public/public.module';
import { StudiesModule } from '#app/studies/studies.module';
import { UsersModule } from '#app/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    StudiesModule,
    UsersModule,
    ConfigModule.forRoot({
      load: configs,
    }),
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

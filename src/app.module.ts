import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { configs } from 'src/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudiesModule } from './studies/studies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    StudiesModule,
    UsersModule,
    ConfigModule.forRoot({
      load: configs,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}

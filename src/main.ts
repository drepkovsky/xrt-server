import { AppModule } from '#app/app.module';
import { AppConfig } from '#app/config/app.config';
import { ConfigKey } from '#app/config/config.types';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { LoggerErrorInterceptor } from 'nestjs-pino/LoggerErrorInterceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService: ConfigService = app.get(ConfigService);

  const appConfig = configService.get<AppConfig>(ConfigKey.APP);

  await app.listen(appConfig.port).then(() => {
    logger.log(`Listening on port ${appConfig.port}`, 'NestApplication');
  });
}
bootstrap();

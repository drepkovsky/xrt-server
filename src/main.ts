import { AppModule } from '#app/app.module';
import type { AppConfig } from '#app/config/app.config';
import { ConfigKey } from '#app/config/config.types';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  const configService: ConfigService = app.get(ConfigService);

  const appConfig = configService.get<AppConfig>(ConfigKey.APP);

  await app.listen(appConfig.port).then(async () => {
    // print port app is running on
    const url = await app.getUrl();
    const port = url.split(':').at(-1);
    logger.log(`Listening on port ${port}`, 'NestApplication');
  });
}
bootstrap();

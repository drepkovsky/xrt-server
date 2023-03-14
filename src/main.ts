import { AppModule } from '#app/app.module';
import { AppConfig } from '#app/config/app.config';
import { ConfigKey } from '#app/config/config.types';
import { WsExceptionFilter } from '#app/global/exceptions/ws-exception-filter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService: ConfigService = app.get(ConfigService);

  const appConfig = configService.get<AppConfig>(ConfigKey.APP);

  await app.listen(appConfig.port).then(() => {
    Logger.log(`Listening on port ${appConfig.port}`, 'NestApplication');
  });
}
bootstrap();

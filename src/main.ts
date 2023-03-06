import { AppModule } from '#app/app.module';
import { WsExceptionFilter } from '#app/global/exceptions/ws-exception-filter';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  await app.listen(3000);
}
bootstrap();

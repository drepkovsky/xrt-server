import { PublicController } from '#app/public/public.controller';
import { PublicService } from '#app/public/public.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}

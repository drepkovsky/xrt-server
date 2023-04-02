import { PublicController } from '#app/public/public.controller';
import { PublicService } from '#app/public/public.service';
import { RecordingModule } from '#app/recording/recording.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [RecordingModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}

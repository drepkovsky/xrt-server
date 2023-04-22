import { RecordingService } from '#app/recording/recording.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RecordingService],
  exports: [RecordingService],
})
export class RecordingModule {}

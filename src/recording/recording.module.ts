import { QueueName } from '#app/config/queue.config';
import { RecordingProcessor } from '#app/recording/recording.processor';
import { RecordingService } from '#app/recording/recording.service';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.RECORDING,
    }),
    ConfigModule,
  ],
  providers: [RecordingService, RecordingProcessor],
  exports: [RecordingService],
})
export class RecordingModule {}

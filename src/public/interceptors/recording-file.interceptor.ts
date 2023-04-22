import { DiskStorageEngine } from '#app/global/storage/disk-storage.engine';
import { StorageService } from '@codebrew/nestjs-storage';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/index.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class RecordingFileInterceptor implements NestInterceptor<any, any> {
  constructor(private storageService: StorageService) {}

  public intercept(context: ExecutionContext, next: CallHandler<any>): any {
    const Interceptor = FileInterceptor('file', {
      storage: new DiskStorageEngine({
        disk: this.storageService.getDisk(),
        filename: (req, file, cb) => {
          const token = req.params.recording;
          cb(null, `/recordings/${token}.${file.mimetype.split('/')[1]}`);
        },
      }),
      limits: {
        fileSize: 50000000,
      },
    });
    const fileInterceptor = new Interceptor();

    return fileInterceptor.intercept(context, next);
  }
}

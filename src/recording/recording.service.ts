import type { AppConfig } from '#app/config/app.config';
import { ConfigKey } from '#app/config/config.types';
import type { StorageConfig } from '#app/config/storage.config';
import {
  Recording,
  RecordingType,
} from '#app/recording/entities/recording.entity';
import type { Respondent } from '#app/studies/entities/respondents.entity';
import { DriverType, StorageService } from '@codebrew/nestjs-storage';
import type { EntityManager, Ref } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class RecordingService {
  private readonly appConfig: AppConfig;
  private readonly storageConfig: StorageConfig;

  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.getOrThrow<AppConfig>(ConfigKey.APP);
    this.storageConfig = this.configService.getOrThrow<StorageConfig>(
      ConfigKey.STORAGE,
    );
  }

  async getUrl(recording: Recording): Promise<string> {
    const disk = this.storageService.getDisk();

    if (!recording.location) return null;

    if (this.storageConfig.default === DriverType.LOCAL) {
      // return join(this.appConfig.baseUrl, 'storage', recording.location);
      return new URL(
        join('storage', recording.location),
        this.appConfig.baseUrl,
      ).href;
    }

    return (await disk.getSignedUrl(recording.location)).signedUrl;
  }

  createForRespondent(em: EntityManager, respondent: Ref<Respondent>) {
    const recordings: Recording[] = [];

    for (const type of Object.values(RecordingType)) {
      const r = new Recording({
        respondent: respondent,
        type: type,
      });
      em.persist(r);
      recordings.push(r);
    }

    return recordings;
  }
}

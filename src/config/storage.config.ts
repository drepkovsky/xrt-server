import { ConfigKey } from '#app/config/config.types';
import {
  DiskLocalConfigType,
  DiskS3ConfigType,
  DriverType,
  StorageModuleOptions,
} from '@codebrew/nestjs-storage';
import { registerAs } from '@nestjs/config';
import { join } from 'node:path';

export type StorageConfig = StorageModuleOptions;

export default registerAs(ConfigKey.STORAGE, (): StorageConfig => {
  return {
    default: process.env.DEFAULT_STORAGE || DriverType.LOCAL,
    disks: {
      [DriverType.LOCAL]: {
        driver: DriverType.LOCAL,
        config: {
          root: join(process.cwd(), 'storage'),
        } satisfies DiskLocalConfigType,
      },
      [DriverType.S3]: {
        driver: DriverType.S3,
        config: {
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION,
          endpoint: process.env.S3_ENDPOINT,
          key: process.env.S3_ACCESS_KEY_ID,
          secret: process.env.S3_ACCESS_KEY_SECRET,
        } satisfies DiskS3ConfigType,
      },
    },
  } satisfies StorageConfig;
});

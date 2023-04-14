import { ConfigKey } from '#app/config/config.types';
import {
  DiskS3ConfigType,
  DriverType,
  StorageModuleOptions,
} from '@codebrew/nestjs-storage';
import { registerAs } from '@nestjs/config';

export type StorageConfig = StorageModuleOptions;

export default registerAs(
  ConfigKey.STORAGE,
  (): StorageConfig =>
    ({
      default: DriverType.S3,
      disks: {
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
    } satisfies StorageConfig),
);

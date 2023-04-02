import { ConfigKey } from '#app/config/config.types';
import {
  DiskLocalConfigType,
  DiskS3ConfigType,
  DriverType,
  StorageModuleOptions,
} from '@codebrew/nestjs-storage';
import { registerAs } from '@nestjs/config';

export type StorageConfig = StorageModuleOptions;
export enum StorageDisk {
  LOCAL = 'local',
}

export type S3DiskConfig = DiskS3ConfigType & {
  cloudFrontUrl: string;
  cloudFrontKeyPairId: string;
  cloudFrontPrivateKey: string;
};

export default registerAs(
  ConfigKey.STORAGE,
  (): StorageConfig =>
    ({
      default: StorageDisk.LOCAL,
      disks: {
        [StorageDisk.LOCAL]: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd() + '/storage',
          } satisfies DiskLocalConfigType,
        },
      },
    } satisfies StorageConfig),
);

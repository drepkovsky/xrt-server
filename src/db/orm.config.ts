import type { Options } from '@mikro-orm/core';
import dotenv from 'dotenv';

dotenv.config();

// This function is used to generate the file name for the migration

const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  ensureDatabase: true,
  migrations: {
    path: 'dist/db/migrations',
    pathTs: 'src/db/migrations',
    snapshot: false,
  },
};

export default config;

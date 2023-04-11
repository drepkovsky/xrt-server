import { ConfigKey } from '#app/config/config.types';
import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
  baseUrl: string;
};

export default registerAs<AppConfig>(ConfigKey.APP, () => ({
  port: parseInt(process.env.PORT, 10),
  baseUrl: process.env.BASE_URL,
}));

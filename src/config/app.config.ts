import { ConfigKey } from '#app/config/config.types';
import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
};

export default registerAs<AppConfig>(ConfigKey.APP, () => ({
  port: parseInt(process.env.PORT, 10),
}));

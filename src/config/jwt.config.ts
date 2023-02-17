import { ConfigKey } from '#app/config/config.types';
import { registerAs } from '@nestjs/config';

export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export default registerAs<JwtConfig>(ConfigKey.JWT, () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

import { registerAs } from '@nestjs/config';

export const JWT_CONFIG_KEY = 'jwt';
export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export default registerAs<JwtConfig>(JWT_CONFIG_KEY, () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

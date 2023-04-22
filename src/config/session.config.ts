import { ConfigKey } from '#app/config/config.types';
import { registerAs } from '@nestjs/config';
import type { SessionOptions } from 'express-session';

export type SessionConfig = SessionOptions;

export default registerAs(ConfigKey.SESSION, (): SessionConfig => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: null, // this have to be set async
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  };
});

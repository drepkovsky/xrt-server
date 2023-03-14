import { ConfigKey } from '#app/config/config.types';
import { registerAs } from '@nestjs/config';
import { SessionOptions } from 'express-session';

export interface SessionConfig extends SessionOptions {}

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

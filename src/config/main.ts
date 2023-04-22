import appConfig from '#app/config/app.config';
import jwtConfig from '#app/config/jwt.config';
import ormConfig from '#app/config/orm.config';
import redisConfig from '#app/config/redis.config';
import sessionConfig from '#app/config/session.config';
import storageConfig from '#app/config/storage.config';

export const configs = [
  jwtConfig,
  ormConfig,
  appConfig,
  redisConfig,
  sessionConfig,
  storageConfig,
];

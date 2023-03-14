import jwtConfig from '#app/config/jwt.config';
import ormConfig from '#app/config/orm.config';
import redisConfig from '#app/config/redis.config';
import sessionConfig from '#app/config/session.config';

export const configs = [jwtConfig, ormConfig, redisConfig, sessionConfig];

import { ConfigKey } from '#app/config/config.types';
import ormConfig from '#app/db/orm.config';
import { Options } from '@mikro-orm/core';
import { registerAs } from '@nestjs/config';

export type OrmConfig = Options;

export default registerAs(ConfigKey.ORM, (): OrmConfig => ormConfig);

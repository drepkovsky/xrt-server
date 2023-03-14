import { Redis, RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  onClientReady?(client: Redis): void;
}
export type RedisModuleOptionsMulti = (Omit<RedisModuleOptions, 'name'> & { name: string })[];

export type RedisClientsMap = Map<string, Redis>;

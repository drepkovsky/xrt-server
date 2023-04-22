import { REDIS_CLIENTS_TOKEN, REDIS_DEFAULT_CLIENT_NAME } from '#app/global/redis/redis.constants';
import { REDIS_MODULE_OPTIONS_TOKEN } from '#app/global/redis/redis.module-definition';
import type { RedisClientsMap, RedisModuleOptions, RedisModuleOptionsMulti } from '#app/global/redis/redis.types';
import { Redis } from 'ioredis';

function buildClient({ url, name, onClientReady, ...options }: RedisModuleOptions) {
  const client = url ? new Redis(url) : new Redis(options);
  onClientReady && onClientReady(client);
  return client;
}

export function registerClients() {
  return {
    provide: REDIS_CLIENTS_TOKEN,
    useFactory: (options: RedisModuleOptions | RedisModuleOptionsMulti) => {
      const clients: RedisClientsMap = new Map<string, Redis>();

      const optionsArr = Array.isArray(options) ? options : [options];

      optionsArr.forEach(option => {
        const name = option.name || REDIS_DEFAULT_CLIENT_NAME;
        if (clients.has(name)) {
          throw new Error(`Redis client with name "${name}" already exists!`);
        }
        clients.set(name, buildClient(option));
      });

      return clients;
    },
    inject: [REDIS_MODULE_OPTIONS_TOKEN],
  };
}

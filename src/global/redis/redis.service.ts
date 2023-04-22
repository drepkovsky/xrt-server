import {
  REDIS_CLIENTS_TOKEN,
  REDIS_DEFAULT_CLIENT_NAME,
} from '#app/global/redis/redis.constants';
import type { RedisClientsMap } from '#app/global/redis/redis.types';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENTS_TOKEN) private readonly clients: RedisClientsMap,
  ) {}

  getClient(name?: string) {
    const client = this.clients.get(name || REDIS_DEFAULT_CLIENT_NAME);

    if (!client) {
      throw new Error(`Redis client with name "${name}" not found!`);
    }

    return client;
  }

  getAllClients() {
    return this.clients;
  }
}

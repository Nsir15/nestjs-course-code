import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
  ) {}

  async listGet(key: string): Promise<string[]> {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(
    key: string,
    list: string[],
    ttl: number | null,
    batchSize = 1000,
  ) {
    for (let i = 0; i < list.length; i += batchSize) {
      const batch = list.slice(i, i + batchSize);
      await this.redisClient.lPush(key, batch);
    }
    if (ttl) {
      this.redisClient.expire(key, ttl);
    }
  }
}

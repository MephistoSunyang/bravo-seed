import { IObject, Logger } from '@bravo/core';
import { Injectable } from '@nestjs/common';
// tslint:disable-next-line: no-implicit-dependencies
import Redis from 'ioredis';
import _ from 'lodash';
import { RedisService } from 'nestjs-redis';
import { ICacheItem } from '../interfaces';

@Injectable()
export class CacheService {
  public client: Redis.Redis;

  constructor(public readonly redisService: RedisService, name?: string) {
    this.client = redisService.getClient(name);
  }

  private getKey(module: string, key: string): string {
    return `${module}-${key}`;
  }

  public async set(module: string, key: string, value: any, expiresIn?: number): Promise<void> {
    const redisKey = this.getKey(module, key);
    const redisItem: ICacheItem = {
      type: typeof value,
      content: typeof value === 'object' ? JSON.stringify(value) : _.toString(value),
    };
    const redisValue = JSON.stringify(redisItem);
    const result = expiresIn
      ? await this.client.set(redisKey, redisValue, 'EX', expiresIn)
      : await this.client.set(redisKey, redisValue);
    if (result === null) {
      Logger.error('redis set exception!', 'RedisModule RedisService Exception');
      throw new Error('redis set exception!');
    }
  }

  public async get<IValue = IObject>(module: string, key: string): Promise<IValue | null> {
    const redisKey = this.getKey(module, key);
    const redisValue = await this.client.get(redisKey);
    if (redisValue === null) {
      return null;
    }
    try {
      const redisItem: ICacheItem = JSON.parse(redisValue);
      const { type, content } = redisItem;
      let value: any = null;
      switch (type) {
        case 'string':
          value = content;
          break;
        case 'number':
          value = _.toNumber(content);
          break;
        case 'object':
          value = JSON.parse(content);
          break;
        case 'boolean':
          value = content === 'true';
          break;
        default:
          break;
      }
      return value;
    } catch (error) {
      Logger.error('redis get exception!', 'RedisModule RedisService Exception');
      throw new Error('redis get exception!');
    }
  }

  public async remove(module: string, key: string): Promise<void> {
    const redisKey = this.getKey(module, key);
    await this.client.set(redisKey, '', 'PX', 1);
  }
}

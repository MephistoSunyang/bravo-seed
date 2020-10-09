import { Provider } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { RedisService } from 'nestjs-redis';
import { CacheService } from './services';

export const getCacheServiceProvider = (name?: string): Provider => {
  const provider: FactoryProvider = {
    provide: getCacheServiceToken(name),
    inject: [RedisService],
    useFactory: (redisService) => {
      return new CacheService(redisService, name);
    },
  };
  return provider;
};

export const getCacheServiceToken = (name?: string) =>
  name ? `${name}CacheServiceToken` : CacheService.name;

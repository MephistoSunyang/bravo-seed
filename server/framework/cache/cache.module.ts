import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import _ from 'lodash';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { getCacheServiceProvider } from './cache.utils';

@Global()
@Module({})
export class CacheModule {
  public static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
    const modules = [RedisModule.register(options)];
    const providers: Provider[] = [];
    if (_.isArray(options)) {
      _.each(options, ({ name }) => {
        providers.push(getCacheServiceProvider(name));
      });
    } else {
      providers.push(getCacheServiceProvider());
    }
    return {
      module: CacheModule,
      imports: [...modules],
      providers,
      exports: [...modules, ...providers],
    };
  }
}

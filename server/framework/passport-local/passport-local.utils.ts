import { FactoryProvider } from '@nestjs/common';
import { UserService } from '../system';
import { IPassportLocalOptions } from './interfaces';
import { LocalStrategyService } from './services/local-strategy.service';

export const getPassportLocalStrategyServiceProvider = (
  options: IPassportLocalOptions,
): FactoryProvider => {
  return {
    provide: LocalStrategyService,
    inject: [UserService],
    useFactory: (userService) => {
      return new LocalStrategyService(options, userService);
    },
  };
};

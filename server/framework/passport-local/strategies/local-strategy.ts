import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CryptoUserService } from '../../crypto';
import { UserEntity } from '../../system';
import { ILocalStrategyOptions } from '../interfaces';
import { getPassportLocalStrategyOptionsToken } from '../passport-local.utils';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(getPassportLocalStrategyOptionsToken())
    protected readonly options: ILocalStrategyOptions,
    @InjectRepositoryService(UserEntity)
    private readonly userRepositoryService: RepositoryService<UserEntity>,
    private readonly cryptoUserService: CryptoUserService,
  ) {
    super(options);
  }

  public async validate(username: string, password: string): Promise<UserEntity> {
    const encodePassword = this.cryptoUserService.encodePassword(password);
    const user = await this.userRepositoryService.findOne({ username, password: encodePassword });
    if (!user) {
      throw new UnauthorizedException(
        `Not found user by username "${username}" or password invalid!`,
      );
    }
    return user;
  }
}

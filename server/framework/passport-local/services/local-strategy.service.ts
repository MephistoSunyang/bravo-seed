import { IRequest } from '@bravo/core';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserModel, UserService } from '../../system';
import { IPassportLocalOptions } from '../interfaces';

export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(
    protected readonly options: IPassportLocalOptions,
    private readonly userService: UserService,
  ) {
    super(options);
  }

  public async validate(request: IRequest, username: string, password: string): Promise<UserModel> {
    const userModel = await this.userService.getLocalUserByUsernameAndPassword(username, password);
    if (!userModel) {
      throw new UnauthorizedException(
        `Not found user by username "${username}" or password invalid!`,
      );
    }
    return userModel;
  }
}

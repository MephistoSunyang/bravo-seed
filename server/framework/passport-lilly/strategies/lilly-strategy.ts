import { InjectRepositoryService, IRequest, RepositoryService } from '@bravo/core';
import { BadRequestException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IProfile, OIDCStrategy } from 'passport-azure-ad';
import { UserEntity, UserProviderEntity, USER_PROVIDER_TYPE_ENUM } from '../../system';
import { ILillyStrategyOptions } from '../interfaces';
import { getPassportLillyStrategyOptionsToken } from '../passport-lilly.utils';

export class LillyStrategy extends PassportStrategy(OIDCStrategy) {
  constructor(
    @Inject(getPassportLillyStrategyOptionsToken())
    protected readonly options: ILillyStrategyOptions,
    @InjectRepositoryService(UserEntity)
    private readonly userRepositoryService: RepositoryService<UserEntity>,
    @InjectRepositoryService(UserProviderEntity)
    private readonly userProviderRepositoryService: RepositoryService<UserProviderEntity>,
  ) {
    super(options);
  }

  public async validate(request: IRequest, profile: IProfile): Promise<number> {
    const email = profile._json.email;
    if (!email) {
      throw new BadRequestException(`Not found email by validate!`);
    }
    const userProvider = await this.userProviderRepositoryService.findOne({
      type: USER_PROVIDER_TYPE_ENUM.LILLY,
      key: email,
    });
    if (!userProvider) {
      throw new BadRequestException(`Not found userProvider by email "${email}"!`);
    }
    const user = await this.userRepositoryService.findOne(userProvider.userId);
    if (!user) {
      throw new BadRequestException(`Not found user by id "${userProvider.userId}"!`);
    }
    return user.id;
  }
}

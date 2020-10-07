import { InjectRepositoryService, IRequest, RepositoryService } from '@bravo/core';
import { BadRequestException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IProfile, OIDCStrategy } from 'passport-azure-ad';
import { UserProviderEntity, USER_PROVIDER_TYPE_ENUM } from '../../system';
import { IAzureStrategyOptions } from '../interfaces';
import { getPassportAzureStrategyOptionsToken } from '../passport-azure.utils';

export class AzureStrategy extends PassportStrategy(OIDCStrategy) {
  constructor(
    @Inject(getPassportAzureStrategyOptionsToken())
    protected readonly options: IAzureStrategyOptions,
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
    const userProvider = await this.userProviderRepositoryService.findOne(
      { type: USER_PROVIDER_TYPE_ENUM.AZURE, key: email },
      { relations: ['user'] },
    );
    if (!userProvider) {
      throw new BadRequestException(`Not found userProvider by email "${email}"!`);
    }
    if (!userProvider.user) {
      throw new BadRequestException(`Not found user by id "${userProvider.userId}"!`);
    }
    return userProvider.user.id;
  }
}

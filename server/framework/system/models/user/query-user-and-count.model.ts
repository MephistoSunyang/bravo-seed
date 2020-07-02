import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryUserModel } from './query-user.model';
import { UserModel } from './user.model';

@QueryValidatorModel(UserModel)
export class QueryUserAndCountModel extends IntersectionType(
  QueryUserModel,
  BaseQueryAndCountModel,
) {}

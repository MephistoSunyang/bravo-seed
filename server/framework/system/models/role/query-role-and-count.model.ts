import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryRoleModel } from './query-role.model';
import { RoleModel } from './role.model';

@QueryValidatorModel(RoleModel)
export class QueryRoleAndCountModel extends IntersectionType(
  QueryRoleModel,
  BaseQueryAndCountModel,
) {}

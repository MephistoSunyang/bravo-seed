import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryRoleGroupModel } from './query-role-group.model';
import { RoleGroupModel } from './role-group.model';

@QueryValidatorModel(RoleGroupModel)
export class QueryRoleGroupAndCountModel extends IntersectionType(
  QueryRoleGroupModel,
  BaseQueryAndCountModel,
) {}

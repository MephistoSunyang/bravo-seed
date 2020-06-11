import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryRoleGroupModel } from './query-role-group.model';

export class QueryRoleGroupAndCountModel extends IntersectionType(
  QueryRoleGroupModel,
  BaseQueryAndCountModel,
) {}

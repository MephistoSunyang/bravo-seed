import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryRoleModel } from './query-role.model';

export class QueryRoleAndCountModel extends IntersectionType(
  QueryRoleModel,
  BaseQueryAndCountModel,
) {}

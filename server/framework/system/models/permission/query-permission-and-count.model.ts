import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { PermissionModel } from './permission.model';
import { QueryPermissionModel } from './query-permission.model';

@QueryValidatorModel(PermissionModel)
export class QueryPermissionAndCountModel extends IntersectionType(
  QueryPermissionModel,
  BaseQueryAndCountModel,
) {}

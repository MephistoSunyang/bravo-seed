import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryActionModel } from './query-action.model';

export class QueryActionAndCountModel extends IntersectionType(
  QueryActionModel,
  BaseQueryAndCountModel,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryMenuModel } from './query-menu.model';

export class QueryMenuAndCountModel extends IntersectionType(
  QueryMenuModel,
  BaseQueryAndCountModel,
) {}

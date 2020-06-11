import { IntersectionType } from '@nestjs/swagger';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { QueryConfigModel } from './query-config.model';

export class QueryConfigAndCountModel extends IntersectionType(
  QueryConfigModel,
  BaseQueryAndCountModel,
) {}

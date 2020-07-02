import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { ConfigModel } from './config.model';
import { QueryConfigModel } from './query-config.model';

@QueryValidatorModel(ConfigModel)
export class QueryConfigAndCountModel extends IntersectionType(
  QueryConfigModel,
  BaseQueryAndCountModel,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { ActionModel } from './action.model';
import { QueryActionModel } from './query-action.model';

@QueryValidatorModel(ActionModel)
export class QueryActionAndCountModel extends IntersectionType(
  QueryActionModel,
  BaseQueryAndCountModel,
) {}

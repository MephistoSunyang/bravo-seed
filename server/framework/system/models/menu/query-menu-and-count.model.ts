import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { MenuModel } from './menu.model';
import { QueryMenuModel } from './query-menu.model';

@QueryValidatorModel(MenuModel)
export class QueryMenuAndCountModel extends IntersectionType(
  QueryMenuModel,
  BaseQueryAndCountModel,
) {}

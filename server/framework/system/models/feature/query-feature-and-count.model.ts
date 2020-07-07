import { IntersectionType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BaseQueryAndCountModel } from '../../base-query-and-count.model';
import { FeatureModel } from './feature.model';
import { QueryFeatureModel } from './query-feature.model';

@QueryValidatorModel(FeatureModel)
export class QueryFeatureAndCountModel extends IntersectionType(
  QueryFeatureModel,
  BaseQueryAndCountModel,
) {}

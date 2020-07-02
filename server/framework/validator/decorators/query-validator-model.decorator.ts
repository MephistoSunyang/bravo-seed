import { getBravoFrameworkMetadataArgsStorage } from '../../metadata-storage';
import { VALIDATOR_GROUP_ENUM } from '../enums';

export const QueryValidatorModel = (modelClass: Function): ClassDecorator => {
  return (model: Function) => {
    getBravoFrameworkMetadataArgsStorage().validator.models.push({
      target: model,
      group: `${modelClass.name}${VALIDATOR_GROUP_ENUM.QUERY}`,
    });
  };
};

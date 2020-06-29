import { getBravoFrameworkMetadataArgsStorage } from '../../metadata-storage';
import { VALIDATOR_GROUP_ENUM } from '../enums';

export const CreatedValidatorModel = (): ClassDecorator => {
  return (model: Function) => {
    getBravoFrameworkMetadataArgsStorage().validator.models.push({
      target: model,
      groups: [VALIDATOR_GROUP_ENUM.CREATED],
    });
  };
};

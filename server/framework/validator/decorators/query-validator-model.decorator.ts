import { getBravoFrameworkMetadataArgsStorage } from '../../metadata-storage';
import { VALIDATOR_GROUP_ENUM } from '../enums';

export const QueryValidatorModel = (): ClassDecorator => {
  return (model: Function) => {
    getBravoFrameworkMetadataArgsStorage().validator.models.push({
      target: model,
      groups: [VALIDATOR_GROUP_ENUM.QUERY],
    });
  };
};

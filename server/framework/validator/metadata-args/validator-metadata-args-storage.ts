import _ from 'lodash';
import { IValidatorModelMetadataArgs } from '../interfaces';

export class ValidatorMetadataArgsStorage {
  public models: IValidatorModelMetadataArgs[] = [];

  public getValidatorGroupsByTarget(target: Function | string): string[] {
    const models = _.filter(this.models, { target });
    const groups = _.chain(models).map('group').uniq().value();
    return groups;
  }
}

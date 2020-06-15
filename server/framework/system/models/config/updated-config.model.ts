import { OmitType } from '@nestjs/swagger';
import { CreatedConfigModel } from './created-config.model';

export class UpdatedConfigModel extends OmitType(CreatedConfigModel, []) {}

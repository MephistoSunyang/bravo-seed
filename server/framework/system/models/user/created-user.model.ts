import { OmitType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { UserModel } from './user.model';

export class CreatedUserModel extends OmitType(UserModel, BASE_MODEL_FIELD_CONFIG) {}

import { OmitType, PartialType } from '@nestjs/swagger';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { UserModel } from './user.model';

export class QueryUserModel extends PartialType(OmitType(UserModel, BASE_MODEL_FIELD_CONFIG)) {}

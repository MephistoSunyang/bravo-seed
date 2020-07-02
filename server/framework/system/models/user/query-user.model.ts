import { OmitType, PartialType } from '@nestjs/swagger';
import { QueryValidatorModel } from '../../../validator';
import { BASE_MODEL_FIELD_CONFIG } from '../../configs';
import { UserModel } from './user.model';

@QueryValidatorModel(UserModel)
export class QueryUserModel extends PartialType(OmitType(UserModel, BASE_MODEL_FIELD_CONFIG)) {}

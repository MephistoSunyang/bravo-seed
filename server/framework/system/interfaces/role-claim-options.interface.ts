import { ROLE_CLAIM_TYPE_ENUM } from '../enums';
import { RoleModel } from '../models';
import { IClaimOptions } from './claim-options.interface';

export type IRoleClaimOptions = IClaimOptions<RoleModel, ROLE_CLAIM_TYPE_ENUM>;

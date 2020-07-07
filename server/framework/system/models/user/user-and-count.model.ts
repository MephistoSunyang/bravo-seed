import { DataAndCountModelType } from '../../../validator';
import { UserModel } from './user.model';

export class UserAndCountModel extends DataAndCountModelType(UserModel) {}

import { DataAndCountModelType } from '../../../validator';
import { PermissionModel } from './permission.model';

export class PermissionAndCountModel extends DataAndCountModelType(PermissionModel) {}

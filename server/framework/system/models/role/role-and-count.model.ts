import { ApiProperty } from '@nestjs/swagger';
import { RoleModel } from './role.model';

export class RoleAndCountModel {
  @ApiProperty({ type: () => [RoleModel] })
  public roles: RoleModel[];

  @ApiProperty()
  public count: number;
}

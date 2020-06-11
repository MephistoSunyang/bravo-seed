import { ApiProperty } from '@nestjs/swagger';
import { RoleGroupModel } from './role-group.model';

export class RoleGroupAndCountModel {
  @ApiProperty({ type: () => [RoleGroupModel] })
  public roleGroups: RoleGroupModel[];

  @ApiProperty()
  public count: number;
}

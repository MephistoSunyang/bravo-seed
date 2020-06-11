import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from './user.model';

export class UserAndCountModel {
  @ApiProperty({ type: () => [UserModel] })
  public users: UserModel[];

  @ApiProperty()
  public count: number;
}

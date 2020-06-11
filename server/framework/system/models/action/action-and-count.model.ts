import { ApiProperty } from '@nestjs/swagger';
import { ActionModel } from './action.model';

export class ActionAndCountModel {
  @ApiProperty({ type: () => [ActionModel] })
  public actions: ActionModel[];

  @ApiProperty()
  public count: number;
}

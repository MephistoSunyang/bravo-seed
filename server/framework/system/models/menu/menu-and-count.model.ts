import { ApiProperty } from '@nestjs/swagger';
import { MenuModel } from './menu.model';

export class MenuAndCountModel {
  @ApiProperty({ type: () => [MenuModel] })
  public menus: MenuModel[];

  @ApiProperty()
  public count: number;
}

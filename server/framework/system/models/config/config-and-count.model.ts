import { ApiProperty } from '@nestjs/swagger';
import { ConfigModel } from './config.model';

export class ConfigAndCountModel {
  @ApiProperty({ type: () => [ConfigModel] })
  public configs: ConfigModel[];

  @ApiProperty()
  public count: number;
}

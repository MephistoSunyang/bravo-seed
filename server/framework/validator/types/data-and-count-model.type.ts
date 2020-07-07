import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function DataAndCountModelType<IModel>(modelClass: Type<IModel>) {
  abstract class DataAndCountModelTypeClass {
    @ApiProperty({ type: () => [modelClass] })
    public data: IModel[];

    @ApiProperty()
    public count: number;
  }
  return DataAndCountModelTypeClass;
}

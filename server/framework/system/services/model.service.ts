import { Injectable } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

@Injectable()
export class ModelService {
  public mapper<IModel>(
    model: ClassType<IModel>,
    entities: any[],
    options?: ClassTransformOptions,
  ): IModel[];
  public mapper<IModel>(
    model: ClassType<IModel>,
    entity: any,
    options?: ClassTransformOptions,
  ): IModel;
  public mapper<IModel>(
    model: ClassType<IModel>,
    entityOrEntities: any[] | any,
    options?: ClassTransformOptions,
  ): IModel[] | IModel {
    const modelOrModels = plainToClass(model, entityOrEntities, options);
    return modelOrModels;
  }
}

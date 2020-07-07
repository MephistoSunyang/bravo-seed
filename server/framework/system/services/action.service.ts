import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, Like } from 'typeorm';
import { ActionEntity } from '../entities';
import {
  ActionAndCountModel,
  ActionModel,
  CreatedActionModel,
  QueryActionAndCountModel,
  QueryActionModel,
  UpdatedActionModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepositoryService(ActionEntity)
    private readonly actionRepositoryService: RepositoryService<ActionEntity>,
    private readonly modelService: ModelService,
  ) {}

  private mapper(actions: ActionEntity[]): ActionModel[];
  private mapper(action: ActionEntity): ActionModel;
  private mapper(actionOrActions: ActionEntity[] | ActionEntity): ActionModel[] | ActionModel {
    return this.modelService.mapper(ActionModel, actionOrActions);
  }

  private getWhere(queries: QueryActionModel): FindConditions<ActionEntity> {
    const where: FindConditions<ActionEntity> = {};
    if (queries.code) {
      where.code = Like(queries.code);
    }
    if (queries.name) {
      where.name = Like(queries.name);
    }
    if (queries.method) {
      where.method = queries.method;
    }
    if (queries.path) {
      where.path = Like(queries.path);
    }
    if (queries.comment) {
      where.comment = Like(queries.comment);
    }
    return where;
  }

  public async _getActionsAndCount(
    queries: QueryActionAndCountModel,
  ): Promise<ActionAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [actions, count] = await this.actionRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const actionModels = this.mapper(actions);
    return { data: actionModels, count };
  }

  public async _getActions(queries: QueryActionModel): Promise<ActionModel[]> {
    const where = this.getWhere(queries);
    const actions = await this.actionRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const actionModels = this.mapper(actions);
    return actionModels;
  }

  public async _getActionById(id: number): Promise<ActionModel> {
    const action = await this.getActionByIdOrFail(id);
    const actionModel = this.mapper(action);
    return actionModel;
  }

  public async _createAction(createdActionModel: CreatedActionModel): Promise<ActionModel> {
    const action = await this.actionRepositoryService.insert(createdActionModel);
    const actionModel = this.mapper(action);
    return actionModel;
  }

  public async _updateActionById(
    id: number,
    updatedActionModel: UpdatedActionModel,
  ): Promise<ActionModel> {
    const action = await this.actionRepositoryService.update(id, updatedActionModel);
    if (!action) {
      throw new NotFoundException(`Not found system action by id "${id}"!`);
    }
    const actionModel = this.mapper(action);
    return actionModel;
  }

  public async _deleteActionById(id: number): Promise<ActionModel> {
    const action = await this.actionRepositoryService.delete(id);
    if (!action) {
      throw new NotFoundException(`Not found action by id "${id}"!`);
    }
    const actionModel = this.mapper(action);
    return actionModel;
  }

  public async getActionByIdOrFail(id: number): Promise<ActionEntity> {
    const action = await this.actionRepositoryService.findOne({ id });
    if (!action) {
      throw new NotFoundException(`Not found system action by id "${id}"!`);
    }
    return action;
  }

  public async getActionByCodeOrFail(code: string): Promise<ActionEntity> {
    const action = await this.actionRepositoryService.findOne({ code });
    if (!action) {
      throw new NotFoundException(`Not found system action by code "${code}"!`);
    }
    return action;
  }
}

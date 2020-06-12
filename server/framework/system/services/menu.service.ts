import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, Like } from 'typeorm';
import { MenuEntity } from '../entities';
import {
  CreatedMenuModel,
  MenuAndCountModel,
  MenuModel,
  QueryMenuAndCountModel,
  QueryMenuModel,
  UpdatedMenuModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepositoryService(MenuEntity)
    private readonly menuRepositoryService: RepositoryService<MenuEntity>,
    private readonly modelService: ModelService,
  ) {}

  private mapper(menus: MenuEntity[]): MenuModel[];
  private mapper(menu: MenuEntity): MenuModel;
  private mapper(menuOrMenus: MenuEntity[] | MenuEntity): MenuModel[] | MenuModel {
    return this.modelService.mapper(MenuModel, menuOrMenus);
  }

  private getWhere(queries: QueryMenuModel): FindConditions<MenuEntity> {
    const where: FindConditions<MenuEntity> = {};
    if (queries.group) {
      where.group = Like(queries.group);
    }
    if (queries.level) {
      where.level = queries.level;
    }
    if (queries.parentId) {
      where.parentId = queries.parentId;
    }
    if (queries.sort) {
      where.sort = queries.sort;
    }
    if (queries.name) {
      where.name = Like(queries.name);
    }
    if (queries.visible) {
      where.visible = queries.visible;
    }
    if (queries.comment) {
      where.comment = Like(queries.comment);
    }
    return where;
  }

  public async _getMenusAndCount(queries: QueryMenuAndCountModel): Promise<MenuAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [menus, count] = await this.menuRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const menuModels = this.mapper(menus);
    return { menus: menuModels, count };
  }

  public async _getMenus(queries: QueryMenuModel): Promise<MenuModel[]> {
    const where = this.getWhere(queries);
    const menus = await this.menuRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const menuModels = this.mapper(menus);
    return menuModels;
  }

  public async _getMenuById(id: number): Promise<MenuModel> {
    const menu = await this.getMenuByIdOrFail(id);
    const menuModel = this.mapper(menu);
    return menuModel;
  }

  public async _createMenu(createdMenuModel: CreatedMenuModel): Promise<MenuModel> {
    const menu = await this.menuRepositoryService.insert(createdMenuModel);
    const menuModel = this.mapper(menu);
    return menuModel;
  }

  public async _updateMenuById(id: number, updatedMenuModel: UpdatedMenuModel): Promise<MenuModel> {
    const menu = await this.menuRepositoryService.update(id, updatedMenuModel);
    if (!menu) {
      throw new NotFoundException(`Not found system menu by id "${id}"!`);
    }
    const menuModel = this.mapper(menu);
    return menuModel;
  }

  public async _deleteMenuById(id: number): Promise<MenuModel> {
    const menu = await this.menuRepositoryService.delete(id);
    if (!menu) {
      throw new NotFoundException(`Not found menu by id "${id}"!`);
    }
    const menuModel = this.mapper(menu);
    return menuModel;
  }

  public async getMenuByIdOrFail(id: number): Promise<MenuEntity> {
    const menu = await this.menuRepositoryService.findOne(id);
    if (!menu) {
      throw new NotFoundException(`Not found system menu by id "${id}"!`);
    }
    return menu;
  }
}
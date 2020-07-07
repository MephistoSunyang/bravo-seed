import { InjectRepositoryService, RepositoryService } from '@bravo/core';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { FindConditions, Like } from 'typeorm';
import { CryptoConfigService } from '../../crypto';
import { ConfigEntity } from '../entities';
import { CONFIG_CONTENT_TYPE_ENUM } from '../enums';
import {
  ConfigAndCountModel,
  ConfigModel,
  CreatedConfigModel,
  QueryConfigAndCountModel,
  QueryConfigModel,
  UpdatedConfigModel,
} from '../models';
import { ModelService } from './model.service';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepositoryService(ConfigEntity)
    private readonly configRepositoryService: RepositoryService<ConfigEntity>,
    private readonly modelService: ModelService,
    private readonly cryptoConfigService: CryptoConfigService,
  ) {}

  private mapper(configs: ConfigEntity[]): ConfigModel[];
  private mapper(config: ConfigEntity): ConfigModel;
  private mapper(configOrConfigs: ConfigEntity[] | ConfigEntity): ConfigModel[] | ConfigModel {
    if (_.isArray(configOrConfigs)) {
      const models = this.modelService.mapper(ConfigModel, configOrConfigs);
      models.forEach((model) => {
        model.content = this.parseContent(model.content, model.contentEncrypted);
      });
      return models;
    } else {
      const model = this.modelService.mapper(ConfigModel, configOrConfigs);
      model.content = this.parseContent(model.content, model.contentEncrypted);
      return model;
    }
  }

  private getContentType(content: any) {
    if (_.isString(content)) {
      return CONFIG_CONTENT_TYPE_ENUM.STRING;
    }
    if (_.isNaN(content) || _.toNumber(content) !== Infinity) {
      return CONFIG_CONTENT_TYPE_ENUM.NUMBER;
    }
    if (_.isBoolean(content) || content === 'true' || content === 'false') {
      return CONFIG_CONTENT_TYPE_ENUM.BOOLEAN;
    }
    if (_.isObject(content)) {
      return CONFIG_CONTENT_TYPE_ENUM.OBJECT;
    }
    return CONFIG_CONTENT_TYPE_ENUM.UNKNOWN;
  }

  private getStringifyContent(content: any): string {
    const contentType = this.getContentType(content);
    switch (contentType) {
      case CONFIG_CONTENT_TYPE_ENUM.STRING:
        return content;
      case CONFIG_CONTENT_TYPE_ENUM.NUMBER:
        return _.toString(content);
      case CONFIG_CONTENT_TYPE_ENUM.BOOLEAN:
        return _.toString(content);
      case CONFIG_CONTENT_TYPE_ENUM.OBJECT:
        return JSON.stringify(content);
      default:
        return _.toString(content);
    }
  }

  private parseStringifyContent<IContent = any>(content: any): IContent {
    const contentType = this.getContentType(content);
    switch (contentType) {
      case CONFIG_CONTENT_TYPE_ENUM.STRING:
        return content;
      case CONFIG_CONTENT_TYPE_ENUM.NUMBER:
        return _.toNumber(content) as any;
      case CONFIG_CONTENT_TYPE_ENUM.BOOLEAN:
        return (content === 'true') as any;
      case CONFIG_CONTENT_TYPE_ENUM.OBJECT:
        return JSON.parse(content);
      default:
        return content;
    }
  }

  private getContent(content: any, contentEncrypted: boolean): string {
    return contentEncrypted
      ? this.cryptoConfigService.encodeContent(this.getStringifyContent(content))
      : this.getStringifyContent(content);
  }

  private parseContent<IContent = any>(stringifyContent: any, contentEncrypted: boolean): IContent {
    return contentEncrypted
      ? this.parseStringifyContent<IContent>(
          this.cryptoConfigService.decodeContent(stringifyContent),
        )
      : this.parseStringifyContent<IContent>(stringifyContent);
  }

  private getWhere(queries: QueryConfigModel): FindConditions<ConfigEntity> {
    const where: FindConditions<ConfigEntity> = {};
    if (queries.code) {
      where.code = Like(queries.code);
    }
    if (queries.name) {
      where.name = Like(queries.name);
    }
    if (queries.comment) {
      where.comment = Like(queries.comment);
    }
    return where;
  }

  public async _getConfigsAndCount(
    queries: QueryConfigAndCountModel,
  ): Promise<ConfigAndCountModel> {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [configs, count] = await this.configRepositoryService.findAndCount({
      where,
      order: { modifiedDate: 'DESC' },
      skip,
      take,
    });
    const configModels = this.mapper(configs);
    return { data: configModels, count };
  }

  public async _getConfigs(queries: QueryConfigModel): Promise<ConfigModel[]> {
    const where = this.getWhere(queries);
    const configs = await this.configRepositoryService.find({
      where,
      order: { modifiedDate: 'DESC' },
    });
    const configModels = this.mapper(configs);
    return configModels;
  }

  public async _getConfigById(id: number): Promise<ConfigModel> {
    const config = await this.getConfigByIdOrFail(id);
    const configModel = this.mapper(config);
    return configModel;
  }

  public async _createConfig(createdConfigModel: CreatedConfigModel): Promise<ConfigModel> {
    const { content, contentEncrypted } = createdConfigModel;
    const model = this.configRepositoryService.merge(createdConfigModel, {
      contentType: this.getContentType(content),
      content: this.getContent(content, contentEncrypted),
    });
    const config = await this.configRepositoryService.insert(model);
    const configModel = this.mapper(config);
    return configModel;
  }

  public async _updateConfigById(
    id: number,
    updatedConfigModel: UpdatedConfigModel,
  ): Promise<ConfigModel> {
    const { content, contentEncrypted } = updatedConfigModel;
    const model = this.configRepositoryService.merge(updatedConfigModel, {
      contentType: this.getContentType(content),
      content: this.getContent(content, contentEncrypted),
    });
    const config = await this.configRepositoryService.update(id, model);
    if (!config) {
      throw new NotFoundException(`Not found system config by id "${id}"!`);
    }
    const configModel = this.mapper(config);
    return configModel;
  }

  public async _deleteConfigById(id: number): Promise<ConfigModel> {
    const config = await this.configRepositoryService.delete(id);
    if (!config) {
      throw new NotFoundException(`Not found system config by id "${id}"!`);
    }
    const configModel = this.mapper(config);
    return configModel;
  }

  public async getConfigByIdOrFail(id: number): Promise<ConfigEntity> {
    const config = await this.configRepositoryService.findOne(id);
    if (!config) {
      throw new NotFoundException(`Not found system config by id "${id}"!`);
    }
    return config;
  }

  public async getConfigContentByCodeOrFail<IContent = any>(code: string): Promise<IContent> {
    const config = await this.configRepositoryService.findOne({ code });
    if (!config) {
      throw new BadRequestException(`Not found system config by code "${code}"!`);
    }
    return this.parseContent<IContent>(config.content, config.contentEncrypted);
  }
}

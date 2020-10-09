import { IFile, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import { FindConditions, Like } from 'typeorm';
import { ISelectOption, ModelService } from '../../system';
import { AttachmentStorageContainer } from '../containers';
import { AttachmentEntity } from '../entities';
import {
  ATTACHMENT_STORAGE_TYPE_ENUM,
  ATTACHMENT_STORAGE_TYPE_NAME_ENUM,
  DOWNLOAD_ATTACHMENT_TYPE_ENUM,
} from '../enums';
import { IAttachmentStorageAdapter } from '../interfaces';
import { AttachmentModel, QueryAttachmentAndCountModel, QueryAttachmentModel } from '../models';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepositoryService(AttachmentEntity)
    private readonly attachmentRepository: RepositoryService<AttachmentEntity>,
    private readonly attachmentStorageContainer: AttachmentStorageContainer,
    private readonly modelService: ModelService,
  ) {}

  private mapper(attachments: AttachmentEntity[]): AttachmentModel[];
  private mapper(attachment: AttachmentEntity): AttachmentModel;
  private mapper(
    attachmentOrAttachments: AttachmentEntity[] | AttachmentEntity,
  ): AttachmentModel[] | AttachmentModel {
    return this.modelService.mapper(AttachmentModel, attachmentOrAttachments);
  }

  private getWhere(queries: QueryAttachmentModel): FindConditions<AttachmentEntity> {
    const where: FindConditions<AttachmentEntity> = {};
    if (queries.name) {
      where.name = Like(queries.name);
    }
    if (queries.encoding) {
      where.encoding = Like(queries.encoding);
    }
    if (queries.originalName) {
      where.originalName = Like(queries.originalName);
    }
    if (queries.mimeType) {
      where.mimeType = Like(queries.mimeType);
    }
    if (queries.size) {
      where.size = queries.size;
    }
    if (queries.path) {
      where.path = Like(queries.path);
    }
    if (queries.folderName) {
      where.folderName = Like(queries.folderName);
    }
    if (queries.fileName) {
      where.fileName = Like(queries.fileName);
    }
    if (queries.extName) {
      where.extName = Like(queries.extName);
    }
    if (queries.storageType) {
      where.storageType = queries.storageType;
    }
    return where;
  }

  private getAdapter(storageType: ATTACHMENT_STORAGE_TYPE_ENUM): IAttachmentStorageAdapter {
    return this.attachmentStorageContainer.getAdapter(storageType);
  }

  private updateLastDownloadDateByPath(path: string): Promise<AttachmentEntity | undefined> {
    return this.attachmentRepository.update(
      { path },
      { lastDownloadDate: moment().utc().toDate() },
    );
  }

  public _getAttachmentStorageTypes(): ISelectOption[] {
    const storageTypes = _.chain(ATTACHMENT_STORAGE_TYPE_NAME_ENUM)
      .keys()
      .map((key) => ({ name: ATTACHMENT_STORAGE_TYPE_NAME_ENUM[key], value: key }))
      .value();
    return storageTypes;
  }

  public async _getAttachmentsAndCount(queries: QueryAttachmentAndCountModel) {
    const skip = (queries.pageNumber - 1) * queries.pageSize;
    const take = queries.pageSize;
    const where = this.getWhere(queries);
    const [attachments, count] = await this.attachmentRepository.findAndCount({
      where,
      order: { lastDownloadDate: 'DESC' },
      skip,
      take,
    });
    const attachmentModels = this.mapper(attachments);
    return { data: attachmentModels, count };
  }

  public async _deleteAttachmentById(id: number): Promise<AttachmentModel> {
    const attachment = await this.attachmentRepository.findOne(id);
    if (!attachment) {
      throw new NotFoundException(`Not found attachment by id "${id}"!`);
    }
    const deletedAttachment = await this.getAdapter(attachment.storageType).deleteAttachment(
      attachment,
    );
    const attachmentModel = this.mapper(deletedAttachment);
    return attachmentModel;
  }

  public async _downloadAttachmentByPath(
    path: string,
  ): Promise<[DOWNLOAD_ATTACHMENT_TYPE_ENUM, string]> {
    if (fs.existsSync(path)) {
      await this.updateLastDownloadDateByPath(path);
      return [DOWNLOAD_ATTACHMENT_TYPE_ENUM.FILE, path];
    }
    const attachment = await this.attachmentRepository.findOne({ path });
    if (!attachment) {
      throw new NotFoundException(`Not found attachment by path "${path}"!`);
    }
    const result = await this.getAdapter(attachment.storageType).downAttachment(attachment);
    await this.updateLastDownloadDateByPath(path);
    return result;
  }

  public async _uploadAttachment(
    file: IFile,
    storageType = ATTACHMENT_STORAGE_TYPE_ENUM.LOCAL,
  ): Promise<AttachmentModel> {
    const attachmentModels = await this._uploadAttachments([file], storageType);
    return attachmentModels[0];
  }

  public async _uploadAttachments(
    files: IFile[],
    storageType = ATTACHMENT_STORAGE_TYPE_ENUM.LOCAL,
  ): Promise<AttachmentModel[]> {
    const attachments = await this.getAdapter(storageType).uploadAttachments(files);
    const attachmentModels = this.mapper(attachments);
    return attachmentModels;
  }
}

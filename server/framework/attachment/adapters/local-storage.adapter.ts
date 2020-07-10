import { getRootPath, IFile, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import { v1 as uuid } from 'uuid';
import { AttachmentStorageContainer } from '../containers';
import { AttachmentEntity } from '../entities';
import { ATTACHMENT_STORAGE_TYPE_ENUM } from '../enums';
import { IAttachmentStorageAdapter } from '../interfaces';
import { AttachmentBackupService } from '../services/attachment-backup.service';

@Injectable()
export class LocalStorageAdapter implements IAttachmentStorageAdapter {
  constructor(
    @InjectRepositoryService(AttachmentEntity)
    private readonly attachmentRepository: RepositoryService<AttachmentEntity>,
    private readonly attachmentBackupService: AttachmentBackupService,
    protected readonly container: AttachmentStorageContainer,
  ) {
    container.registeAdapter(ATTACHMENT_STORAGE_TYPE_ENUM.LOCAL, this);
  }

  public async deleteAttachment(attachment: AttachmentEntity): Promise<AttachmentEntity> {
    const [deletedAttachment] = await Promise.all([
      this.attachmentRepository.delete(attachment.id),
      this.attachmentBackupService.deleteAttachmentBackupByAttachmentId(attachment.id),
    ]);
    if (!deletedAttachment) {
      throw new NotFoundException(`Not found attachment by id "${attachment.id}"!`);
    }
    fs.unlinkSync(getRootPath('resources', attachment.path));
    fs.rmdirSync(getRootPath('resources', attachment.folderName));
    return deletedAttachment;
  }

  public async downAttachment(attachment: AttachmentEntity): Promise<string> {
    await this.attachmentBackupService.generateAttachmentBackup(attachment);
    return attachment.path;
  }

  public async uploadAttachments(files: IFile[]): Promise<AttachmentEntity[]> {
    const dateFolder = moment().format('YYYY-MM-DD');
    const dateFolderPath = getRootPath('resources', dateFolder);
    if (!fs.existsSync(dateFolderPath)) {
      fs.mkdirSync(dateFolderPath);
    }
    const attachmentModels = _.map(files, (file) => {
      const uuidFolder = uuid();
      const fileName = file.originalname;
      fs.mkdirSync(path.join(dateFolderPath, uuidFolder));
      const folderName = `${dateFolder}/${uuidFolder}`;
      const attachmentModel = this.attachmentRepository.repository.create({
        name: fileName,
        encoding: file.encoding,
        originalName: fileName,
        mimeType: file.mimetype,
        size: file.size,
        path: `${dateFolder}/${uuidFolder}/${fileName}`,
        fileName,
        folderName,
        extName: path.extname(fileName),
        storageType: ATTACHMENT_STORAGE_TYPE_ENUM.LOCAL,
      });
      fs.writeFileSync(path.join(dateFolderPath, uuidFolder, fileName), file.buffer);
      return attachmentModel;
    });
    const attachments = await this.attachmentRepository.insertBulk(attachmentModels);
    await this.attachmentBackupService.createAttachmentBacks(attachments, files);
    return attachments;
  }
}

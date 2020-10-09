import { getRootPath, IFile, InjectRepositoryService, RepositoryService } from '@bravo/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import _ from 'lodash';
import { AttachmentBackupEntity, AttachmentEntity } from '../entities';

@Injectable()
export class AttachmentBackupService {
  constructor(
    @InjectRepositoryService(AttachmentBackupEntity)
    public readonly attachmentContentRepository: RepositoryService<AttachmentBackupEntity>,
  ) {}

  public deleteAttachmentBackupByAttachmentId(
    attachmentId: number,
  ): Promise<AttachmentBackupEntity | undefined> {
    return this.attachmentContentRepository.delete({ attachmentId });
  }

  public async generateAttachmentBackup(attachment: AttachmentEntity): Promise<void> {
    const attachmentContent = await this.attachmentContentRepository.findOne({
      attachmentId: attachment.id,
    });
    if (!attachmentContent) {
      throw new NotFoundException(
        `Not found attachmentContent by attachmentId "${attachment.id}"!`,
      );
    }
    const folderNames = attachment.folderName.split('/').slice(1);
    const paths = _.map(_.times(folderNames.length, Number), (index) =>
      _.chain(_.times(++index, Number))
        .map((value) => folderNames[value])
        .join('/')
        .value(),
    );
    _.each(paths, (path) => {
      const folderPath = getRootPath(path);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
    });
    fs.writeFileSync(getRootPath(attachment.path), attachmentContent.content);
  }

  public createAttachmentBacks(attachments: AttachmentEntity[], files: IFile[]) {
    return this.attachmentContentRepository.insertBulk(
      _.map(attachments, (attachment, index) =>
        this.attachmentContentRepository.create({
          attachmentId: attachment.id,
          content: files[index].buffer,
        }),
      ),
    );
  }
}

import { IFile } from '@bravo/core';
import { AttachmentEntity } from '../entities';
import { DOWNLOAD_ATTACHMENT_TYPE_ENUM } from '../enums';

export interface IAttachmentStorageAdapter {
  deleteAttachment(attachment: AttachmentEntity): Promise<AttachmentEntity>;
  downAttachment(attachment: AttachmentEntity): Promise<[DOWNLOAD_ATTACHMENT_TYPE_ENUM, string]>;
  uploadAttachments(files: IFile[]): Promise<AttachmentEntity[]>;
}

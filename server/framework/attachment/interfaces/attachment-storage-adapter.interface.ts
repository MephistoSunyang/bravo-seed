import { IFile } from '@bravo/core';
import { AttachmentEntity } from '../entities';

export interface IAttachmentStorageAdapter {
  deleteAttachment(attachment: AttachmentEntity): Promise<AttachmentEntity>;
  downAttachment(attachment: AttachmentEntity): Promise<string>;
  uploadAttachments(files: IFile[]): Promise<AttachmentEntity[]>;
}

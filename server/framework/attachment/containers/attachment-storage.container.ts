import { Injectable } from '@nestjs/common';
import { ATTACHMENT_STORAGE_TYPE_ENUM } from '../enums';
import { IAttachmentStorageAdapter } from '../interfaces';

@Injectable()
export class AttachmentStorageContainer {
  private readonly adapters = new Map<ATTACHMENT_STORAGE_TYPE_ENUM, IAttachmentStorageAdapter>();

  public registeAdapter(
    storageType: ATTACHMENT_STORAGE_TYPE_ENUM,
    adapter: IAttachmentStorageAdapter,
  ): void {
    if (this.adapters.has(storageType)) {
      throw new Error(`adapter by storageType "${storageType}" has already registered!`);
    }
    this.adapters.set(storageType, adapter);
  }

  public getAdapter(storageType: ATTACHMENT_STORAGE_TYPE_ENUM): IAttachmentStorageAdapter {
    if (!this.adapters.has(storageType)) {
      throw new Error(`adapter by storageType "${storageType}" has not registered!`);
    }
    return this.adapters.get(storageType)!;
  }
}

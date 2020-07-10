import { AuditLog, getCurrentUserId } from '@bravo/core';
import _ from 'lodash';
import moment from 'moment';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ATTACHMENT_STORAGE_TYPE_ENUM } from '../enums';

@Entity({ schema: 'system', name: 'attachments' })
@AuditLog()
export class AttachmentEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar')
  public encoding: string;

  @Column('nvarchar')
  public originalName: string;

  @Column('nvarchar', { length: 500 })
  public mimeType: string;

  @Column('int')
  public size: number;

  @Column('nvarchar')
  public path: string;

  @Column('nvarchar')
  public folderName: string;

  @Column('nvarchar')
  public fileName: string;

  @Column('nvarchar')
  public extName: string;

  @Column('nvarchar')
  public storageType: ATTACHMENT_STORAGE_TYPE_ENUM;

  @Column('nvarchar', { nullable: true })
  public createdUserId: string | null;

  @Column('datetime2')
  public createdDate: Date;

  @Column('datetime2')
  public lastDownloadDate: Date;

  @BeforeInsert()
  public beforeInsertListener() {
    const userId = getCurrentUserId();
    if (!this.createdUserId) {
      this.createdUserId = userId ? _.toString(userId) : null;
    }
    this.createdDate = moment().utc().toDate();
    this.lastDownloadDate = moment().utc().toDate();
  }
}

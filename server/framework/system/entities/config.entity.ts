import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CONFIG_CONTENT_TYPE_ENUM } from '../enums';

@Entity({ schema: 'system', name: 'configs' })
@AuditLog()
export class ConfigEntity extends BaseEntity {
  @Column('varchar')
  public code: string;

  @Column('nvarchar')
  public name: string;

  @Column('varchar')
  public contentType: CONFIG_CONTENT_TYPE_ENUM;

  @Column('bit', { default: false })
  public contentEncrypted: boolean;

  @Column('nvarchar', { length: 'MAX' })
  public content: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}

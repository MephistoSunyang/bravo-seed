import { AuditLog } from '@bravo/core';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@AuditLog()
@Index('SystemPermissionCodeIndex', ['code'])
@Entity({ schema: 'system', name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @Column('varchar')
  public code: string;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}

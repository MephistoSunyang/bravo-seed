import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ schema: 'system', name: 'roles' })
@AuditLog()
export class RoleEntity extends BaseEntity {
  @Column('int', { default: 0 })
  public roleGroupId: number;

  @Column('varchar')
  public code: string;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}

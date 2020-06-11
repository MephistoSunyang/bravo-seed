import { AuditLog } from '@bravo/core';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ schema: 'system', name: 'menus' })
@AuditLog()
export class MenuEntity extends BaseEntity {
  @Column('varchar')
  public group: string;

  @Column('int', { default: 0 })
  public level: number;

  @Column('int', { default: 0 })
  public parentId: number;

  @Column('int', { default: 0 })
  public sort: number;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true })
  public icon: string | null;

  @Column('nvarchar')
  public path: string;

  @Column('bit', { default: true })
  public visible: boolean;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;
}

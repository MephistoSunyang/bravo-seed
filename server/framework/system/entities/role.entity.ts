import { AuditLog } from '@bravo/core';
import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from './user.entity';

@AuditLog()
@Index('SystemRoleCodeIndex', ['code'])
@Entity({ schema: 'system', name: 'roles' })
export class RoleEntity extends BaseEntity {
  @Column('int', { default: 0 })
  public roleGroupId: number;

  @Column('varchar')
  public code: string;

  @Column('nvarchar')
  public name: string;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  public users?: UserEntity[];
}

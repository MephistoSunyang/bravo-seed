import { AuditLog } from '@bravo/core';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RoleEntity } from './role.entity';

@Entity({ schema: 'system', name: 'users' })
@AuditLog()
export class UserEntity extends BaseEntity {
  @Column('varchar')
  public username: string;

  @Column('varchar', { nullable: true })
  public password: string | null;

  @Column('nvarchar', { nullable: true })
  public nickname: string | null;

  @Column('nvarchar', { nullable: true })
  public realname: string | null;

  @Column('varchar', { nullable: true })
  public phone: string | null;

  @Column('bit', { default: false })
  public phoneConfirmed: boolean;

  @Column('varchar', { nullable: true })
  public email: string | null;

  @Column('bit', { default: false })
  public emailConfirmed: boolean;

  @Column('nvarchar', { nullable: true, length: 500 })
  public comment: string | null;

  @JoinTable({
    name: 'user-role-mapping',
    schema: 'system',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'roleId' },
  })
  @ManyToMany(() => RoleEntity)
  public roles?: RoleEntity[];
}

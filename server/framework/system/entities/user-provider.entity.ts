import { AuditLog } from '@bravo/core';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { USER_PROVIDER_TYPE_ENUM } from '../enums';
import { UserEntity } from './user.entity';

@AuditLog()
@Index('SystemUserProviderUserIdIndex', ['userId'])
@Index('SystemUserProviderTypeIndex', ['type'])
@Index('SystemUserProviderKeyIndex', ['key'])
@Entity({ schema: 'system', name: 'user-providers' })
export class UserProviderEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public userId: number;

  @Column('varchar')
  public type: USER_PROVIDER_TYPE_ENUM;

  @Column('varchar')
  public key: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => UserEntity)
  public user?: UserEntity;
}

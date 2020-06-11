import _ from 'lodash';
import {
  Column,
  CreateDateColumn,
  DeleteColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('nvarchar', { nullable: true })
  public createdUserId: string | null;

  @CreateDateColumn()
  public createdDate: Date;

  @Column('nvarchar', { nullable: true })
  public modifiedUserId: string | null;

  @UpdateDateColumn()
  public modifiedDate: Date;

  @DeleteColumn({ default: false })
  public isDeleted: boolean;

  @VersionColumn({ default: 1 })
  public version: number;
}

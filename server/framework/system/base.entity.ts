import { getCurrentUserId } from '@bravo/core';
import _ from 'lodash';
import moment from 'moment';
import {
  BeforeInsert,
  BeforeUpdate,
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

  @BeforeInsert()
  public beforeInsertListener() {
    const userId = getCurrentUserId();
    if (!this.createdUserId) {
      this.createdUserId = userId ? _.toString(userId) : null;
    }
    this.createdDate = moment().utc().toDate();
  }

  @BeforeUpdate()
  public beforeUpdateListener() {
    const userId = getCurrentUserId();
    if (!this.modifiedUserId) {
      this.modifiedUserId = userId ? _.toString(userId) : null;
    }
    this.modifiedDate = moment().utc().toDate();
  }
}

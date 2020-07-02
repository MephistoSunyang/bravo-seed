import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {
  ActionEntity,
  PermissionEntity,
  RoleClaimEntity,
  RoleEntity,
  UserEntity,
} from '../entities';
import { ACTION_METHOD_ENUM, ROLE_CLAIM_TYPE_ENUM } from '../enums';

@Injectable()
export class AuthorizationService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getClaimQueryBuilderByRoleClaimType(type: ROLE_CLAIM_TYPE_ENUM) {
    return this.connection
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .innerJoin(
        '[system].[user-role-mapping]',
        'userRoleMappings',
        'userRoleMappings.UserId = users.Id',
      )
      .innerJoin(
        (subQuery) => subQuery.from(RoleEntity, 'roles').where('isDeleted = 0'),
        'roles',
        'roles.id = userRoleMappings.roleId',
      )
      .innerJoin(
        (subQuery) => subQuery.from(RoleClaimEntity, 'roleClaims').where('type = :type', { type }),
        'roleClaims',
        'roleClaims.roleId = roles.id',
      );
  }

  public async actionGuard(userId: number, method: ACTION_METHOD_ENUM, path: string) {
    const action = await this.getClaimQueryBuilderByRoleClaimType(ROLE_CLAIM_TYPE_ENUM.FEATURE)
      .innerJoin(
        (subQuery) =>
          subQuery
            .from(ActionEntity, 'actions')
            .where('method = :method', { method })
            .andWhere('path = :path', { path })
            .andWhere('isDeleted = 0'),
        'actions',
        'actions.id = roleClaims.key',
      )
      .where('users.id = :userId', { userId })
      .getOne();
    return action ? true : false;
  }

  public async permissionGuard(userId: number, codes: string[]) {
    const permission = await this.getClaimQueryBuilderByRoleClaimType(ROLE_CLAIM_TYPE_ENUM.FEATURE)
      .innerJoin(
        (subQuery) =>
          subQuery
            .from(PermissionEntity, 'permissions')
            .where('code IN (:codes)', { codes: codes.join(',') })
            .andWhere('isDeleted = 0'),
        'permissions',
        'permissions.id = roleClaims.key',
      )
      .where('users.id = :userId', { userId })
      .getOne();
    return permission ? true : false;
  }
}

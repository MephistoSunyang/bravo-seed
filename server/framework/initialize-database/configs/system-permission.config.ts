import { DeepPartial } from 'typeorm';
import { PermissionEntity } from '../../system';

export const SYSTEM_PERMISSION_CONFIG: DeepPartial<PermissionEntity>[] = [
  { code: 'system.users', name: '系统模块用户管理权限' },
  { code: 'system.roleGroups', name: '系统模块角色组管理权限' },
  { code: 'system.roles', name: '系统模块角色管理权限' },
  { code: 'system.features', name: '系统模块功能管理权限' },
  { code: 'system.menus', name: '系统模块菜单管理权限' },
  { code: 'system.permissions', name: '系统模块权限管理权限' },
  { code: 'system.actions', name: '系统模块接口管理权限' },
  { code: 'system.configs', name: '系统模块配置管理权限' },
  { code: 'system.logs', name: '系统模块日志管理权限' },
  { code: 'system.attachments', name: '系统模块附件管理权限' },
];

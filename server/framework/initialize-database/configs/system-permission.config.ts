import { ISystemPermissionConfig } from '../interfaces';

export const SYSTEM_PERMISSION_CONFIG: ISystemPermissionConfig[] = [
  { code: 'system.user', name: '系统模块用户管理权限' },
  { code: 'system.roleGroup', name: '系统模块角色组管理权限' },
  { code: 'system.roles', name: '系统模块角色管理权限' },
  { code: 'system.features', name: '系统模块功能管理权限' },
  { code: 'system.menus', name: '系统模块菜单管理权限' },
  { code: 'system.permissions', name: '系统模块权限管理权限' },
  { code: 'system.actions', name: '系统模块接口管理权限' },
  { code: 'system.configs', name: '系统模块配置管理权限' },
  { code: 'system.logs', name: '系统模块日志管理权限' },
];

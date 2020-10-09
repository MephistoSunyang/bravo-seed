import { DeepPartial } from 'typeorm';
import { MenuEntity } from '../../system';

export const SYSTEM_MENU_CONFIG: DeepPartial<MenuEntity>[] = [
  {
    group: 'systemAdmin',
    parentId: 0,
    sort: 1,
    name: '系统后台管理',
    icon: 'menu',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 1,
    name: '用户管理',
    icon: 'user',
    path: '/system/users',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 2,
    name: '角色组管理',
    icon: 'usergroup-add',
    path: '/system/roleGroups',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 3,
    name: '角色管理',
    icon: 'team',
    path: '/system/roles',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 4,
    name: '菜单管理',
    icon: 'menu',
    path: '/system/menus',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 5,
    name: '权限管理',
    icon: 'lock',
    path: '/system/permissions',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 6,
    name: '接口管理',
    icon: 'api',
    path: '/system/actions',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 7,
    name: '配置管理',
    icon: 'setting',
    path: '/system/configs',
  },
  {
    group: 'systemAdmin',
    parentId: 1,
    sort: 8,
    name: '日志管理',
    icon: 'code',
    path: '/system/logs',
  },
  {
    group: 'systemAdmin',
    parentId: 0,
    sort: 2,
    name: '附件管理',
    icon: 'paper-clip',
    path: '/system/attachments',
  },
];

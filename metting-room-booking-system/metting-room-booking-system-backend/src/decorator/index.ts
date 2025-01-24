import { SetMetadata } from '@nestjs/common';

export const RequireLogin = () => SetMetadata('requireLogin', true);

/**
 * 添加权限要求的装饰器
 *
 * @param permissions 需要满足的权限列表
 * @returns 返回用于设置权限要求的装饰器函数
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('requirePermissions', permissions);

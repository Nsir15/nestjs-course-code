import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const RequireLogin = () => SetMetadata('requireLogin', true);

/**
 * 添加权限要求的装饰器
 *
 * @param permissions 需要满足的权限列表
 * @returns 返回用于设置权限要求的装饰器函数
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('requirePermissions', permissions);

/**
 * 用户信息参数装饰器
 *
 * 通过该装饰器可以从请求中获取用户信息，支持通过 dataKey 参数获取用户信息的某个属性
 *
 * @param {string} dataKey - 用户信息中的属性名，默认为空字符串，表示返回整个用户信息对象
 * @param {ExecutionContext} ctx - 执行上下文
 * @returns {any} - 用户信息或用户信息的某个属性
 *
 * @example
 * // 获取整个用户信息对象
 * @UserInfo()
 * user: User;
 *
 * // 获取用户信息中的某个属性，例如 userId
 * @UserInfo('userId')
 * userId: string;
 */
export const UserInfo = createParamDecorator(
  (dataKey: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    return dataKey ? request[dataKey] : request;
  },
);

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import { Reflector } from '@nestjs/core';
import { RedisService } from './redis/redis.service';

declare module 'express-session' {
  interface Session {
    user: {
      username: string;
    };
  }
}
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session?.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    const key = `user:${user.username}:permissions`;

    let permissions = await this.redisService.listGet(key);
    if (!permissions || !permissions.length) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map((item) => item.name);
      this.redisService.listSet(
        key,
        foundUser.permissions.map((item) => item.name),
        30 * 60,
      );
    }

    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (permission && permissions.some((item) => item === permission))
      return true;
    else throw new UnauthorizedException('权限不足');
  }
}

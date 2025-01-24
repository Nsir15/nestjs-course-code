import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Permission } from 'src/user/entities/permission.entity';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      userId: number;
      roles: string[];
      permissions: Permission[];
    };
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'requirePermissions',
      [context.getHandler(), context.getClass()],
    );
    console.log('requirePermissions', requirePermissions);

    if (!requirePermissions) return true;

    for (let i = 0; i < requirePermissions.length; i++) {
      if (
        user.permissions.findIndex(
          (permission) => permission.code === requirePermissions[i],
        ) === -1
      ) {
        throw new UnauthorizedException('没有权限访问该接口');
      }
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Permission } from './user/entities/permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(UserService)
  private readonly userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    const { roles } = user;
    const roleIds = roles.map((item) => item.id);
    const fondRoles = (await this.userService.findRolesByIds(roleIds)) || [];
    const fondRolesPermissionList: Permission[] = fondRoles.reduce(
      (list, item) => {
        return [...list, ...(item.permissions || [])];
      },
      [],
    );
    // const roles = this.userService;
    const routePermissions = this.reflector.getAllAndOverride('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (
      fondRolesPermissionList.findIndex((item) =>
        routePermissions.includes(item.name),
      ) === -1
    ) {
      throw new UnauthorizedException('无权限访问');
    }

    return true;
  }
}

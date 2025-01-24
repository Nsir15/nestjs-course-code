import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
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
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const isRequireLogin = this.reflector.getAllAndOverride<boolean>(
      'requireLogin',
      [context.getHandler(), context.getClass()],
    );

    if (!isRequireLogin) return true;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录，请登录后再试');
    }
    const [, token] = authorization.split(' ');
    try {
      const data = this.jwtService.verify(token);
      request.user = data;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}

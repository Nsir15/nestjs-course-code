import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredLogin = this.reflector.getAllAndOverride('requiredLogin', [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果不是必须要登录的，就直接放行
    if (!requiredLogin) {
      return true;
    }

    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('用户未登录 ');
    }
    try {
      const toke = authorization.split(' ')[1];
      const data = this.jwtService.verify(toke);
      request.user = data.user;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'] || '';
    const bears = authorization.split(' ');
    if (!bears || bears.length < 2) {
      throw new UnauthorizedException('登录token无效');
    }
    const token = bears[1];
    try {
      const info = this.jwtService.verify(token);
      request.user = info.user;
      return true;
    } catch (e) {
      console.log(e);

      throw new UnauthorizedException('登录token失效，请重新登录');
    }
  }
}

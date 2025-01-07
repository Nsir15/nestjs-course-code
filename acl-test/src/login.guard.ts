import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

declare module 'express-session' {
  interface Session {
    user: {
      username: string;
    };
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.session?.user) {
      throw new UnauthorizedException('用户未登录');
    }
    console.log('request', request);

    return true;
  }
}

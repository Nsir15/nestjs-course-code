import {
  Controller,
  Get,
  Inject,
  Res,
  Session,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('session')
  getSession(@Session() session): string {
    console.log(session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get('jwt')
  getJwt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ): string {
    try {
      if (!authorization) {
        throw new UnauthorizedException('缺少 authorization header');
      }

      const [type, token] = authorization.split(' ');

      if (type !== 'Bearer') {
        throw new UnauthorizedException('无效的 token 类型');
      }

      if (!token) {
        throw new UnauthorizedException('token 不能为空');
      }

      const decoded = this.jwtService.verify(token);

      const newToken = this.jwtService.sign({
        count: (decoded.count || 0) + 1,
        name: decoded.name || 'test',
      });

      response.setHeader('Authorization', `Bearer ${newToken}`);

      return (decoded.count || 0) + 1;
    } catch (error) {
      console.error('JWT验证失败:', error.message);
      throw new UnauthorizedException('无效的token');
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

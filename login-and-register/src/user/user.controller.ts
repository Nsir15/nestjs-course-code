import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginUser = await this.userService.login(user);
    if (loginUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: loginUser.id,
          userName: loginUser.userName,
        },
      });
      res.setHeader('Authorization', `Bearer ${token}`);
      return '登录成功';
    }
    return 'loginUser';
  }
}

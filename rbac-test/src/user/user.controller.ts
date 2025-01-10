import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';

import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('init')
  init() {
    this.userService.init();
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    const fondUser = await this.userService.login(user);
    if (!fondUser) {
      return {
        message: '登录失败',
      };
    }
    const token = this.jwtService.sign({
      user: {
        username: fondUser.username,
        roles: fondUser.roles,
      },
    });
    return {
      message: '登录成功',
      token,
    };
  }
}

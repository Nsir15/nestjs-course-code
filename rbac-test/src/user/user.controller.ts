import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return {
      message: '登录成功',
    };
  }
}

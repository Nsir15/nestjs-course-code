import { Controller, Get, Post, Body, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init')
  async init() {
    await this.userService.initDate();
    return '初始化成功';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginDto, @Session() session) {
    const fondUser = await this.userService.login(loginUser);
    if (fondUser) {
      session.user = {
        username: fondUser.username,
      };
      return '登录成功';
    }
    return '登录失败';
  }
}

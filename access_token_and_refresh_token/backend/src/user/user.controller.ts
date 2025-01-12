import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(@Body() user: LoginDto) {
    const loginUser = await this.userService.login(user);
    const token = this.jwtService.sign(
      {
        user: {
          username: loginUser.username,
          id: loginUser.id,
        },
      },
      { expiresIn: '30m' },
    );
    const refresh_token = this.jwtService.sign(
      {
        user: {
          id: loginUser.id,
        },
      },
      { expiresIn: '7d' },
    );
    return {
      token,
      refresh_token,
    };
  }

  @Get('refreshToken')
  async refreshToken(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const loginUser = await this.userService.getUserById(data.user.id);
      const token = this.jwtService.sign(
        {
          user: {
            username: loginUser.username,
            id: loginUser.id,
          },
        },
        { expiresIn: '30m' },
      );

      const refresh_token = this.jwtService.sign(
        {
          user: {
            id: loginUser.id,
          },
        },
        { expiresIn: '7d' },
      );

      return {
        token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token 失效，重新登录');
    }
  }
}

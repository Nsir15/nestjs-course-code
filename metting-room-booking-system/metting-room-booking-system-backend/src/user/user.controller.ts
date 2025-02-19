import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  UnauthorizedException,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-info.dto';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserVo } from './vo/login-user.vo';
import { RequireLogin, UserInfo } from 'src/decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { generateParseIntPipe } from 'src/utils';

enum AllowTypes {
  Register = 'Register',
  UpdatePassword = 'UpdatePassword',
  UpdateUser = 'UpdateUser',
}
type UpdateCaptchaQueryParams = {
  address: string;
  type: AllowTypes;
};

type ListQueryParams = {
  offset?: number;
  limit?: number;
  username?: string;
  nickName?: string;
  email?: string;
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  private generateToken(userInfo: LoginUserVo['userInfo']) {
    const { username, id, roles, permissions } = userInfo;
    const accessToken = this.jwtService.sign(
      {
        username,
        userId: id,
        roles,
        permissions,
      },
      { expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN') },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: id,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRESIN'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 6);
    await this.redisService.set('captcha_' + address, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '验证码',
      html: `<h1>验证码为：${code}</h1>`,
    });
    return '发送成功';
  }

  @Get('getCaptcha')
  async getUpdateCaptcha(@Query() query: UpdateCaptchaQueryParams) {
    const { address, type } = query;
    const code = Math.random().toString().slice(2, 6);
    let key = '';
    switch (type) {
      case AllowTypes.UpdatePassword:
        key = `update_password_captcha_${address}`;
        break;
      case AllowTypes.UpdateUser:
        key = `update_user_captcha_${address}`;
        break;
      case AllowTypes.Register:
        key = `captcha_${address}`;
        break;
      default:
        // const exhaustiveCheck: never = type;
        // break;
        throw new Error('未知类型');
    }
    await this.redisService.set(key, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '验证码',
      html: `<h1>验证码为：${code}</h1>`,
    });
    return '发送成功';
  }

  @Get('userInfo')
  async userInfo(@UserInfo('userId') userId: number) {
    return await this.userService.userInfo(userId);
  }

  @Get('list')
  async list(
    @Query('offset', new DefaultValuePipe(1), generateParseIntPipe('offset'))
    offset: number,
    @Query('limit', new DefaultValuePipe(2), generateParseIntPipe('limit'))
    limit: number,
    @Query() query: ListQueryParams,
  ) {
    const { username, nickName, email } = query;
    return await this.userService.list({
      offset,
      limit,
      username,
      nickName,
      email,
    });
  }

  @Get('freeze')
  async freeze(@Query('userId') userId: number) {
    return await this.userService.freeze(userId);
  }

  @Post('refreshToken')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      // refreshToken 里只有 userId
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateToken(user);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new TokenExpiredError('refreshToken失效', error);
    }
  }

  @Post('admin/refreshToken')
  async adminRefreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const { accessToken, refreshToken: newRefreshToken } =
        this.generateToken(user);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('refreshToken失效');
    }
  }

  @Get('initData')
  async initData() {
    return await this.userService.initData();
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginDto) {
    const vo = await this.userService.login(loginUser, false);
    const { userInfo } = vo;
    const { accessToken, refreshToken } = this.generateToken(userInfo);
    vo.accessToken = accessToken;
    vo.refreshToken = refreshToken;
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginDto) {
    const vo = await this.userService.login(loginUser, true);
    const { userInfo } = vo;
    const { accessToken, refreshToken } = this.generateToken(userInfo);

    vo.accessToken = accessToken;
    vo.refreshToken = refreshToken;
    return vo;
  }

  @Post('register')
  async register(@Body() registerUser: RegisterDto) {
    return await this.userService.register(registerUser);
  }

  @Post(['updatePassword', 'admin/updatePassword'])
  @RequireLogin()
  async updatePassword(@Body() passwordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  @Post(['updateUser', 'admin/updateUser'])
  @RequireLogin()
  async updateUser(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }
}

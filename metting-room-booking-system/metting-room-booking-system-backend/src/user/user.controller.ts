import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserVo } from './vo/login-user.vo';

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
        username,
        userId: id,
        roles,
        permissions,
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('register')
  async register(@Body() registerUser: RegisterDto) {
    return await this.userService.register(registerUser);
  }
}

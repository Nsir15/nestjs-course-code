import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends PickType(LoginDto, ['username', 'password']) {
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}

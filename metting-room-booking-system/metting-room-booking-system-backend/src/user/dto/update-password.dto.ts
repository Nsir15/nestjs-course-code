import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class UpdatePasswordDto extends PickType(RegisterDto, [
  'password',
  'username',
  'email',
  'captcha',
]) {
  // @IsNotEmpty({
  //   message: '用户名不能为空',
  // })
  // username: string;
  // @IsNotEmpty({
  //   message: '邮箱不能为空',
  // })
  // @IsEmail(
  //   {},
  //   {
  //     message: '请输入合法邮箱',
  //   },
  // )
  // email: string;
  // @IsNotEmpty({
  //   message: '验证码不能为空',
  // })
  // captcha: string;
  // @IsNotEmpty({
  //   message: '密码不能为空',
  // })
  // @MinLength(6, {
  //   message: '密码长度不能小于6位',
  // })
  // password: string;
}

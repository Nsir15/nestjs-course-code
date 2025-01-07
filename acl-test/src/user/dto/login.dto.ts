import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(3, 10)
  username: string;

  @IsNotEmpty()
  @Length(3, 10)
  password: string;
}

import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @IsNotEmpty()
  password: string;
}

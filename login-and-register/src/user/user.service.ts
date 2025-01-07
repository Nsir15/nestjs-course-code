import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

function md5(password: string) {
  return crypto.createHash('md5').update(password).digest('hex');
}

@Injectable()
export class UserService {
  // @InjectRepository(User)
  // private userRepository: Repository<User>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private logger = new Logger();

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      userName: user.userName,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.userName = user.userName;
    newUser.password = md5(user.password);
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }
  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      userName: user.userName,
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', 200);
    }
    if (md5(user.password) !== foundUser.password) {
      throw new HttpException('密码错误', 200);
    }
    return foundUser;
  }
}

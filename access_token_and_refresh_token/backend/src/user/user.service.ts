import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async login(loginUser: LoginDto) {
    const fondUser = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username,
      },
    });

    if (!fondUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (fondUser.password !== loginUser.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    return fondUser;
  }

  async getUserById(userId: number) {
    return await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
    });
  }
}

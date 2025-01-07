import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

function md5(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

@Injectable()
export class UserService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  private logger = new Logger();

  async initDate() {
    const permission1 = new Permission();
    permission1.name = 'create_aa';
    permission1.desc = '增加aa';

    const permission2 = new Permission();
    permission2.name = 'delete_aa';
    permission2.desc = '删除aa';

    const permission3 = new Permission();
    permission3.name = 'update_aa';
    permission3.desc = '修改aa';

    const permission4 = new Permission();
    permission4.name = 'query_aa';
    permission4.desc = '查询aa';

    const permission5 = new Permission();
    permission5.name = 'create_bb';
    permission5.desc = '增加bb';

    const permission6 = new Permission();
    permission6.name = 'delete_bb';
    permission6.desc = '删除bb';

    const permission7 = new Permission();
    permission7.name = 'update_bb';
    permission7.desc = '修改bb';

    const permission8 = new Permission();
    permission8.name = 'query_bb';
    permission8.desc = '查询bb';

    const user1 = new User();
    user1.username = 'admin';
    user1.password = '123456';

    user1.permissions = [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ];
    const user2 = new User();
    user2.username = 'user';
    user2.password = '123456';
    user2.permissions = [permission5, permission6, permission7, permission8];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ]);
    await this.entityManager.save([user1, user2]);
  }

  async register(user: RegisterDto) {
    const fondUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (fondUser) {
      throw new HttpException('用户已存在', 200);
    }
    const newUser = new User();
    newUser.username = user.username;
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
    const fondUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (!fondUser) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }
    if (user.password !== fondUser.password) {
      throw new HttpException('密码错误，请重新登录', 200);
    }
    return fondUser;
  }

  async findByUsername(username: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        permissions: true,
      },
    });
    return foundUser;
  }
}

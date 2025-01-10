import { HttpException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  async init() {
    const permission1 = new Permission();
    permission1.name = 'query_aa';
    permission1.desc = '查询aa';

    const permission2 = new Permission();
    permission2.name = 'edit_aa';
    permission2.desc = '编辑aa';

    const permission3 = new Permission();
    permission3.name = 'delete_aa';
    permission3.desc = '删除aa';

    const permission4 = new Permission();
    permission4.name = 'create_aa';
    permission4.desc = '创建aa';

    const permission5 = new Permission();
    permission5.name = 'query_bb';
    permission5.desc = '查询bb';

    const permission6 = new Permission();
    permission6.name = 'edit_bb';
    permission6.desc = '编辑bb';

    const permission7 = new Permission();
    permission7.name = 'delete_bb';
    permission7.desc = '删除bb';

    const permission8 = new Permission();
    permission8.name = 'create_bb';
    permission8.desc = '创建bb';

    const role1 = new Role();
    role1.name = 'admin';
    role1.desc = '管理员';
    role1.permissions = [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ];

    const role2 = new Role();
    role2.name = 'user';
    role2.desc = '普通用户';
    role2.permissions = [permission1, permission2, permission3, permission4];

    const user = new User();
    user.username = 'user';
    user.password = 'password';
    user.roles = [role2];

    const user1 = new User();
    user1.username = 'admin';
    user1.password = 'password';
    user1.roles = [role1];

    await this.entityManager.save(Role, [role1, role2]);
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
    await this.entityManager.save(User, [user, user1]);
  }

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
      relations: {
        roles: true,
      },
    });
    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }
    if (foundUser.password !== user.password) {
      throw new HttpException('Invalid password', 400);
    }
    return foundUser;
  }
}

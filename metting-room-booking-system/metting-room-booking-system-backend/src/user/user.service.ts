import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { md5 } from 'src/utils';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginDto } from './dto/login.dto';
import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject()
  private readonly dataSource: DataSource;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async register(registerUser: RegisterDto) {
    const { email } = registerUser;
    const captcha = await this.redisService.get(`captcha_${email}`);

    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (captcha !== registerUser.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const fondUser = await this.userRepository.findOne({
      where: { username: registerUser.username },
    });

    if (fondUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    // 使用 DataSource 创建 queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 获取默认的普通用户角色
      const defaultRole = await this.roleRepository.findOne({
        where: { name: '普通用户' },
        relations: ['permissions'],
      });

      if (!defaultRole) {
        throw new HttpException(
          '默认角色不存在',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newUser = new User();
      newUser.username = registerUser.username;
      newUser.password = md5(registerUser.password);
      newUser.nickName = registerUser.nickName;
      newUser.email = email;
      newUser.roles = [defaultRole];
      newUser.isAdmin = false;

      await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();

      return {
        id: newUser.id,
        username: newUser.username,
        nickName: newUser.nickName,
        email: newUser.email,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error, UserService);
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async login(user: LoginDto, isAdmin: boolean) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          username: user.username,
          isAdmin: isAdmin,
        },
        relations: ['roles', 'roles.permissions'],
      });
      if (!foundUser) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      if (md5(user.password) !== foundUser.password) {
        throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
      }

      if (foundUser.isFrozen) {
        throw new HttpException('用户已被冻结', HttpStatus.BAD_REQUEST);
      }

      const vo = new LoginUserVo();
      vo.userInfo = {};
      const roles = foundUser.roles.map((item) => item.name);
      const permissions = foundUser.roles.reduce((resultSet, role) => {
        resultSet = new Set([...resultSet, ...(role.permissions || [])]);
        return resultSet;
      }, new Set());

      Object.assign(vo.userInfo, {
        ...foundUser,
        password: undefined,
        roles,
        permissions: Array.from(permissions),
      });

      return vo;
    } catch (error) {
      this.logger.error(error, UserService);
      throw new HttpException('登录失败', HttpStatus.BAD_REQUEST);
    }
  }
  async initData() {
    // 检查是否已经初始化
    const adminExists = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (adminExists) {
      throw new HttpException('数据已经初始化', HttpStatus.BAD_REQUEST);
    }

    // 使用 DataSource 创建 queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user1 = new User();
      user1.username = 'admin';
      user1.password = md5('123456');
      user1.nickName = '管理员';
      user1.isAdmin = true;
      user1.email = 'admin@163.com';

      const user2 = new User();
      user2.username = 'user';
      user2.password = md5('123456');
      user2.nickName = '普通用户';
      user2.isAdmin = false;
      user2.email = 'user@163.com';

      const role1 = new Role();
      role1.name = '管理员';

      const role2 = new Role();
      role2.name = '普通用户';

      const permission1 = new Permission();
      permission1.code = 'user:read';
      permission1.desc = '用户查询权限';

      const permission2 = new Permission();
      permission2.code = 'user:manage';
      permission2.desc = '用户管理权限';

      role1.permissions = [permission1, permission2];
      role2.permissions = [permission1];

      user1.roles = [role1];
      user2.roles = [role2];

      await queryRunner.manager.save([permission1, permission2]);
      await queryRunner.manager.save([role1, role2]);
      await queryRunner.manager.save([user1, user2]);

      await queryRunner.commitTransaction();

      return { message: '初始化数据成功' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error, UserService);
      throw new HttpException(
        '初始化数据失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findUserById(id: number, isAdmin: boolean) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          id,
          isAdmin: isAdmin,
        },
        relations: ['roles', 'roles.permissions'],
      });
      if (!foundUser) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      return {
        username: foundUser.username,
        id: foundUser.id,
        isAdmin,
        roles: foundUser.roles.map((item) => item.name),
        permissions: foundUser.roles.reduce((result, role) => {
          role.permissions.forEach((permission) => {
            if (!result.some((item) => item.code === permission.code)) {
              result.push(permission);
            }
          });
          return result;
        }, []),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('查询用户失败', HttpStatus.BAD_REQUEST);
    }
  }
}

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
import { Repository } from 'typeorm';
import { md5 } from 'src/utils';

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

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
    console.log('captcha:', captcha, email);
    if (!captcha) {
      throw new HttpException('验证码已过期', 400);
    }
    if (captcha !== registerUser.captcha) {
      throw new HttpException('验证码错误', 400);
    }

    const fondUser = await this.userRepository.findOne({
      where: {
        username: registerUser.username,
      },
    });
    if (fondUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();

    // Object.assign(newUser, {
    //   ...registerUser,
    //   password: md5(registerUser.password),
    // });
    newUser.username = registerUser.username;
    newUser.password = md5(registerUser.password);
    newUser.nickName = registerUser.nickName;
    newUser.email = email;
    newUser.headPic = '/default-avatar.png';

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error, UserService);
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    }
    console.log('registerUser:', registerUser);
  }
}

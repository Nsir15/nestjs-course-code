import { HttpException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  init() {
    const user = new User();
    user.username = 'user';
    user.password = 'password';

    const user1 = new User();
    user1.username = 'admin';
    user1.password = 'password';

    this.userRepository.save([user, user1]);
  }

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
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

/** vo 主要是 valueObject ,返回值的定义 */

import { User } from '../entities/user.entity';

export interface IUserInfo extends Partial<Omit<User, 'password' | 'roles'>> {
  roles?: string[];
  permissions?: string[];
}

export class LoginUserVo {
  userInfo: IUserInfo;
  accessToken: string;
  refreshToken: string;
}

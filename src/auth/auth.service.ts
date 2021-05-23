import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bCrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

const generateHash = (plaintPassword: string | Buffer) => {
  return bCrypt.hashSync(plaintPassword, bCrypt.genSaltSync(8));
};

const isValidPassword = (
  plaintPassword: string | Buffer,
  passwordHash: string,
) => {
  return bCrypt.compareSync(plaintPassword, passwordHash);
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user === null || typeof user === 'undefined') {
      throw new NotFoundException("User wasn't found");
    }

    if (!isValidPassword(password, user.password)) {
      throw new ForbiddenException('Password incorrect');
    }

    if (isValidPassword(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

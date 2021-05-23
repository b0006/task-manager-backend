import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bCrypt from 'bcrypt';

import { User } from '../users/users.schema';
import { UsersService } from '../users/users.service';

import { AuthSignUpDto } from './dto/auth.sign-up.dto';

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

  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOneByUsername(username);

    if (user === null || typeof user === 'undefined') {
      throw new NotFoundException("User wasn't found");
    }

    if (!isValidPassword(plainPassword, user.password)) {
      throw new ForbiddenException('Password incorrect');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(bodyData: AuthSignUpDto) {
    const isAlreadyExist = await this.usersService.findOneByUsername(
      bodyData.username,
    );
    if (isAlreadyExist) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hash = generateHash(bodyData.password);

    this.usersService.create({
      username: bodyData.username,
      email: bodyData.email,
      password: hash,
    });

    return {
      success: true,
    };
  }
}

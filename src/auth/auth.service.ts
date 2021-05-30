import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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
  constructor(private usersService: UsersService) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOne({ email });

    if (user === null || typeof user === 'undefined') {
      throw new NotFoundException('Пользователь c таким email не найден');
    }

    if (!isValidPassword(plainPassword, user.password)) {
      throw new ForbiddenException('Неверный пароль');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async signUp(bodyData: AuthSignUpDto) {
    const isAlreadyExist = await this.usersService.findOne({
      username: bodyData.username,
      email: bodyData.email,
    });

    if (isAlreadyExist) {
      throw new BadRequestException(
        'Пользователь с таким логином или email уже существует',
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

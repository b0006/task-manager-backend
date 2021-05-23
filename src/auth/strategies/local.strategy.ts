import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../../users/users.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(username, password);
    if (user === null || typeof user === 'undefined') {
      throw new UnauthorizedException();
    }
    return user;
  }
}

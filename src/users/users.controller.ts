import { Get, Request, NotFoundException } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/users')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/user')
  async findOne(@Request() req) {
    const user = await this.userService.findOne({
      username: req.query.username,
    });
    console.log(user);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}

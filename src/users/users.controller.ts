import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/users')
  async findAll() {
    return this.userService.findAll();
  }
}

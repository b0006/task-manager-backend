import { Get } from '@nestjs/common';
import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async findAll() {
    return this.userService.findAll();
  }
}

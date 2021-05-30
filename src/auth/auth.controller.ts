import {
  Controller,
  Request,
  Response,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { AuthFilter } from './filters/auth.filter';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.guard';

@UseFilters(AuthFilter)
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    res.json({ statusCode: 200, data: req.user });
  }

  @Post('sign-up')
  async signUp(@Body() bodyData: AuthSignUpDto) {
    return this.authService.signUp(bodyData);
  }

  @Get('/logout')
  logout(@Request() req, @Response() res) {
    req.session.destroy();
    res.json({ statusCode: 200, data: true });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

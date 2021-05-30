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

// import { LocalAuthGuard } from './guards/local-auth.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { AuthFilter } from './filters/auth.filter';
import { LoginGuard } from './guards/login.guard';

@UseFilters(AuthFilter)
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() bodyData: AuthSignUpDto) {
    return this.authService.signUp(bodyData);
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    res.json({ statusCode: 200, data: req.user });
  }

  @Get('/logout')
  logout(@Request() req, @Response() res) {
    req.session.destroy();
    res.json({ statusCode: 200, data: true });
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(LoginGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { SessionSerializer } from './session.serializer';
// import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: {
    //     expiresIn: 3600, // 1 hour
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}

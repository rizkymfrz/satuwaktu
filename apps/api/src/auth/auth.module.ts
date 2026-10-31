import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtExpiresIn, requireJwtSecret } from '../config/env.config.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrincipalGuard } from './principal.guard.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: requireJwtSecret(),
        signOptions: { expiresIn: jwtExpiresIn() as `${number}d` },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrincipalGuard,
    { provide: APP_GUARD, useExisting: PrincipalGuard },
  ],
})
export class AuthModule {}

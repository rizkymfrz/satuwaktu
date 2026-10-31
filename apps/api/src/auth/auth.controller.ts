import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoginBody } from '@repo/dto/validation';
import { THROTTLE_WINDOW_MS } from '../config/api.config.js';
import { AuthService } from './auth.service.js';
import { CurrentPrincipal } from './current-principal.decorator.js';
import type { Principal } from './principal.js';

export const LOGIN_LIMIT = 5;

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('accounts')
  accounts() {
    return this.auth.listAccounts();
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: LOGIN_LIMIT, ttl: THROTTLE_WINDOW_MS } })
  login(@Body() body: LoginBody) {
    return this.auth.login(body);
  }

  @Get('me')
  me(@CurrentPrincipal() principal: Principal) {
    return this.auth.me(principal);
  }
}

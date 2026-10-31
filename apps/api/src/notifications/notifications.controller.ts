import { Body, Controller, Delete, HttpCode, Put } from '@nestjs/common';
import { PushTokenBody } from '@repo/dto/validation';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import { assertOwner, type Principal } from '../auth/principal.js';
import { NotificationsService } from './notifications.service.js';

@Controller('push-tokens')
@OwnerOnly()
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Put()
  @HttpCode(204)
  async register(
    @Body() body: PushTokenBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    assertOwner(principal);
    await this.notifications.registerToken(principal.accountId, body.token);
  }

  @Delete()
  @HttpCode(204)
  async unregister(
    @Body() body: PushTokenBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    assertOwner(principal);
    await this.notifications.unregisterToken(principal.accountId, body.token);
  }
}

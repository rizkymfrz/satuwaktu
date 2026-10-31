import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateSettingsBody } from '@repo/dto/validation';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import { assertOwner, type Principal } from '../auth/principal.js';
import { SettingsService } from './settings.service.js';

@Controller('settings')
@OwnerOnly()
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(@CurrentPrincipal() principal: Principal) {
    assertOwner(principal);
    return this.settings.get(principal.accountId);
  }

  @Patch()
  update(
    @Body() body: UpdateSettingsBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    assertOwner(principal);
    return this.settings.update(principal.accountId, body);
  }
}

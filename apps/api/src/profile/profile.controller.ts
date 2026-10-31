import { Controller, Get } from '@nestjs/common';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import { assertOwner, type Principal } from '../auth/principal.js';
import { ProfileService } from './profile.service.js';

@Controller('profile')
@OwnerOnly()
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get('stats')
  stats(@CurrentPrincipal() principal: Principal) {
    assertOwner(principal);
    return this.profile.stats(principal.accountId);
  }
}

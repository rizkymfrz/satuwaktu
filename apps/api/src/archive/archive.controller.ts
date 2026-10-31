import { Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import type { Principal } from '../auth/principal.js';
import { THROTTLE_WINDOW_MS } from '../config/api.config.js';
import { ArchiveService } from './archive.service.js';

export const VISIT_LIMIT = 5;

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archive: ArchiveService) {}

  @Get()
  get(@CurrentPrincipal() principal: Principal) {
    return this.archive.get(principal);
  }

  @Post('visits')
  @Throttle({ default: { limit: VISIT_LIMIT, ttl: THROTTLE_WINDOW_MS } })
  recordVisit(@CurrentPrincipal() principal: Principal) {
    return this.archive.recordVisit(principal);
  }
}

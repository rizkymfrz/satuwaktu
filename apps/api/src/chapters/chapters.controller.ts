import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateChapterBody } from '@repo/dto/validation';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import type { Principal } from '../auth/principal.js';
import { ChaptersService } from './chapters.service.js';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chapters: ChaptersService) {}

  @Get()
  list(@CurrentPrincipal() principal: Principal) {
    return this.chapters.list(principal);
  }

  @Post()
  @OwnerOnly()
  create(@Body() body: CreateChapterBody) {
    return this.chapters.create(body);
  }
}

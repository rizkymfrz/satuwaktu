import { Controller, Delete, Param, Put } from '@nestjs/common';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import type { Principal } from '../auth/principal.js';
import { LikesService } from './likes.service.js';

@Controller('fragments/:id/like')
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @Put()
  like(@Param('id') id: string, @CurrentPrincipal() principal: Principal) {
    return this.likes.like(id, principal);
  }

  @Delete()
  unlike(@Param('id') id: string, @CurrentPrincipal() principal: Principal) {
    return this.likes.unlike(id, principal);
  }
}

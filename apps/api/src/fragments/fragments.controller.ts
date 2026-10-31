import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateFragmentBody,
  ListFragmentsQuery,
  UpdateFragmentBody,
} from '@repo/dto/validation';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import { assertOwner, type Principal } from '../auth/principal.js';
import { FragmentsService } from './fragments.service.js';

@Controller('fragments')
export class FragmentsController {
  constructor(private readonly fragments: FragmentsService) {}

  @Get()
  list(
    @Query() query: ListFragmentsQuery,
    @CurrentPrincipal() principal: Principal,
  ) {
    return this.fragments.list(query, principal);
  }

  @Get('on-this-day')
  onThisDay(@CurrentPrincipal() principal: Principal) {
    return this.fragments.onThisDay(principal);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentPrincipal() principal: Principal) {
    return this.fragments.get(id, principal);
  }

  @Get(':id/neighbors')
  neighbors(@Param('id') id: string, @CurrentPrincipal() principal: Principal) {
    return this.fragments.neighbors(id, principal);
  }

  @Post()
  @OwnerOnly()
  create(
    @Body() body: CreateFragmentBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    assertOwner(principal);
    return this.fragments.create(body, principal);
  }

  @Patch(':id')
  @OwnerOnly()
  update(
    @Param('id') id: string,
    @Body() body: UpdateFragmentBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    assertOwner(principal);
    return this.fragments.update(id, body, principal);
  }

  @Delete(':id')
  @OwnerOnly()
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.fragments.remove(id);
  }
}

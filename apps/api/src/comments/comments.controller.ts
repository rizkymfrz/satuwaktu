import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  CreateCommentBody,
  CreateReplyBody,
  ListCommentsQuery,
} from '@repo/dto/validation';
import { CurrentPrincipal } from '../auth/current-principal.decorator.js';
import { OwnerOnly } from '../auth/owner.guard.js';
import type { Principal } from '../auth/principal.js';
import { THROTTLE_WINDOW_MS } from '../config/api.config.js';
import { CommentsService } from './comments.service.js';

export const COMMENT_LIMIT = 10;

@Controller('fragments/:id/comments')
export class FragmentCommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get()
  list(
    @Param('id') id: string,
    @Query() query: ListCommentsQuery,
    @CurrentPrincipal() principal: Principal,
  ) {
    return this.comments.list(id, query, principal);
  }

  @Post()
  @Throttle({ default: { limit: COMMENT_LIMIT, ttl: THROTTLE_WINDOW_MS } })
  create(
    @Param('id') id: string,
    @Body() body: CreateCommentBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    return this.comments.create(id, body, principal);
  }
}

@Controller('comments/:id/replies')
export class CommentRepliesController {
  constructor(private readonly comments: CommentsService) {}

  @Post()
  @OwnerOnly()
  reply(
    @Param('id') id: string,
    @Body() body: CreateReplyBody,
    @CurrentPrincipal() principal: Principal,
  ) {
    return this.comments.reply(id, body, principal);
  }
}

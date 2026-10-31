import { Injectable, NotFoundException } from '@nestjs/common';
import type { CommentPage, CommentView, ReplyView } from '@repo/dto';
import type {
  CreateCommentBody,
  CreateReplyBody,
  ListCommentsQuery,
} from '@repo/dto/validation';
import { assertOwner, type Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  COMMENT_SELECT,
  REPLY_SELECT,
  toCommentView,
  toReplyView,
} from './comment.view.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(
    fragmentId: string,
    query: ListCommentsQuery,
    principal: Principal,
  ): Promise<CommentPage> {
    await this.ensureVisible(fragmentId, principal);
    const { cursor, limit } = query;
    const records = await this.prisma.db.comment.findMany({
      where: { fragmentId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: COMMENT_SELECT,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const hasMore = records.length > limit;
    const page = hasMore ? records.slice(0, limit) : records;
    return {
      items: page.map(toCommentView),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    };
  }

  async create(
    fragmentId: string,
    body: CreateCommentBody,
    principal: Principal,
  ): Promise<CommentView> {
    await this.ensureVisible(fragmentId, principal);
    const record = await this.prisma.db.comment.create({
      data: {
        fragmentId,
        text: body.text,
        deviceKey: principal.role === 'guest' ? principal.deviceKey : null,
      },
      select: COMMENT_SELECT,
    });
    void this.notifications.notifyCommentAdded(
      fragmentId,
      body.text,
      principal,
    );
    return toCommentView(record);
  }

  async reply(
    commentId: string,
    body: CreateReplyBody,
    principal: Principal,
  ): Promise<ReplyView> {
    assertOwner(principal);
    const comment = await this.prisma.db.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const record = await this.prisma.db.reply.create({
      data: { commentId, authorId: principal.accountId, text: body.text },
      select: REPLY_SELECT,
    });
    return toReplyView(record);
  }

  private async ensureVisible(fragmentId: string, principal: Principal) {
    const fragment = await this.prisma.db.fragment.findFirst({
      where: { id: fragmentId, visibility: { in: visibleTo(principal) } },
      select: { id: true },
    });
    if (!fragment) {
      throw new NotFoundException('Fragment not found');
    }
  }
}

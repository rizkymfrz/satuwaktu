import type { Prisma } from '@repo/db';
import type { CommentView, ReplyView } from '@repo/dto';

export const REPLY_SELECT = {
  id: true,
  text: true,
  createdAt: true,
  author: { select: { id: true, name: true } },
} satisfies Prisma.ReplySelect;

export const COMMENT_SELECT = {
  id: true,
  text: true,
  createdAt: true,
  replies: {
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    select: REPLY_SELECT,
  },
} satisfies Prisma.CommentSelect;

export type ReplyRecord = Prisma.ReplyGetPayload<{
  select: typeof REPLY_SELECT;
}>;

export type CommentRecord = Prisma.CommentGetPayload<{
  select: typeof COMMENT_SELECT;
}>;

export function toReplyView(record: ReplyRecord): ReplyView {
  return {
    id: record.id,
    text: record.text,
    createdAt: record.createdAt.toISOString(),
    author: { id: record.author.id, name: record.author.name },
  };
}

export function toCommentView(record: CommentRecord): CommentView {
  return {
    id: record.id,
    text: record.text,
    createdAt: record.createdAt.toISOString(),
    replies: record.replies.map(toReplyView),
  };
}

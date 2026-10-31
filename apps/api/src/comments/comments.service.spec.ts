import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ListCommentsQuery } from '@repo/dto/validation';
import type { GuestPrincipal, OwnerPrincipal } from '../auth/principal.js';
import type { NotificationsService } from '../notifications/notifications.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import { CommentsService } from './comments.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

function commentRecord(id: string, withReply = false) {
  return {
    id,
    text: `text ${id}`,
    createdAt: new Date('2025-04-01T00:00:00.000Z'),
    replies: withReply
      ? [
          {
            id: `reply-${id}`,
            text: 'balasan',
            createdAt: new Date('2025-04-01T01:00:00.000Z'),
            author: { id: 'akun-ann', name: 'annfarta' },
          },
        ]
      : [],
  };
}

function query(overrides: Partial<ListCommentsQuery> = {}) {
  return Object.assign(new ListCommentsQuery(), overrides);
}

function setup({
  visible = true,
  comments = [] as unknown[],
  commentExists = true,
} = {}) {
  const db = {
    fragment: {
      findFirst: vi.fn().mockResolvedValue(visible ? { id: 'frag-1' } : null),
    },
    comment: {
      findMany: vi.fn().mockResolvedValue(comments),
      findUnique: vi
        .fn()
        .mockResolvedValue(commentExists ? { id: 'c1' } : null),
      create: vi.fn().mockResolvedValue(commentRecord('c1')),
    },
    reply: {
      create: vi.fn().mockResolvedValue({
        id: 'r1',
        text: 'balasan',
        createdAt: new Date('2025-04-02T00:00:00.000Z'),
        author: { id: 'akun-ann', name: 'annfarta' },
      }),
    },
  };
  const notifications = {
    notifyCommentAdded: vi.fn().mockResolvedValue(undefined),
  };
  return {
    service: new CommentsService(
      { db } as unknown as PrismaService,
      notifications as unknown as NotificationsService,
    ),
    db,
    notifications,
  };
}

describe('CommentsService', () => {
  describe('list', () => {
    it('returns comments newest first with their replies', async () => {
      const { service, db } = setup({
        comments: [commentRecord('c2', true), commentRecord('c1')],
      });
      const page = await service.list('frag-1', query(), GUEST);
      expect(db.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { fragmentId: 'frag-1' },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: 21,
        }),
      );
      expect(page.items[0]).toEqual({
        id: 'c2',
        text: 'text c2',
        createdAt: '2025-04-01T00:00:00.000Z',
        replies: [
          {
            id: 'reply-c2',
            text: 'balasan',
            createdAt: '2025-04-01T01:00:00.000Z',
            author: { id: 'akun-ann', name: 'annfarta' },
          },
        ],
      });
      expect(page.nextCursor).toBeNull();
    });

    it('paginates with a cursor', async () => {
      const { service } = setup({
        comments: [
          commentRecord('c3'),
          commentRecord('c2'),
          commentRecord('c1'),
        ],
      });
      const page = await service.list('frag-1', query({ limit: 2 }), GUEST);
      expect(page.items.map((item) => item.id)).toEqual(['c3', 'c2']);
      expect(page.nextCursor).toBe('c2');
    });

    it('does not reveal comments of a fragment the caller cannot see', async () => {
      const { service, db } = setup({ visible: false });
      await expect(
        service.list('frag-1', query(), GUEST),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(db.comment.findMany).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('tells the owners about the new comment', async () => {
      const { service, notifications } = setup();
      await service.create('frag-1', { text: 'Rindu masa itu' }, GUEST);
      expect(notifications.notifyCommentAdded).toHaveBeenCalledWith(
        'frag-1',
        'Rindu masa itu',
        GUEST,
      );
    });

    it('does not notify when the fragment is hidden', async () => {
      const { service, notifications } = setup({ visible: false });
      await expect(
        service.create('frag-1', { text: 'Halo' }, GUEST),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(notifications.notifyCommentAdded).not.toHaveBeenCalled();
    });

    it('stores a guest comment with the device key', async () => {
      const { service, db } = setup();
      await service.create('frag-1', { text: 'halo' }, GUEST);
      expect(db.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            fragmentId: 'frag-1',
            text: 'halo',
            deviceKey: 'device-12345',
          },
        }),
      );
    });

    it('keeps owner comments anonymous too', async () => {
      const { service, db } = setup();
      await service.create('frag-1', { text: 'halo' }, OWNER);
      expect(db.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { fragmentId: 'frag-1', text: 'halo', deviceKey: null },
        }),
      );
    });

    it('refuses comments on invisible fragments', async () => {
      const { service, db } = setup({ visible: false });
      await expect(
        service.create('frag-1', { text: 'halo' }, GUEST),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(db.comment.create).not.toHaveBeenCalled();
    });
  });

  describe('reply', () => {
    it('lets an owner reply and records the author', async () => {
      const { service, db } = setup();
      const reply = await service.reply('c1', { text: 'balasan' }, OWNER);
      expect(db.reply.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { commentId: 'c1', authorId: 'akun-ann', text: 'balasan' },
        }),
      );
      expect(reply.author).toEqual({ id: 'akun-ann', name: 'annfarta' });
    });

    it('rejects guests', async () => {
      const { service, db } = setup();
      await expect(
        service.reply('c1', { text: 'balasan' }, GUEST),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(db.reply.create).not.toHaveBeenCalled();
    });

    it('404s on an unknown comment', async () => {
      const { service } = setup({ commentExists: false });
      await expect(
        service.reply('nope', { text: 'balasan' }, OWNER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

import type { GuestPrincipal, OwnerPrincipal } from '../auth/principal.js';
import type { FragmentsService } from '../fragments/fragments.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from './notifications.service.js';
import type { PushService } from './push.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

function setup({
  devices = [{ token: 'ExponentPushToken[a]' }],
  caption = 'Senja di Bandung' as string | null,
  memories = [] as { id: string; caption: string; yearsAgo: number }[],
} = {}) {
  const db = {
    accountSettings: { upsert: vi.fn().mockResolvedValue({}) },
    pushDevice: {
      upsert: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue(devices),
    },
    fragment: {
      findUnique: vi
        .fn()
        .mockResolvedValue(caption === null ? null : { caption }),
    },
  };
  const push = { send: vi.fn().mockResolvedValue(undefined) };
  const fragments = {
    findOnThisDay: vi.fn().mockResolvedValue(memories[0] ?? null),
  };
  const service = new NotificationsService(
    { db } as unknown as PrismaService,
    push as unknown as PushService,
    fragments as unknown as FragmentsService,
  );
  return { service, db, push, fragments };
}

describe('NotificationsService', () => {
  describe('tokens', () => {
    it('makes sure the account has settings, then stores the token', async () => {
      const { service, db } = setup();
      await service.registerToken('akun-ann', 'ExponentPushToken[a]');
      expect(db.accountSettings.upsert).toHaveBeenCalledWith({
        where: { accountId: 'akun-ann' },
        create: { accountId: 'akun-ann' },
        update: {},
      });
      expect(db.pushDevice.upsert).toHaveBeenCalledWith({
        where: { token: 'ExponentPushToken[a]' },
        create: { accountId: 'akun-ann', token: 'ExponentPushToken[a]' },
        update: { accountId: 'akun-ann' },
      });
    });

    it('only removes a token that belongs to the caller', async () => {
      const { service, db } = setup();
      await service.unregisterToken('akun-ann', 'ExponentPushToken[a]');
      expect(db.pushDevice.deleteMany).toHaveBeenCalledWith({
        where: { accountId: 'akun-ann', token: 'ExponentPushToken[a]' },
      });
    });
  });

  describe('notifyCommentAdded', () => {
    it('pushes the comment to owners who want comment notifications', async () => {
      const { service, db, push } = setup();
      await service.notifyCommentAdded('frag-1', 'Rindu masa itu', GUEST);
      expect(db.pushDevice.findMany).toHaveBeenCalledWith({
        where: { account: { settings: { notifComment: true } } },
        select: { token: true },
      });
      expect(push.send).toHaveBeenCalledWith(
        [
          {
            to: 'ExponentPushToken[a]',
            title: 'Titipan kata baru',
            body: 'Rindu masa itu',
            data: { fragmentId: 'frag-1' },
          },
        ],
        expect.any(Function),
      );
    });

    it('shortens long comments', async () => {
      const { service, push } = setup();
      await service.notifyCommentAdded('frag-1', 'a'.repeat(150), GUEST);
      const [[message]] = push.send.mock.calls[0]!;
      expect(message.body).toBe(`${'a'.repeat(100)}…`);
    });

    it('skips the owner who wrote the comment', async () => {
      const { service, db } = setup();
      await service.notifyCommentAdded('frag-1', 'Halo', OWNER);
      expect(db.pushDevice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            account: { settings: { notifComment: true } },
            accountId: { not: 'akun-ann' },
          },
        }),
      );
    });

    it('sends nothing when no device wants it', async () => {
      const { service, push } = setup({ devices: [] });
      await service.notifyCommentAdded('frag-1', 'Halo', GUEST);
      expect(push.send).not.toHaveBeenCalled();
    });

    it('never fails the caller when delivery breaks', async () => {
      const { service, push } = setup();
      push.send.mockRejectedValue(new Error('expo down'));
      await expect(
        service.notifyCommentAdded('frag-1', 'Halo', GUEST),
      ).resolves.toBeUndefined();
    });
  });

  describe('notifyLikeAdded', () => {
    it('quotes the caption of the liked fragment', async () => {
      const { service, db, push } = setup();
      await service.notifyLikeAdded('frag-1', GUEST);
      expect(db.pushDevice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { account: { settings: { notifLike: true } } },
        }),
      );
      expect(push.send).toHaveBeenCalledWith(
        [
          {
            to: 'ExponentPushToken[a]',
            title: 'Like baru',
            body: 'Seseorang menyukai "Senja di Bandung"',
            data: { fragmentId: 'frag-1' },
          },
        ],
        expect.any(Function),
      );
    });

    it('falls back to a generic line when there is no caption', async () => {
      const { service, push } = setup({ caption: '' });
      await service.notifyLikeAdded('frag-1', GUEST);
      expect(push.send.mock.calls[0]![0][0].body).toBe(
        'Seseorang menyukai sebuah fragmen',
      );
    });
  });

  describe('stale devices', () => {
    it('forgets the tokens that the push service reports as stale', async () => {
      const { service, db, push } = setup();
      await service.notifyCommentAdded('frag-1', 'Halo', GUEST);
      const [, onStaleTokens] = push.send.mock.calls[0]!;
      await onStaleTokens(['ExponentPushToken[a]']);
      expect(db.pushDevice.deleteMany).toHaveBeenCalledWith({
        where: { token: { in: ['ExponentPushToken[a]'] } },
      });
    });
  });

  describe('notifyOnThisDay', () => {
    it('reminds about the newest memory from an earlier year', async () => {
      const { service, db, push, fragments } = setup({
        memories: [{ id: 'frag-9', caption: 'Hari pertama', yearsAgo: 3 }],
      });
      const now = new Date('2026-10-28T01:00:00.000Z');
      await service.notifyOnThisDay(now);
      expect(fragments.findOnThisDay).toHaveBeenCalledWith(now, [
        'PUBLIC',
        'PRIVATE',
      ]);
      expect(db.pushDevice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { account: { settings: { notifOnThisDay: true } } },
        }),
      );
      expect(push.send).toHaveBeenCalledWith(
        [
          {
            to: 'ExponentPushToken[a]',
            title: 'Hari Ini Dulu',
            body: '3 tahun lalu: Hari pertama',
            data: { fragmentId: 'frag-9' },
          },
        ],
        expect.any(Function),
      );
    });

    it('uses a generic line for a memory without caption', async () => {
      const { service, push } = setup({
        memories: [{ id: 'frag-9', caption: '', yearsAgo: 1 }],
      });
      await service.notifyOnThisDay(new Date('2026-10-28T01:00:00.000Z'));
      expect(push.send.mock.calls[0]![0][0].body).toBe(
        '1 tahun lalu: sebuah kenangan',
      );
    });

    it('stays quiet when nothing happened on this day', async () => {
      const { service, push } = setup();
      await service.notifyOnThisDay(new Date('2026-10-28T01:00:00.000Z'));
      expect(push.send).not.toHaveBeenCalled();
    });

    it('does not look for memories when nobody wants the reminder', async () => {
      const { service, fragments } = setup({ devices: [] });
      await service.notifyOnThisDay(new Date('2026-10-28T01:00:00.000Z'));
      expect(fragments.findOnThisDay).not.toHaveBeenCalled();
    });
  });
});

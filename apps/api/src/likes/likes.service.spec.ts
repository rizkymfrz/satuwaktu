import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { GuestPrincipal, OwnerPrincipal } from '../auth/principal.js';
import type { NotificationsService } from '../notifications/notifications.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import { LikesService } from './likes.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };
const ANONYMOUS: GuestPrincipal = { role: 'guest', deviceKey: null };

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

function setup({ found = true, total = 3, created = 1 } = {}) {
  const db = {
    fragment: {
      findFirst: vi.fn().mockResolvedValue(found ? { id: 'frag-1' } : null),
    },
    like: {
      createMany: vi.fn().mockResolvedValue({ count: created }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      count: vi.fn().mockResolvedValue(total),
    },
  };
  const notifications = {
    notifyLikeAdded: vi.fn().mockResolvedValue(undefined),
  };
  const service = new LikesService(
    { db } as unknown as PrismaService,
    notifications as unknown as NotificationsService,
  );
  return { service, db, notifications };
}

describe('LikesService', () => {
  it('records a guest like keyed by device and returns the new total', async () => {
    const { service, db } = setup({ total: 7 });
    await expect(service.like('frag-1', GUEST)).resolves.toEqual({
      liked: true,
      likes: 7,
    });
    expect(db.like.createMany).toHaveBeenCalledWith({
      data: [{ fragmentId: 'frag-1', voterKey: 'device:device-12345' }],
      skipDuplicates: true,
    });
  });

  it('tells the owners about a new like', async () => {
    const { service, notifications } = setup();
    await service.like('frag-1', GUEST);
    expect(notifications.notifyLikeAdded).toHaveBeenCalledWith('frag-1', GUEST);
  });

  it('stays quiet when the like already existed', async () => {
    const { service, notifications } = setup({ created: 0 });
    await service.like('frag-1', GUEST);
    expect(notifications.notifyLikeAdded).not.toHaveBeenCalled();
  });

  it('stays quiet on unlike', async () => {
    const { service, notifications } = setup();
    await service.unlike('frag-1', GUEST);
    expect(notifications.notifyLikeAdded).not.toHaveBeenCalled();
  });

  it('keys owner likes by account', async () => {
    const { service, db } = setup();
    await service.like('frag-1', OWNER);
    expect(db.like.createMany).toHaveBeenCalledWith({
      data: [{ fragmentId: 'frag-1', voterKey: 'account:akun-ann' }],
      skipDuplicates: true,
    });
  });

  it('removes only the caller’s like on unlike', async () => {
    const { service, db } = setup({ total: 2 });
    await expect(service.unlike('frag-1', GUEST)).resolves.toEqual({
      liked: false,
      likes: 2,
    });
    expect(db.like.deleteMany).toHaveBeenCalledWith({
      where: { fragmentId: 'frag-1', voterKey: 'device:device-12345' },
    });
  });

  it('requires a device id for guests', async () => {
    const { service, db } = setup();
    await expect(service.like('frag-1', ANONYMOUS)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(db.like.createMany).not.toHaveBeenCalled();
  });

  it('hides fragments the caller cannot see', async () => {
    const { service, db } = setup({ found: false });
    await expect(service.like('frag-1', GUEST)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(db.fragment.findFirst).toHaveBeenCalledWith({
      where: { id: 'frag-1', visibility: { in: ['PUBLIC'] } },
      select: { id: true },
    });
    expect(db.like.createMany).not.toHaveBeenCalled();
  });
});

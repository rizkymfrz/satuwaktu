import { NotFoundException } from '@nestjs/common';
import type { GuestPrincipal } from '../auth/principal.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import { ArchiveService } from './archive.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };

function setup({
  visitCount = 8,
  hasMeta = true,
  oldestTakenAt = null as Date | null,
} = {}) {
  const db = {
    archiveMeta: {
      findUnique: vi
        .fn()
        .mockResolvedValue(
          hasMeta
            ? { startedAt: new Date('2024-01-01T00:00:00.000Z'), visitCount }
            : null,
        ),
      update: vi.fn().mockResolvedValue({}),
    },
    fragment: {
      count: vi.fn().mockResolvedValue(12),
      aggregate: vi
        .fn()
        .mockResolvedValue({ _min: { takenAt: oldestTakenAt } }),
    },
    like: { count: vi.fn().mockResolvedValue(30) },
    chapter: { count: vi.fn().mockResolvedValue(3) },
  };
  const service = new ArchiveService({ db } as unknown as PrismaService);
  return { service, db };
}

describe('ArchiveService', () => {
  describe('recordVisit', () => {
    it('adds one to the counter and returns the fresh stats', async () => {
      const { service, db } = setup({ visitCount: 9 });
      const view = await service.recordVisit(GUEST);
      expect(db.archiveMeta.update).toHaveBeenCalledWith({
        where: { id: 'archive' },
        data: { visitCount: { increment: 1 } },
      });
      expect(view).toEqual({
        startedAt: '2024-01-01T00:00:00.000Z',
        visitCount: 9,
        fragmentCount: 12,
        likeCount: 30,
        chapterCount: 3,
      });
    });
  });

  describe('get', () => {
    it('never changes the counter', async () => {
      const { service, db } = setup();
      await service.get(GUEST);
      expect(db.archiveMeta.update).not.toHaveBeenCalled();
    });

    it('starts at the oldest fragment when it predates the archive', async () => {
      const { service, db } = setup({
        oldestTakenAt: new Date('2022-05-10T08:00:00.000Z'),
      });
      const view = await service.get(GUEST);
      expect(db.fragment.aggregate).toHaveBeenCalledWith({
        _min: { takenAt: true },
      });
      expect(view.startedAt).toBe('2022-05-10T08:00:00.000Z');
    });

    it('keeps the archive start when every fragment is newer', async () => {
      const { service } = setup({
        oldestTakenAt: new Date('2025-01-01T00:00:00.000Z'),
      });
      const view = await service.get(GUEST);
      expect(view.startedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('fails when the archive has not been initialised', async () => {
      const { service } = setup({ hasMeta: false });
      await expect(service.get(GUEST)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});

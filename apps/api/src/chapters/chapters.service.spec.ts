import { ConflictException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service.js';
import { ChaptersService } from './chapters.service.js';

function setup({
  existing = null as { id: string } | null,
  maxPosition = null as number | null,
} = {}) {
  const db = {
    chapter: {
      findFirst: vi.fn().mockResolvedValue(existing),
      aggregate: vi.fn().mockResolvedValue({ _max: { position: maxPosition } }),
      create: vi
        .fn()
        .mockImplementation(({ data }) =>
          Promise.resolve({ id: 'chapter-new', ...data }),
        ),
    },
  };
  const service = new ChaptersService({ db } as unknown as PrismaService);
  return { service, db };
}

describe('ChaptersService create', () => {
  it('appends the chapter after the last position and returns an empty view', async () => {
    const { service, db } = setup({ maxPosition: 3 });
    const view = await service.create({ name: 'Liburan' });
    expect(db.chapter.create).toHaveBeenCalledWith({
      data: { name: 'Liburan', position: 4 },
    });
    expect(view).toEqual({
      id: 'chapter-new',
      name: 'Liburan',
      position: 4,
      fragmentCount: 0,
      likeCount: 0,
      firstTakenAt: null,
      lastTakenAt: null,
      preview: [],
    });
  });

  it('starts at position zero when there are no chapters', async () => {
    const { service, db } = setup();
    await service.create({ name: 'Pertama' });
    expect(db.chapter.create).toHaveBeenCalledWith({
      data: { name: 'Pertama', position: 0 },
    });
  });

  it('refuses a name that exists, ignoring case', async () => {
    const { service, db } = setup({ existing: { id: 'chapter-rumah' } });
    await expect(service.create({ name: 'rumah' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(db.chapter.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { equals: 'rumah', mode: 'insensitive' } },
      }),
    );
    expect(db.chapter.create).not.toHaveBeenCalled();
  });
});

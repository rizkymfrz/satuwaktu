import { Prisma } from '@repo/db';
import type { GuestPrincipal, OwnerPrincipal } from '../auth/principal.js';
import type { MediaService } from '../media/media.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { FragmentRecord } from './fragment.view.js';
import { FragmentsService } from './fragments.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

const NOW = new Date('2026-10-28T01:00:00.000Z');

function record(id: string) {
  return {
    id,
    caption: 'Hari pertama',
    takenAt: new Date('2023-10-28T01:00:00.000Z'),
    visibility: 'PUBLIC',
    pinned: false,
    photoUrl: null,
    photoWidth: null,
    photoHeight: null,
    latitude: null,
    longitude: null,
    placeName: null,
    songTitle: null,
    songArtist: null,
    songUri: null,
    songArtworkUrl: null,
    songStartSec: null,
    songEndSec: null,
    createdAt: new Date('2023-10-28T02:00:00.000Z'),
    chapter: null,
    uploader: { id: 'akun-ann', name: 'annfarta' },
    likes: [],
    _count: { likes: 1, comments: 0 },
  } as FragmentRecord;
}

function setup(
  found: { id: string; caption: string; yearsAgo: number } | null,
) {
  const db = {
    $queryRaw: vi.fn().mockResolvedValue(found ? [found] : []),
    fragment: {
      findFirst: vi.fn().mockResolvedValue(found ? record(found.id) : null),
    },
  };
  const service = new FragmentsService(
    { db } as unknown as PrismaService,
    {} as unknown as MediaService,
  );
  return { service, db };
}

function visibilitiesSent(db: { $queryRaw: ReturnType<typeof vi.fn> }) {
  const [, ...values] = db.$queryRaw.mock.calls[0]!;
  return values.find((value) => value instanceof Prisma.Sql)!.values;
}

describe('FragmentsService onThisDay', () => {
  it('returns the memory found for today', async () => {
    const { service, db } = setup({
      id: 'frag-9',
      caption: 'Hari pertama',
      yearsAgo: 3,
    });
    const result = await service.onThisDay(GUEST, NOW);
    expect(result.memory).toMatchObject({
      id: 'frag-9',
      caption: 'Hari pertama',
    });
    expect(db.fragment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'frag-9', visibility: { in: ['PUBLIC'] } },
      }),
    );
  });

  it('answers with an explicit null when nothing happened on this day', async () => {
    const { service, db } = setup(null);
    await expect(service.onThisDay(GUEST, NOW)).resolves.toEqual({
      memory: null,
    });
    expect(db.fragment.findFirst).not.toHaveBeenCalled();
  });

  it('only searches public fragments for guests', async () => {
    const { service, db } = setup(null);
    await service.onThisDay(GUEST, NOW);
    expect(visibilitiesSent(db)).toEqual(['PUBLIC']);
  });

  it('searches private fragments too for owners', async () => {
    const { service, db } = setup(null);
    await service.onThisDay(OWNER, NOW);
    expect(visibilitiesSent(db)).toEqual(['PUBLIC', 'PRIVATE']);
  });
});

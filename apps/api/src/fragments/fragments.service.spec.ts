import { NotFoundException } from '@nestjs/common';
import { ListFragmentsQuery } from '@repo/dto/validation';
import type { GuestPrincipal, OwnerPrincipal } from '../auth/principal.js';
import type { MediaService } from '../media/media.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import { DEFAULT_ASPECT, type FragmentRecord } from './fragment.view.js';
import { FragmentsService } from './fragments.service.js';

const GUEST: GuestPrincipal = { role: 'guest', deviceKey: 'device-12345' };

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

function record(id: string, overrides: Partial<FragmentRecord> = {}) {
  return {
    id,
    caption: `caption ${id}`,
    takenAt: new Date('2025-03-01T00:00:00.000Z'),
    visibility: 'PUBLIC',
    pinned: false,
    photoUrl: null,
    photoWidth: 1000,
    photoHeight: 1500,
    latitude: -6.9,
    longitude: 107.6,
    placeName: 'Bandung',
    songTitle: null,
    songArtist: null,
    songUri: null,
    songArtworkUrl: null,
    songStartSec: null,
    songEndSec: null,
    createdAt: new Date('2025-03-02T00:00:00.000Z'),
    chapter: { id: 'chapter-rumah', name: 'Rumah' },
    uploader: { id: 'akun-ann', name: 'annfarta' },
    likes: [],
    _count: { likes: 4, comments: 2 },
    ...overrides,
  } as FragmentRecord;
}

function query(overrides: Partial<ListFragmentsQuery> = {}) {
  return Object.assign(new ListFragmentsQuery(), overrides);
}

function setup(fragment: {
  findMany?: ReturnType<typeof vi.fn>;
  findFirst?: ReturnType<typeof vi.fn>;
}) {
  const prisma = { db: { fragment } } as unknown as PrismaService;
  return new FragmentsService(prisma, {} as unknown as MediaService);
}

describe('FragmentsService', () => {
  describe('list', () => {
    it('only asks guests for public fragments, newest first', async () => {
      const findMany = vi.fn().mockResolvedValue([]);
      await setup({ findMany }).list(query(), GUEST);
      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { visibility: { in: ['PUBLIC'] }, AND: [] },
          orderBy: [{ takenAt: 'desc' }, { id: 'desc' }],
          take: 21,
        }),
      );
    });

    it('lets owners see private fragments too', async () => {
      const findMany = vi.fn().mockResolvedValue([]);
      await setup({ findMany }).list(query(), OWNER);
      const { where } = findMany.mock.calls[0]![0];
      expect(where.visibility).toEqual({ in: ['PUBLIC', 'PRIVATE'] });
    });

    it('returns a next cursor only when there is another page', async () => {
      const findMany = vi
        .fn()
        .mockResolvedValue([record('a'), record('b'), record('c')]);
      const page = await setup({ findMany }).list(query({ limit: 2 }), GUEST);
      expect(page.items.map((item) => item.id)).toEqual(['a', 'b']);
      expect(page.nextCursor).toBe('b');
    });

    it('has no next cursor on the last page', async () => {
      const findMany = vi.fn().mockResolvedValue([record('a'), record('b')]);
      const page = await setup({ findMany }).list(query({ limit: 2 }), GUEST);
      expect(page.items).toHaveLength(2);
      expect(page.nextCursor).toBeNull();
    });

    it('passes the cursor to Prisma and skips the cursor row', async () => {
      const findMany = vi.fn().mockResolvedValue([]);
      await setup({ findMany }).list(query({ cursor: 'abc' }), GUEST);
      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: { id: 'abc' }, skip: 1 }),
      );
    });

    it('translates filters into the where clause', async () => {
      const findMany = vi.fn().mockResolvedValue([]);
      await setup({ findMany }).list(
        query({
          chapterId: 'none',
          hasLocation: true,
          pinned: true,
          q: ' kopi ',
        }),
        GUEST,
      );
      const { where } = findMany.mock.calls[0]![0];
      expect(where.AND).toEqual([
        { chapterId: null },
        { latitude: { not: null }, longitude: { not: null } },
        { pinned: true },
        {
          OR: [
            { caption: { contains: 'kopi', mode: 'insensitive' } },
            { chapter: { name: { contains: 'kopi', mode: 'insensitive' } } },
          ],
        },
      ]);
    });

    it('narrows the list to one uploader without widening visibility', async () => {
      const findMany = vi.fn().mockResolvedValue([]);
      await setup({ findMany }).list(query({ uploaderId: 'akun-ann' }), GUEST);
      const { where } = findMany.mock.calls[0]![0];
      expect(where).toEqual({
        visibility: { in: ['PUBLIC'] },
        AND: [{ uploaderId: 'akun-ann' }],
      });
    });
  });

  describe('get', () => {
    it('maps the record to the public view', async () => {
      const findFirst = vi.fn().mockResolvedValue(record('a'));
      const view = await setup({ findFirst }).get('a', GUEST);
      expect(findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'a', visibility: { in: ['PUBLIC'] } },
        }),
      );
      expect(view).toMatchObject({
        id: 'a',
        aspect: 1.5,
        likes: 4,
        comments: 2,
        takenAt: '2025-03-01T00:00:00.000Z',
        location: { latitude: -6.9, longitude: 107.6, name: 'Bandung' },
        chapter: { id: 'chapter-rumah', name: 'Rumah' },
      });
    });

    it('exposes the song when the fragment has one', async () => {
      const findFirst = vi.fn().mockResolvedValue(
        record('a', {
          songTitle: 'Lagu',
          songArtist: 'Penyanyi',
          songUri: 'https://cdn.example.com/lagu.m4a',
          songArtworkUrl: null,
          songStartSec: 5,
          songEndSec: 20,
        }),
      );
      const view = await setup({ findFirst }).get('a', GUEST);
      expect(view.song).toEqual({
        title: 'Lagu',
        artist: 'Penyanyi',
        uri: 'https://cdn.example.com/lagu.m4a',
        artworkUrl: null,
        startSec: 5,
        endSec: 20,
      });
    });

    it('returns a null song when none is stored', async () => {
      const findFirst = vi.fn().mockResolvedValue(record('a'));
      const view = await setup({ findFirst }).get('a', GUEST);
      expect(view.song).toBeNull();
    });

    it('lets owners fetch a private fragment', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValue(record('a', { visibility: 'PRIVATE' }));
      const view = await setup({ findFirst }).get('a', OWNER);
      expect(findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'a', visibility: { in: ['PUBLIC', 'PRIVATE'] } },
        }),
      );
      expect(view.visibility).toBe('PRIVATE');
    });

    it('marks a fragment the caller already liked', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValue(record('a', { likes: [{ id: 'like-1' }] }));
      const view = await setup({ findFirst }).get('a', GUEST);
      expect(view.likedByMe).toBe(true);
      expect(findFirst.mock.calls[0]![0].select.likes.where).toEqual({
        voterKey: 'device:device-12345',
      });
    });

    it('never matches a like for a guest without a device id', async () => {
      const findFirst = vi.fn().mockResolvedValue(record('a'));
      const anonymous: GuestPrincipal = { role: 'guest', deviceKey: null };
      const view = await setup({ findFirst }).get('a', anonymous);
      expect(view.likedByMe).toBe(false);
      expect(findFirst.mock.calls[0]![0].select.likes.where).toEqual({
        voterKey: '',
      });
    });

    it('falls back to the default aspect and a null location', async () => {
      const findFirst = vi.fn().mockResolvedValue(
        record('a', {
          photoWidth: null,
          photoHeight: null,
          latitude: null,
          longitude: null,
          placeName: null,
        }),
      );
      const view = await setup({ findFirst }).get('a', GUEST);
      expect(view.aspect).toBe(DEFAULT_ASPECT);
      expect(view.location).toBeNull();
    });

    it('treats private or missing fragments as not found', async () => {
      const findFirst = vi.fn().mockResolvedValue(null);
      await expect(setup({ findFirst }).get('x', GUEST)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('neighbors', () => {
    const current = { id: 'b', takenAt: new Date('2025-03-01T00:00:00.000Z') };
    const older = record('a', {
      takenAt: new Date('2025-02-01T00:00:00.000Z'),
    });
    const newer = record('c', {
      takenAt: new Date('2025-04-01T00:00:00.000Z'),
    });

    it('returns the next older and the next newer fragment', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValueOnce(current)
        .mockResolvedValueOnce(older)
        .mockResolvedValueOnce(newer);
      const result = await setup({ findFirst }).neighbors('b', GUEST);
      expect(result.older).toMatchObject({
        id: 'a',
        takenAt: '2025-02-01T00:00:00.000Z',
      });
      expect(result.newer).toMatchObject({
        id: 'c',
        takenAt: '2025-04-01T00:00:00.000Z',
      });
    });

    it('looks older in descending order and breaks ties by id', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValueOnce(current)
        .mockResolvedValueOnce(older)
        .mockResolvedValueOnce(newer);
      await setup({ findFirst }).neighbors('b', GUEST);
      expect(findFirst.mock.calls[1]![0]).toMatchObject({
        where: {
          visibility: { in: ['PUBLIC'] },
          OR: [
            { takenAt: { lt: current.takenAt } },
            { takenAt: current.takenAt, id: { lt: 'b' } },
          ],
        },
        orderBy: [{ takenAt: 'desc' }, { id: 'desc' }],
      });
    });

    it('looks newer in ascending order and breaks ties by id', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValueOnce(current)
        .mockResolvedValueOnce(older)
        .mockResolvedValueOnce(newer);
      await setup({ findFirst }).neighbors('b', GUEST);
      expect(findFirst.mock.calls[2]![0]).toMatchObject({
        where: {
          visibility: { in: ['PUBLIC'] },
          OR: [
            { takenAt: { gt: current.takenAt } },
            { takenAt: current.takenAt, id: { gt: 'b' } },
          ],
        },
        orderBy: [{ takenAt: 'asc' }, { id: 'asc' }],
      });
    });

    it('answers with null at either end of the archive', async () => {
      const findFirst = vi
        .fn()
        .mockResolvedValueOnce(current)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await expect(setup({ findFirst }).neighbors('b', GUEST)).resolves.toEqual(
        { older: null, newer: null },
      );
    });

    it('only walks public fragments for guests and all of them for owners', async () => {
      const guestFind = vi.fn().mockResolvedValue(null);
      guestFind.mockResolvedValueOnce(current);
      await setup({ findFirst: guestFind }).neighbors('b', GUEST);
      const ownerFind = vi.fn().mockResolvedValue(null);
      ownerFind.mockResolvedValueOnce(current);
      await setup({ findFirst: ownerFind }).neighbors('b', OWNER);
      expect(
        guestFind.mock.calls.map((call) => call[0].where.visibility),
      ).toEqual([{ in: ['PUBLIC'] }, { in: ['PUBLIC'] }, { in: ['PUBLIC'] }]);
      expect(
        ownerFind.mock.calls.map((call) => call[0].where.visibility),
      ).toEqual([
        { in: ['PUBLIC', 'PRIVATE'] },
        { in: ['PUBLIC', 'PRIVATE'] },
        { in: ['PUBLIC', 'PRIVATE'] },
      ]);
    });

    it('treats private or missing fragments as not found', async () => {
      const findFirst = vi.fn().mockResolvedValue(null);
      await expect(
        setup({ findFirst }).neighbors('x', GUEST),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(findFirst).toHaveBeenCalledTimes(1);
    });
  });
});

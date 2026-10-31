import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { OwnerPrincipal } from '../auth/principal.js';
import type { MediaService } from '../media/media.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { FragmentRecord } from './fragment.view.js';
import { FragmentsService } from './fragments.service.js';

const OWNER: OwnerPrincipal = {
  role: 'owner',
  accountId: 'akun-ann',
  name: 'annfarta',
};

const PHOTO = '/v1/media/11111111-1111-1111-1111-111111111111.png';
const OTHER_PHOTO = '/v1/media/22222222-2222-2222-2222-222222222222.png';

function record(overrides: Partial<FragmentRecord> = {}) {
  return {
    id: 'frag-new',
    caption: '',
    takenAt: new Date('2025-03-01T00:00:00.000Z'),
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
    createdAt: new Date('2025-03-02T00:00:00.000Z'),
    chapter: null,
    uploader: { id: 'akun-ann', name: 'annfarta' },
    likes: [],
    _count: { likes: 0, comments: 0 },
    ...overrides,
  } as FragmentRecord;
}

function setup({
  existing = { caption: 'lama', photoUrl: null } as {
    caption: string;
    photoUrl: string | null;
  } | null,
  chapter = { id: 'chapter-rumah' } as { id: string } | null,
  defaultVisibility = null as 'PUBLIC' | 'PRIVATE' | null,
} = {}) {
  const db = {
    fragment: {
      create: vi.fn().mockResolvedValue(record()),
      update: vi.fn().mockResolvedValue(record()),
      delete: vi.fn().mockResolvedValue(undefined),
      findUnique: vi.fn().mockResolvedValue(existing),
      findFirst: vi.fn().mockResolvedValue(record()),
    },
    chapter: { findUnique: vi.fn().mockResolvedValue(chapter) },
    accountSettings: {
      findUnique: vi
        .fn()
        .mockResolvedValue(defaultVisibility ? { defaultVisibility } : null),
    },
  };
  const media = {
    inspect: vi.fn().mockResolvedValue({ width: 1000, height: 1500 }),
    remove: vi.fn().mockResolvedValue(undefined),
  };
  const service = new FragmentsService(
    { db } as unknown as PrismaService,
    media as unknown as MediaService,
  );
  return { service, db, media };
}

describe('FragmentsService writes', () => {
  describe('create', () => {
    it('stores a photo fragment with the size read from the file', async () => {
      const { service, db, media } = setup();
      await service.create(
        {
          photoUrl: PHOTO,
          caption: 'Senja',
          chapterId: 'chapter-rumah',
          location: { latitude: -6.9, longitude: 107.6, name: ' Bandung ' },
        },
        OWNER,
      );
      expect(media.inspect).toHaveBeenCalledWith(PHOTO);
      expect(db.fragment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            caption: 'Senja',
            photoUrl: PHOTO,
            photoWidth: 1000,
            photoHeight: 1500,
            latitude: -6.9,
            longitude: 107.6,
            placeName: 'Bandung',
            chapterId: 'chapter-rumah',
            uploaderId: 'akun-ann',
            pinned: false,
          }),
        }),
      );
    });

    it('stores the song with its clip window', async () => {
      const { service, db } = setup();
      await service.create(
        {
          caption: 'Senja',
          song: {
            title: 'Lagu',
            artist: 'Penyanyi',
            uri: 'https://cdn.example.com/lagu.m4a',
            artworkUrl: 'https://cdn.example.com/lagu.jpg',
            startSec: 4,
            endSec: 24,
          },
        },
        OWNER,
      );
      expect(db.fragment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            songTitle: 'Lagu',
            songArtist: 'Penyanyi',
            songUri: 'https://cdn.example.com/lagu.m4a',
            songArtworkUrl: 'https://cdn.example.com/lagu.jpg',
            songStartSec: 4,
            songEndSec: 24,
          }),
        }),
      );
    });

    it('fills the optional song fields with empty values', async () => {
      const { service, db } = setup();
      await service.create(
        {
          caption: 'Senja',
          song: { title: 'Lagu', uri: 'https://cdn.example.com/lagu.m4a' },
        },
        OWNER,
      );
      expect(db.fragment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            songArtist: '',
            songArtworkUrl: null,
            songStartSec: null,
            songEndSec: null,
          }),
        }),
      );
    });

    it('rejects a song clip that ends before it starts', async () => {
      const { service, db } = setup();
      await expect(
        service.create(
          {
            caption: 'Senja',
            song: {
              title: 'Lagu',
              uri: 'https://cdn.example.com/lagu.m4a',
              startSec: 10,
              endSec: 10,
            },
          },
          OWNER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(db.fragment.create).not.toHaveBeenCalled();
    });

    it('needs a photo or a caption', async () => {
      const { service, db } = setup();
      await expect(service.create({}, OWNER)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(db.fragment.create).not.toHaveBeenCalled();
    });

    it('accepts a caption without a photo', async () => {
      const { service, db } = setup();
      await service.create({ caption: 'Hanya cerita' }, OWNER);
      expect(db.fragment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            photoUrl: null,
            photoWidth: null,
          }),
        }),
      );
    });

    it('falls back to the account default visibility', async () => {
      const { service, db } = setup({ defaultVisibility: 'PRIVATE' });
      await service.create({ caption: 'rahasia' }, OWNER);
      expect(db.fragment.create.mock.calls[0]![0].data.visibility).toBe(
        'PRIVATE',
      );
    });

    it('lets an explicit visibility win', async () => {
      const { service, db } = setup({ defaultVisibility: 'PRIVATE' });
      await service.create({ caption: 'terbuka', visibility: 'PUBLIC' }, OWNER);
      expect(db.fragment.create.mock.calls[0]![0].data.visibility).toBe(
        'PUBLIC',
      );
    });

    it('rejects an unknown chapter', async () => {
      const { service, db } = setup({ chapter: null });
      await expect(
        service.create({ caption: 'x', chapterId: 'nope' }, OWNER),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(db.fragment.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('only touches the fields that were sent', async () => {
      const { service, db } = setup();
      await service.update('frag-1', { pinned: true }, OWNER);
      expect(db.fragment.update.mock.calls[0]![0].data).toEqual({
        pinned: true,
      });
    });

    it('clears the location when null is sent', async () => {
      const { service, db } = setup();
      await service.update('frag-1', { location: null }, OWNER);
      expect(db.fragment.update.mock.calls[0]![0].data).toEqual({
        latitude: null,
        longitude: null,
        placeName: null,
      });
    });

    it('clears the song when null is sent', async () => {
      const { service, db } = setup();
      await service.update('frag-1', { song: null }, OWNER);
      expect(db.fragment.update.mock.calls[0]![0].data).toEqual({
        songTitle: null,
        songArtist: null,
        songUri: null,
        songArtworkUrl: null,
        songStartSec: null,
        songEndSec: null,
      });
    });

    it('moves a fragment out of its chapter with null', async () => {
      const { service, db } = setup();
      await service.update('frag-1', { chapterId: null }, OWNER);
      expect(db.fragment.update.mock.calls[0]![0].data).toEqual({
        chapterId: null,
      });
    });

    it('replaces the photo and removes the old file afterwards', async () => {
      const { service, db, media } = setup({
        existing: { caption: 'lama', photoUrl: PHOTO },
      });
      await service.update('frag-1', { photoUrl: OTHER_PHOTO }, OWNER);
      expect(db.fragment.update.mock.calls[0]![0].data).toMatchObject({
        photoUrl: OTHER_PHOTO,
        photoWidth: 1000,
        photoHeight: 1500,
      });
      expect(media.remove).toHaveBeenCalledWith(PHOTO);
    });

    it('keeps the file when the same photo is sent again', async () => {
      const { service, media } = setup({
        existing: { caption: 'lama', photoUrl: PHOTO },
      });
      await service.update('frag-1', { photoUrl: PHOTO }, OWNER);
      expect(media.inspect).not.toHaveBeenCalled();
      expect(media.remove).not.toHaveBeenCalled();
    });

    it('refuses to leave a fragment with neither photo nor caption', async () => {
      const { service, db } = setup({
        existing: { caption: 'lama', photoUrl: null },
      });
      await expect(
        service.update('frag-1', { caption: '' }, OWNER),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(db.fragment.update).not.toHaveBeenCalled();
    });

    it('404s on an unknown fragment', async () => {
      const { service } = setup({ existing: null });
      await expect(
        service.update('nope', { pinned: true }, OWNER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes the row and then its photo file', async () => {
      const { service, db, media } = setup({
        existing: { caption: 'x', photoUrl: PHOTO },
      });
      await service.remove('frag-1');
      expect(db.fragment.delete).toHaveBeenCalledWith({
        where: { id: 'frag-1' },
      });
      expect(media.remove).toHaveBeenCalledWith(PHOTO);
    });

    it('404s on an unknown fragment', async () => {
      const { service, db } = setup({ existing: null });
      await expect(service.remove('nope')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(db.fragment.delete).not.toHaveBeenCalled();
    });
  });
});

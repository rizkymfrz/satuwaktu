import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { MAX_UPLOAD_BYTES } from '@repo/dto';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { FragmentsController } from '../src/fragments/fragments.controller.js';
import { FragmentsService } from '../src/fragments/fragments.service.js';
import { MediaModule } from '../src/media/media.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { pngHeader } from '../src/testing/png.js';

const fragments = {
  create: vi.fn().mockResolvedValue({ id: 'frag-new' }),
  update: vi.fn().mockResolvedValue({ id: 'frag-1' }),
  remove: vi.fn().mockResolvedValue(undefined),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Fragment writes and media (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let dir: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    dir = await mkdtemp(join(tmpdir(), 'satuwaktu-e2e-'));
    process.env.UPLOAD_DIR = dir;
    const moduleRef = await Test.createTestingModule({
      imports: [FakePrismaModule, AuthModule, MediaModule],
      controllers: [FragmentsController],
      providers: [{ provide: FragmentsService, useValue: fragments }],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterEach(async () => {
    await app.close();
    delete process.env.UPLOAD_DIR;
    await rm(dir, { recursive: true, force: true });
  });

  const ownerAuth = async () =>
    `Bearer ${await jwt.signAsync({ sub: 'akun-ann', name: 'annfarta' })}`;

  describe('photo upload', () => {
    it('is closed to guests', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/photos')
        .attach('file', pngHeader(10, 10), 'a.png')
        .expect(401);
      expect(await readdir(dir)).toHaveLength(0);
    });

    it('stores a photo for an owner and serves it back', async () => {
      const upload = await request(app.getHttpServer())
        .post('/v1/uploads/photos')
        .set('Authorization', await ownerAuth())
        .attach('file', pngHeader(640, 480), 'a.png')
        .expect(201);
      expect(upload.body).toMatchObject({ width: 640, height: 480 });
      const served = await request(app.getHttpServer())
        .get(upload.body.url)
        .expect(200);
      expect(served.headers['cache-control']).toContain('immutable');
      expect(served.headers['content-type']).toContain('image/png');
    });

    it('requires a file field', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/photos')
        .set('Authorization', await ownerAuth())
        .expect(400);
    });

    it('rejects files that are not images', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/photos')
        .set('Authorization', await ownerAuth())
        .attach('file', Buffer.from('plain text, not an image'), 'a.png')
        .expect(415);
    });

    it('rejects files above the size limit', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/photos')
        .set('Authorization', await ownerAuth())
        .attach('file', Buffer.alloc(MAX_UPLOAD_BYTES + 1), 'big.png')
        .expect(413);
    });

    it('does not serve unknown or unsafe names', async () => {
      await request(app.getHttpServer())
        .get('/v1/media/11111111-1111-1111-1111-111111111111.png')
        .expect(404);
      await request(app.getHttpServer())
        .get('/v1/media/not-a-valid-name.txt')
        .expect(404);
    });
  });

  describe('create', () => {
    it('is closed to guests', async () => {
      await request(app.getHttpServer())
        .post('/v1/fragments')
        .send({ caption: 'halo' })
        .expect(401);
    });

    it('creates a fragment for an owner', async () => {
      await request(app.getHttpServer())
        .post('/v1/fragments')
        .set('Authorization', await ownerAuth())
        .send({
          caption: '  Senja di Bandung  ',
          visibility: 'PRIVATE',
          takenAt: '2025-03-01T10:00:00.000Z',
          location: { latitude: -6.9, longitude: 107.6, name: 'Bandung' },
          pinned: true,
        })
        .expect(201)
        .expect({ id: 'frag-new' });
      expect(fragments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'Senja di Bandung',
          visibility: 'PRIVATE',
          pinned: true,
          location: expect.objectContaining({ latitude: -6.9 }),
        }),
        expect.objectContaining({ role: 'owner', accountId: 'akun-ann' }),
      );
    });

    it.each([
      ['an unknown visibility', { visibility: 'SECRET' }],
      ['a caption that is too long', { caption: 'a'.repeat(281) }],
      ['a malformed date', { takenAt: 'yesterday' }],
      [
        'an out of range latitude',
        { location: { latitude: 99, longitude: 1 } },
      ],
      ['an incomplete location', { location: { latitude: 1 } }],
      ['a non boolean pinned', { pinned: 'yes' }],
      ['a song without a uri', { song: { title: 'Lagu' } }],
      [
        'a song over plain http',
        { song: { title: 'Lagu', uri: 'http://cdn.example.com/lagu.m4a' } },
      ],
      [
        'a song with a negative start',
        {
          song: {
            title: 'Lagu',
            uri: 'https://cdn.example.com/lagu.m4a',
            startSec: -1,
          },
        },
      ],
      ['an unknown field', { uploaderId: 'someone-else' }],
    ])('rejects %s', async (_name, body) => {
      await request(app.getHttpServer())
        .post('/v1/fragments')
        .set('Authorization', await ownerAuth())
        .send(body)
        .expect(400);
      expect(fragments.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('is closed to guests', async () => {
      await request(app.getHttpServer())
        .patch('/v1/fragments/frag-1')
        .send({ pinned: true })
        .expect(401);
    });

    it('passes partial updates through, including explicit nulls', async () => {
      await request(app.getHttpServer())
        .patch('/v1/fragments/frag-1')
        .set('Authorization', await ownerAuth())
        .send({ chapterId: null, location: null, pinned: false })
        .expect(200)
        .expect({ id: 'frag-1' });
      const [id, body] = fragments.update.mock.calls[0]!;
      expect(id).toBe('frag-1');
      expect(body).toMatchObject({
        chapterId: null,
        location: null,
        pinned: false,
      });
    });

    it.each([
      ['a null caption', { caption: null }],
      ['a null visibility', { visibility: null }],
      ['a null photo', { photoUrl: null }],
      ['an unknown visibility', { visibility: 'SECRET' }],
    ])('rejects %s', async (_name, body) => {
      await request(app.getHttpServer())
        .patch('/v1/fragments/frag-1')
        .set('Authorization', await ownerAuth())
        .send(body)
        .expect(400);
      expect(fragments.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('is closed to guests', async () => {
      await request(app.getHttpServer())
        .delete('/v1/fragments/frag-1')
        .expect(401);
      expect(fragments.remove).not.toHaveBeenCalled();
    });

    it('answers 204 for an owner', async () => {
      await request(app.getHttpServer())
        .delete('/v1/fragments/frag-1')
        .set('Authorization', await ownerAuth())
        .expect(204);
      expect(fragments.remove).toHaveBeenCalledWith('frag-1');
    });
  });
});

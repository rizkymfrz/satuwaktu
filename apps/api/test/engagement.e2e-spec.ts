import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import {
  CommentRepliesController,
  FragmentCommentsController,
} from '../src/comments/comments.controller.js';
import { CommentsService } from '../src/comments/comments.service.js';
import { LikesController } from '../src/likes/likes.controller.js';
import { LikesService } from '../src/likes/likes.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const likes = {
  like: vi.fn().mockResolvedValue({ liked: true, likes: 5 }),
  unlike: vi.fn().mockResolvedValue({ liked: false, likes: 4 }),
};

const comments = {
  list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }),
  create: vi.fn().mockResolvedValue({ id: 'c1' }),
  reply: vi.fn().mockResolvedValue({ id: 'r1' }),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Likes and comments (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
        FakePrismaModule,
        AuthModule,
      ],
      controllers: [
        LikesController,
        FragmentCommentsController,
        CommentRepliesController,
      ],
      providers: [
        { provide: LikesService, useValue: likes },
        { provide: CommentsService, useValue: comments },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterEach(async () => {
    await app.close();
  });

  const ownerToken = () => jwt.signAsync({ sub: 'akun-ann', name: 'annfarta' });

  describe('likes', () => {
    it('likes a fragment as a guest with a device id', async () => {
      await request(app.getHttpServer())
        .put('/v1/fragments/frag-1/like')
        .set('x-device-id', 'device-abc-12345')
        .expect(200)
        .expect({ liked: true, likes: 5 });
      expect(likes.like).toHaveBeenCalledWith(
        'frag-1',
        expect.objectContaining({
          role: 'guest',
          deviceKey: 'device-abc-12345',
        }),
      );
    });

    it('unlikes a fragment', async () => {
      await request(app.getHttpServer())
        .delete('/v1/fragments/frag-1/like')
        .set('x-device-id', 'device-abc-12345')
        .expect(200)
        .expect({ liked: false, likes: 4 });
    });

    it('passes the owner identity through when a token is sent', async () => {
      await request(app.getHttpServer())
        .put('/v1/fragments/frag-1/like')
        .set('Authorization', `Bearer ${await ownerToken()}`)
        .expect(200);
      expect(likes.like).toHaveBeenCalledWith(
        'frag-1',
        expect.objectContaining({ role: 'owner', accountId: 'akun-ann' }),
      );
    });
  });

  describe('comments', () => {
    it('lists comments with pagination defaults', async () => {
      await request(app.getHttpServer())
        .get('/v1/fragments/frag-1/comments')
        .expect(200);
      expect(comments.list).toHaveBeenCalledWith(
        'frag-1',
        expect.objectContaining({ limit: 20 }),
        expect.objectContaining({ role: 'guest' }),
      );
    });

    it.each([
      ['a limit above the maximum', { limit: '51' }],
      ['an unknown parameter', { sort: 'asc' }],
    ])('rejects %s', async (_name, query) => {
      await request(app.getHttpServer())
        .get('/v1/fragments/frag-1/comments')
        .query(query)
        .expect(400);
    });

    it('creates a comment and trims the text', async () => {
      await request(app.getHttpServer())
        .post('/v1/fragments/frag-1/comments')
        .send({ text: '  kangen suasananya  ' })
        .expect(201)
        .expect({ id: 'c1' });
      expect(comments.create).toHaveBeenCalledWith(
        'frag-1',
        expect.objectContaining({ text: 'kangen suasananya' }),
        expect.objectContaining({ role: 'guest' }),
      );
    });

    it.each([
      ['an empty text', { text: '   ' }],
      ['a missing text', {}],
      ['a text that is too long', { text: 'a'.repeat(201) }],
      ['an unknown field', { text: 'halo', author: 'aku' }],
    ])('rejects %s', async (_name, body) => {
      await request(app.getHttpServer())
        .post('/v1/fragments/frag-1/comments')
        .send(body)
        .expect(400);
      expect(comments.create).not.toHaveBeenCalled();
    });

    it('throttles comment spam', async () => {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        await request(app.getHttpServer())
          .post('/v1/fragments/frag-1/comments')
          .send({ text: 'halo' })
          .expect(201);
      }
      await request(app.getHttpServer())
        .post('/v1/fragments/frag-1/comments')
        .send({ text: 'halo' })
        .expect(429);
    });
  });

  describe('replies', () => {
    it('is closed to guests', async () => {
      await request(app.getHttpServer())
        .post('/v1/comments/c1/replies')
        .send({ text: 'makasih' })
        .expect(401);
      expect(comments.reply).not.toHaveBeenCalled();
    });

    it('lets an owner reply', async () => {
      await request(app.getHttpServer())
        .post('/v1/comments/c1/replies')
        .set('Authorization', `Bearer ${await ownerToken()}`)
        .send({ text: 'makasih' })
        .expect(201)
        .expect({ id: 'r1' });
      expect(comments.reply).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({ text: 'makasih' }),
        expect.objectContaining({ role: 'owner' }),
      );
    });
  });
});

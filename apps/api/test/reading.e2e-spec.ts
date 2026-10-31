import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import {
  ArchiveController,
  VISIT_LIMIT,
} from '../src/archive/archive.controller.js';
import { ArchiveService } from '../src/archive/archive.service.js';
import { ChaptersController } from '../src/chapters/chapters.controller.js';
import { ChaptersService } from '../src/chapters/chapters.service.js';
import { FragmentsController } from '../src/fragments/fragments.controller.js';
import { FragmentsService } from '../src/fragments/fragments.service.js';

const fragments = {
  list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }),
  get: vi.fn().mockResolvedValue({ id: 'frag-001' }),
  onThisDay: vi.fn().mockResolvedValue({ memory: null }),
  neighbors: vi.fn().mockResolvedValue({ older: null, newer: null }),
};

const chapters = { list: vi.fn().mockResolvedValue([]) };

const archive = {
  get: vi.fn().mockResolvedValue({ fragmentCount: 0 }),
  recordVisit: vi.fn().mockResolvedValue({ visitCount: 1 }),
};

describe('Reading endpoints (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
      ],
      controllers: [FragmentsController, ChaptersController, ArchiveController],
      providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: FragmentsService, useValue: fragments },
        { provide: ChaptersService, useValue: chapters },
        { provide: ArchiveService, useValue: archive },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('lists fragments with defaults applied', async () => {
    await request(app.getHttpServer()).get('/v1/fragments').expect(200);
    expect(fragments.list).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 20 }),
      expect.objectContaining({ role: 'guest' }),
    );
  });

  it('parses query parameters into typed values', async () => {
    await request(app.getHttpServer())
      .get('/v1/fragments')
      .query({
        limit: '5',
        chapterId: 'chapter-rumah',
        uploaderId: 'akun-ann',
        hasLocation: 'true',
        pinned: 'false',
        q: 'kopi',
        cursor: 'frag-010',
      })
      .expect(200);
    expect(fragments.list).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 5,
        chapterId: 'chapter-rumah',
        uploaderId: 'akun-ann',
        hasLocation: true,
        pinned: false,
        q: 'kopi',
        cursor: 'frag-010',
      }),
      expect.objectContaining({ role: 'guest' }),
    );
  });

  it.each([
    ['limit above the maximum', { limit: '51' }],
    ['limit below one', { limit: '0' }],
    ['non numeric limit', { limit: 'abc' }],
    ['non boolean hasLocation', { hasLocation: 'maybe' }],
    ['unknown parameter', { sort: 'asc' }],
  ])('rejects %s', async (_name, query) => {
    const response = await request(app.getHttpServer())
      .get('/v1/fragments')
      .query(query)
      .expect(400);
    expect(response.body).toMatchObject({
      error: 'BAD_REQUEST',
      message: 'Validation failed',
    });
    expect(fragments.list).not.toHaveBeenCalled();
  });

  it('serves the memory of the day before treating it as a fragment id', async () => {
    await request(app.getHttpServer())
      .get('/v1/fragments/on-this-day')
      .expect(200)
      .expect({ memory: null });
    expect(fragments.onThisDay).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'guest' }),
    );
    expect(fragments.get).not.toHaveBeenCalled();
  });

  it('returns a single fragment', async () => {
    await request(app.getHttpServer())
      .get('/v1/fragments/frag-001')
      .expect(200)
      .expect({ id: 'frag-001' });
    expect(fragments.get).toHaveBeenCalledWith(
      'frag-001',
      expect.objectContaining({ role: 'guest' }),
    );
  });

  it('returns the neighbors of a fragment without treating them as an id', async () => {
    await request(app.getHttpServer())
      .get('/v1/fragments/frag-001/neighbors')
      .expect(200)
      .expect({ older: null, newer: null });
    expect(fragments.neighbors).toHaveBeenCalledWith(
      'frag-001',
      expect.objectContaining({ role: 'guest' }),
    );
    expect(fragments.get).not.toHaveBeenCalled();
  });

  it('lists chapters', async () => {
    await request(app.getHttpServer())
      .get('/v1/chapters')
      .expect(200)
      .expect([]);
  });

  it('returns archive stats', async () => {
    await request(app.getHttpServer())
      .get('/v1/archive')
      .expect(200)
      .expect({ fragmentCount: 0 });
  });

  it('does not count a visit when archive stats are read', async () => {
    await request(app.getHttpServer()).get('/v1/archive').expect(200);
    expect(archive.recordVisit).not.toHaveBeenCalled();
  });

  it('counts a visit for guests and returns the fresh stats', async () => {
    await request(app.getHttpServer())
      .post('/v1/archive/visits')
      .expect(201)
      .expect({ visitCount: 1 });
    expect(archive.recordVisit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'guest' }),
    );
  });

  it('limits how often one client can count a visit', async () => {
    for (let attempt = 0; attempt < VISIT_LIMIT; attempt += 1) {
      await request(app.getHttpServer()).post('/v1/archive/visits').expect(201);
    }
    await request(app.getHttpServer()).post('/v1/archive/visits').expect(429);
    expect(archive.recordVisit).toHaveBeenCalledTimes(VISIT_LIMIT);
  });
});

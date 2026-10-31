import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { ChaptersController } from '../src/chapters/chapters.controller.js';
import { ChaptersService } from '../src/chapters/chapters.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const chapters = {
  create: vi.fn().mockResolvedValue({ id: 'chapter-new' }),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Chapter writes (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [FakePrismaModule, AuthModule],
      controllers: [ChaptersController],
      providers: [{ provide: ChaptersService, useValue: chapters }],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterEach(async () => {
    await app.close();
  });

  const ownerAuth = async () =>
    `Bearer ${await jwt.signAsync({ sub: 'akun-ann', name: 'annfarta' })}`;

  it('is closed to guests', async () => {
    await request(app.getHttpServer())
      .post('/v1/chapters')
      .send({ name: 'Liburan' })
      .expect(401);
    expect(chapters.create).not.toHaveBeenCalled();
  });

  it('creates a chapter for an owner with the name tidied up', async () => {
    await request(app.getHttpServer())
      .post('/v1/chapters')
      .set('Authorization', await ownerAuth())
      .send({ name: '  Liburan   akhir  tahun ' })
      .expect(201)
      .expect({ id: 'chapter-new' });
    expect(chapters.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Liburan akhir tahun' }),
    );
  });

  it.each([
    ['a missing name', {}],
    ['a blank name', { name: '   ' }],
    ['a name that is too long', { name: 'a'.repeat(41) }],
    ['a non string name', { name: 5 }],
    ['an unknown field', { name: 'Liburan', position: 0 }],
  ])('rejects %s', async (_name, body) => {
    await request(app.getHttpServer())
      .post('/v1/chapters')
      .set('Authorization', await ownerAuth())
      .send(body)
      .expect(400);
    expect(chapters.create).not.toHaveBeenCalled();
  });
});

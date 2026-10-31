import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { SettingsController } from '../src/settings/settings.controller.js';
import { SettingsService } from '../src/settings/settings.service.js';

const settings = {
  get: vi.fn().mockResolvedValue({ textSize: 'NORMAL' }),
  update: vi.fn().mockResolvedValue({ textSize: 'LARGE' }),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Settings (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [FakePrismaModule, AuthModule],
      controllers: [SettingsController],
      providers: [{ provide: SettingsService, useValue: settings }],
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
    await request(app.getHttpServer()).get('/v1/settings').expect(401);
    await request(app.getHttpServer())
      .patch('/v1/settings')
      .send({ dataSaver: true })
      .expect(401);
    expect(settings.get).not.toHaveBeenCalled();
    expect(settings.update).not.toHaveBeenCalled();
  });

  it("reads the signed in owner's settings", async () => {
    await request(app.getHttpServer())
      .get('/v1/settings')
      .set('Authorization', await ownerAuth())
      .expect(200)
      .expect({ textSize: 'NORMAL' });
    expect(settings.get).toHaveBeenCalledWith('akun-ann');
  });

  it("updates the signed in owner's settings", async () => {
    await request(app.getHttpServer())
      .patch('/v1/settings')
      .set('Authorization', await ownerAuth())
      .send({
        textSize: 'LARGE',
        dataSaver: true,
        defaultVisibility: 'PRIVATE',
      })
      .expect(200)
      .expect({ textSize: 'LARGE' });
    expect(settings.update).toHaveBeenCalledWith(
      'akun-ann',
      expect.objectContaining({
        textSize: 'LARGE',
        dataSaver: true,
        defaultVisibility: 'PRIVATE',
      }),
    );
  });

  it.each([
    ['an unknown text size', { textSize: 'HUGE' }],
    ['a lowercase visibility', { defaultVisibility: 'private' }],
    ['a non boolean switch', { notifLike: 'yes' }],
    ['a null switch', { dataSaver: null }],
    ['an unknown field', { accountId: 'someone-else' }],
  ])('rejects %s', async (_name, body) => {
    await request(app.getHttpServer())
      .patch('/v1/settings')
      .set('Authorization', await ownerAuth())
      .send(body)
      .expect(400);
    expect(settings.update).not.toHaveBeenCalled();
  });
});

import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { NotificationsController } from '../src/notifications/notifications.controller.js';
import { NotificationsService } from '../src/notifications/notifications.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const TOKEN = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

const notifications = {
  registerToken: vi.fn().mockResolvedValue(undefined),
  unregisterToken: vi.fn().mockResolvedValue(undefined),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Push tokens (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [FakePrismaModule, AuthModule],
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: notifications }],
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
      .put('/v1/push-tokens')
      .send({ token: TOKEN })
      .expect(401);
    await request(app.getHttpServer())
      .delete('/v1/push-tokens')
      .send({ token: TOKEN })
      .expect(401);
    expect(notifications.registerToken).not.toHaveBeenCalled();
    expect(notifications.unregisterToken).not.toHaveBeenCalled();
  });

  it('registers a token for the signed in owner', async () => {
    await request(app.getHttpServer())
      .put('/v1/push-tokens')
      .set('Authorization', await ownerAuth())
      .send({ token: TOKEN })
      .expect(204);
    expect(notifications.registerToken).toHaveBeenCalledWith('akun-ann', TOKEN);
  });

  it('unregisters a token for the signed in owner', async () => {
    await request(app.getHttpServer())
      .delete('/v1/push-tokens')
      .set('Authorization', await ownerAuth())
      .send({ token: TOKEN })
      .expect(204);
    expect(notifications.unregisterToken).toHaveBeenCalledWith(
      'akun-ann',
      TOKEN,
    );
  });

  it.each([
    ['a missing token', {}],
    ['a token in the wrong format', { token: 'https://evil.example.com' }],
    [
      'a token that is too long',
      { token: `ExponentPushToken[${'a'.repeat(200)}]` },
    ],
    ['an unknown field', { token: TOKEN, accountId: 'someone-else' }],
  ])('rejects %s', async (_name, body) => {
    await request(app.getHttpServer())
      .put('/v1/push-tokens')
      .set('Authorization', await ownerAuth())
      .send(body)
      .expect(400);
    expect(notifications.registerToken).not.toHaveBeenCalled();
  });
});

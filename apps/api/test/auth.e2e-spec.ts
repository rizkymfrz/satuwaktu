import type { INestApplication } from '@nestjs/common';
import { Controller, Get, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { hashPassword } from '@repo/db';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { CurrentPrincipal } from '../src/auth/current-principal.decorator.js';
import { OwnerOnly } from '../src/auth/owner.guard.js';
import type { Principal } from '../src/auth/principal.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const ACCOUNT = { id: 'akun-ann', name: 'annfarta', title: 'Pemilik arsip' };
const PASSWORD = 'rahasia-banget';

@Controller('probe')
class ProbeController {
  @Get('who')
  who(@CurrentPrincipal() principal: Principal) {
    return principal;
  }

  @Get('owner')
  @OwnerOnly()
  owner() {
    return { ok: true };
  }
}

async function createApp() {
  const passwordHash = await hashPassword(PASSWORD);
  const account = {
    findUnique: vi.fn(async ({ where }: { where: { id: string } }) =>
      where.id === ACCOUNT.id ? { ...ACCOUNT, passwordHash } : null,
    ),
    findMany: vi.fn(async () => [ACCOUNT]),
  };
  @Global()
  @Module({
    providers: [{ provide: PrismaService, useValue: { db: { account } } }],
    exports: [PrismaService],
  })
  class FakePrismaModule {}
  const moduleRef = await Test.createTestingModule({
    imports: [
      ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
      FakePrismaModule,
      AuthModule,
    ],
    controllers: [ProbeController],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return { app, jwt: moduleRef.get(JwtService) };
}

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    ({ app, jwt } = await createApp());
  });

  afterEach(async () => {
    await app.close();
  });

  function login(password = PASSWORD) {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ accountId: ACCOUNT.id, password });
  }

  it('lists accounts without authentication', async () => {
    await request(app.getHttpServer())
      .get('/v1/auth/accounts')
      .expect(200)
      .expect([ACCOUNT]);
  });

  it('logs an owner in and reports them through /auth/me', async () => {
    const response = await login().expect(200);
    expect(response.body.account).toEqual(ACCOUNT);
    await request(app.getHttpServer())
      .get('/v1/auth/me')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .expect(200)
      .expect({ role: 'owner', account: ACCOUNT });
  });

  it('rejects a wrong password with 401', async () => {
    const response = await login('salah').expect(401);
    expect(response.body).toMatchObject({
      error: 'UNAUTHORIZED',
      message: 'Invalid credentials',
    });
  });

  it('validates the login body', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ accountId: ACCOUNT.id })
      .expect(400);
  });

  it('throttles repeated login attempts', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await login('salah').expect(401);
    }
    await login('salah').expect(429);
  });

  it('treats a request without a token as a guest', async () => {
    await request(app.getHttpServer())
      .get('/v1/probe/who')
      .set('x-device-id', 'device-abc-12345')
      .expect(200)
      .expect({ role: 'guest', deviceKey: 'device-abc-12345' });
  });

  it('ignores a malformed device id', async () => {
    await request(app.getHttpServer())
      .get('/v1/probe/who')
      .set('x-device-id', 'no spaces allowed!')
      .expect(200)
      .expect({ role: 'guest', deviceKey: null });
  });

  it('turns a valid token into an owner principal', async () => {
    const token = await jwt.signAsync({ sub: ACCOUNT.id, name: ACCOUNT.name });
    await request(app.getHttpServer())
      .get('/v1/probe/who')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ role: 'owner', accountId: ACCOUNT.id, name: ACCOUNT.name });
  });

  it.each([
    ['a garbage token', 'Bearer not-a-real-token'],
    ['the wrong scheme', 'Basic abc'],
    ['a header without a token', 'Bearer'],
  ])(
    'rejects %s with 401 instead of falling back to guest',
    async (_n, value) => {
      await request(app.getHttpServer())
        .get('/v1/probe/who')
        .set('Authorization', value)
        .expect(401);
    },
  );

  it('rejects an expired token', async () => {
    const token = await jwt.signAsync(
      { sub: ACCOUNT.id, name: ACCOUNT.name },
      { expiresIn: '-1s' },
    );
    await request(app.getHttpServer())
      .get('/v1/probe/who')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('keeps owner-only routes closed to guests and open to owners', async () => {
    await request(app.getHttpServer()).get('/v1/probe/owner').expect(401);
    const token = await jwt.signAsync({ sub: ACCOUNT.id, name: ACCOUNT.name });
    await request(app.getHttpServer())
      .get('/v1/probe/owner')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ ok: true });
  });
});

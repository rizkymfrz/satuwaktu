import type { INestApplication } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { ProfileController } from '../src/profile/profile.controller.js';
import { ProfileService } from '../src/profile/profile.service.js';

const profile = {
  stats: vi.fn().mockResolvedValue({
    fragmentCount: 7,
    likeCount: 21,
    commentCount: 4,
  }),
};

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: { db: {} } }],
  exports: [PrismaService],
})
class FakePrismaModule {}

describe('Profile (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [FakePrismaModule, AuthModule],
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: profile }],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('is closed to guests', async () => {
    await request(app.getHttpServer()).get('/v1/profile/stats').expect(401);
    expect(profile.stats).not.toHaveBeenCalled();
  });

  it('returns the stats of the signed in owner', async () => {
    const token = await jwt.signAsync({ sub: 'akun-ann', name: 'annfarta' });
    await request(app.getHttpServer())
      .get('/v1/profile/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ fragmentCount: 7, likeCount: 21, commentCount: 4 });
    expect(profile.stats).toHaveBeenCalledWith('akun-ann');
  });
});

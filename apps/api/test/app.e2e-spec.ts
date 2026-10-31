import { IsString, MinLength } from 'class-validator';
import type { INestApplication } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup.js';
import { HealthModule } from '../src/health/health.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

class EchoDto {
  @IsString()
  @MinLength(2)
  name!: string;
}

@Controller('echo')
class EchoController {
  @Post()
  echo(@Body() dto: EchoDto) {
    return dto;
  }
}

async function createApp(queryRaw: () => Promise<unknown>) {
  const moduleRef = await Test.createTestingModule({
    imports: [HealthModule],
    controllers: [EchoController],
  })
    .useMocker((token) =>
      token === PrismaService ? { db: { $queryRaw: queryRaw } } : undefined,
    )
    .compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}

describe('API foundation (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app.close();
  });

  it('serves health under the /v1 prefix', async () => {
    app = await createApp(async () => 1);
    const response = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(200);
    expect(response.body).toMatchObject({ status: 'ok', database: 'up' });
  });

  it('returns 503 in the standard error shape when the database is down', async () => {
    app = await createApp(async () => {
      throw new Error('connection refused');
    });
    const response = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(503);
    expect(response.body).toMatchObject({
      statusCode: 503,
      error: 'SERVICE_UNAVAILABLE',
      message: 'Database unreachable',
      path: '/v1/health',
    });
  });

  it('returns 404 in the standard error shape for unknown routes', async () => {
    app = await createApp(async () => 1);
    const response = await request(app.getHttpServer())
      .get('/v1/nope')
      .expect(404);
    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'NOT_FOUND',
    });
  });

  it('rejects invalid bodies with validation details', async () => {
    app = await createApp(async () => 1);
    const response = await request(app.getHttpServer())
      .post('/v1/echo')
      .send({ name: 'a', extra: true })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: 'Validation failed',
    });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.stringContaining('name must be longer'),
        expect.stringContaining('property extra should not exist'),
      ]),
    );
  });

  it('accepts valid bodies', async () => {
    app = await createApp(async () => 1);
    await request(app.getHttpServer())
      .post('/v1/echo')
      .send({ name: 'rizky' })
      .expect(201)
      .expect({ name: 'rizky' });
  });
});

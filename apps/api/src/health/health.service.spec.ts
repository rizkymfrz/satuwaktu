import { ServiceUnavailableException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service.js';
import { HealthService } from './health.service.js';

function setup(queryRaw: () => Promise<unknown>) {
  const prisma = { db: { $queryRaw: queryRaw } } as unknown as PrismaService;
  return new HealthService(prisma);
}

describe('HealthService', () => {
  it('reports ok when the database answers', async () => {
    const service = setup(async () => [{ value: 1 }]);
    await expect(service.check()).resolves.toMatchObject({
      status: 'ok',
      database: 'up',
    });
  });

  it('throws 503 when the database is unreachable', async () => {
    const service = setup(async () => {
      throw new Error('connection refused');
    });
    await expect(service.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});

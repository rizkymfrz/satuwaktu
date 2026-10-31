import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '@repo/db';
import type { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

const SECRET = 'unit-test-secret-unit-test-secret-1234';
const ACCOUNT = { id: 'akun-ann', name: 'annfarta', title: 'Pemilik arsip' };

async function setup(account: unknown) {
  const jwt = new JwtService({
    secret: SECRET,
    signOptions: { expiresIn: '1d' },
  });
  const findUnique = vi.fn().mockResolvedValue(account);
  const prisma = {
    db: {
      account: { findUnique, findMany: vi.fn().mockResolvedValue([ACCOUNT]) },
    },
  } as unknown as PrismaService;
  return { service: new AuthService(prisma, jwt), jwt, findUnique };
}

describe('AuthService', () => {
  it('lists the accounts shown on the gate screen', async () => {
    const { service } = await setup(null);
    await expect(service.listAccounts()).resolves.toEqual([ACCOUNT]);
  });

  describe('login', () => {
    it('returns a signed token that carries the account', async () => {
      const passwordHash = await hashPassword('rahasia-banget');
      const { service, jwt } = await setup({ ...ACCOUNT, passwordHash });
      const result = await service.login({
        accountId: ACCOUNT.id,
        password: 'rahasia-banget',
      });
      expect(result.account).toEqual(ACCOUNT);
      const payload = await jwt.verifyAsync(result.accessToken);
      expect(payload).toMatchObject({ sub: ACCOUNT.id, name: ACCOUNT.name });
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('rejects a wrong password', async () => {
      const passwordHash = await hashPassword('rahasia-banget');
      const { service } = await setup({ ...ACCOUNT, passwordHash });
      await expect(
        service.login({ accountId: ACCOUNT.id, password: 'salah' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an unknown account with the same error', async () => {
      const { service } = await setup(null);
      await expect(
        service.login({ accountId: 'nope', password: 'apa-saja' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('rejects an account that has no password set', async () => {
      const { service } = await setup({ ...ACCOUNT, passwordHash: null });
      await expect(
        service.login({ accountId: ACCOUNT.id, password: 'apa-saja' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('me', () => {
    it('describes a guest without touching the database', async () => {
      const { service, findUnique } = await setup(null);
      await expect(
        service.me({ role: 'guest', deviceKey: null }),
      ).resolves.toEqual({ role: 'guest', account: null });
      expect(findUnique).not.toHaveBeenCalled();
    });

    it('describes an owner from the database', async () => {
      const { service } = await setup(ACCOUNT);
      await expect(
        service.me({
          role: 'owner',
          accountId: ACCOUNT.id,
          name: ACCOUNT.name,
        }),
      ).resolves.toEqual({ role: 'owner', account: ACCOUNT });
    });

    it('rejects a token whose account was deleted', async () => {
      const { service } = await setup(null);
      await expect(
        service.me({ role: 'owner', accountId: 'gone', name: 'gone' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});

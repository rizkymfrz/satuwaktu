import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { hashPassword, verifyPassword } from '@repo/db';
import type { AccountView, LoginResponse, MeView } from '@repo/dto';
import type { LoginBody } from '@repo/dto/validation';
import { PrismaService } from '../prisma/prisma.service.js';
import { ACCOUNT_SELECT, toAccountView } from './account.view.js';
import type { Principal } from './principal.js';
import type { TokenPayload } from './token-payload.js';

@Injectable()
export class AuthService {
  private readonly decoyHash = hashPassword(randomUUID());

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async listAccounts(): Promise<AccountView[]> {
    const accounts = await this.prisma.db.account.findMany({
      orderBy: { createdAt: 'asc' },
      select: ACCOUNT_SELECT,
    });
    return accounts.map(toAccountView);
  }

  async login(body: LoginBody): Promise<LoginResponse> {
    const account = await this.prisma.db.account.findUnique({
      where: { id: body.accountId },
    });
    const storedHash = account?.passwordHash ?? (await this.decoyHash);
    const valid = await verifyPassword(body.password, storedHash);
    if (!account || !account.passwordHash || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: TokenPayload = { sub: account.id, name: account.name };
    const accessToken = await this.jwt.signAsync(payload);
    const decoded = this.jwt.decode<{ exp: number }>(accessToken);
    return {
      accessToken,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      account: toAccountView(account),
    };
  }

  async me(principal: Principal): Promise<MeView> {
    if (principal.role === 'guest') {
      return { role: 'guest', account: null };
    }
    const account = await this.prisma.db.account.findUnique({
      where: { id: principal.accountId },
      select: ACCOUNT_SELECT,
    });
    if (!account) {
      throw new UnauthorizedException('Account no longer exists');
    }
    return { role: 'owner', account: toAccountView(account) };
  }
}

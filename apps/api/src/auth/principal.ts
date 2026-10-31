import type { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export interface OwnerPrincipal {
  role: 'owner';
  accountId: string;
  name: string;
}

export interface GuestPrincipal {
  role: 'guest';
  deviceKey: string | null;
}

export type Principal = OwnerPrincipal | GuestPrincipal;
export type PrincipalRequest = Request & { principal?: Principal };

export function assertOwner(
  principal: Principal,
): asserts principal is OwnerPrincipal {
  if (principal.role !== 'owner') {
    throw new UnauthorizedException('Owner authentication required');
  }
}

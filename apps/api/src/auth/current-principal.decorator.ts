import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Principal, PrincipalRequest } from './principal.js';

const ANONYMOUS: Principal = { role: 'guest', deviceKey: null };

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal => {
    const request = context.switchToHttp().getRequest<PrincipalRequest>();
    return request.principal ?? ANONYMOUS;
  },
);

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { PrincipalRequest } from './principal.js';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<PrincipalRequest>();
    if (request.principal?.role !== 'owner') {
      throw new UnauthorizedException('Owner authentication required');
    }
    return true;
  }
}

export const OwnerOnly = () => UseGuards(OwnerGuard);

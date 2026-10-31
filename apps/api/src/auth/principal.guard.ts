import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DEVICE_ID_HEADER } from '@repo/dto';
import { parseDeviceKey } from './device-key.js';
import type { PrincipalRequest } from './principal.js';
import type { TokenPayload } from './token-payload.js';

@Injectable()
export class PrincipalGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<PrincipalRequest>();
    const header = request.headers.authorization;
    if (!header) {
      request.principal = {
        role: 'guest',
        deviceKey: parseDeviceKey(request.headers[DEVICE_ID_HEADER]),
      };
      return true;
    }
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token);
      request.principal = {
        role: 'owner',
        accountId: payload.sub,
        name: payload.name,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}

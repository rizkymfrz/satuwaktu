import type { Principal } from '../auth/principal.js';

export function voterKeyOf(principal: Principal): string | null {
  if (principal.role === 'owner') {
    return `account:${principal.accountId}`;
  }
  return principal.deviceKey ? `device:${principal.deviceKey}` : null;
}

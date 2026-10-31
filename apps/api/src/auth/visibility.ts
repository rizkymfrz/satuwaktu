import { Visibility } from '@repo/db';
import type { Principal } from './principal.js';

export function visibleTo(principal: Principal): Visibility[] {
  return principal.role === 'owner'
    ? [Visibility.PUBLIC, Visibility.PRIVATE]
    : [Visibility.PUBLIC];
}

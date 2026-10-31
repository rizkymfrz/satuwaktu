import type { Prisma } from '@repo/db';
import { NO_CHAPTER } from '@repo/dto';
import type { ListFragmentsQuery } from '@repo/dto/validation';
import type { Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';

export type NeighborDirection = 'older' | 'newer';

export function buildNeighborWhere(
  current: { id: string; takenAt: Date },
  direction: NeighborDirection,
  principal: Principal,
): Prisma.FragmentWhereInput {
  const takenAt =
    direction === 'older' ? { lt: current.takenAt } : { gt: current.takenAt };
  const id = direction === 'older' ? { lt: current.id } : { gt: current.id };
  return {
    visibility: { in: visibleTo(principal) },
    OR: [{ takenAt }, { takenAt: current.takenAt, id }],
  };
}

export function buildFragmentWhere(
  query: ListFragmentsQuery,
  principal: Principal,
): Prisma.FragmentWhereInput {
  const { chapterId, uploaderId, q, hasLocation, pinned } = query;
  const and: Prisma.FragmentWhereInput[] = [];
  if (chapterId) {
    and.push({ chapterId: chapterId === NO_CHAPTER ? null : chapterId });
  }
  if (uploaderId) {
    and.push({ uploaderId });
  }
  if (hasLocation !== undefined) {
    and.push(
      hasLocation
        ? { latitude: { not: null }, longitude: { not: null } }
        : { OR: [{ latitude: null }, { longitude: null }] },
    );
  }
  if (pinned !== undefined) {
    and.push({ pinned });
  }
  const needle = q?.trim();
  if (needle) {
    and.push({
      OR: [
        { caption: { contains: needle, mode: 'insensitive' } },
        { chapter: { name: { contains: needle, mode: 'insensitive' } } },
      ],
    });
  }
  return { visibility: { in: visibleTo(principal) }, AND: and };
}

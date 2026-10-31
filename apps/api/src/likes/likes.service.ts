import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEVICE_ID_HEADER, type LikeState } from '@repo/dto';
import type { Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { voterKeyOf } from './voter-key.js';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  like(fragmentId: string, principal: Principal) {
    return this.setLiked(fragmentId, principal, true);
  }

  unlike(fragmentId: string, principal: Principal) {
    return this.setLiked(fragmentId, principal, false);
  }

  private async setLiked(
    fragmentId: string,
    principal: Principal,
    liked: boolean,
  ): Promise<LikeState> {
    const voterKey = voterKeyOf(principal);
    if (!voterKey) {
      throw new BadRequestException(
        `The ${DEVICE_ID_HEADER} header is required to like a fragment`,
      );
    }
    const { db } = this.prisma;
    const fragment = await db.fragment.findFirst({
      where: { id: fragmentId, visibility: { in: visibleTo(principal) } },
      select: { id: true },
    });
    if (!fragment) {
      throw new NotFoundException('Fragment not found');
    }
    if (liked) {
      const { count } = await db.like.createMany({
        data: [{ fragmentId, voterKey }],
        skipDuplicates: true,
      });
      if (count > 0) {
        void this.notifications.notifyLikeAdded(fragmentId, principal);
      }
    } else {
      await db.like.deleteMany({ where: { fragmentId, voterKey } });
    }
    const likes = await db.like.count({ where: { fragmentId } });
    return { liked, likes };
  }
}

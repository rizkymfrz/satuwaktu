import { Injectable } from '@nestjs/common';
import type { ProfileStatsView } from '@repo/dto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async stats(accountId: string): Promise<ProfileStatsView> {
    const { db } = this.prisma;
    const fragment = { uploaderId: accountId };
    const [fragmentCount, likeCount, commentCount] = await Promise.all([
      db.fragment.count({ where: fragment }),
      db.like.count({ where: { fragment } }),
      db.comment.count({ where: { fragment } }),
    ]);
    return { fragmentCount, likeCount, commentCount };
  }
}

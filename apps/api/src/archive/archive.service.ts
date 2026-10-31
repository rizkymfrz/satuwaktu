import { Injectable, NotFoundException } from '@nestjs/common';
import type { ArchiveView } from '@repo/dto';
import type { Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';
import { PrismaService } from '../prisma/prisma.service.js';

const ARCHIVE_ID = 'archive';

@Injectable()
export class ArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  async get(principal: Principal): Promise<ArchiveView> {
    const { db } = this.prisma;
    const visibility = { in: visibleTo(principal) };
    const [meta, oldest, fragmentCount, likeCount, chapterCount] =
      await Promise.all([
        db.archiveMeta.findUnique({ where: { id: ARCHIVE_ID } }),
        db.fragment.aggregate({ _min: { takenAt: true } }),
        db.fragment.count({ where: { visibility } }),
        db.like.count({ where: { fragment: { visibility } } }),
        db.chapter.count(),
      ]);
    if (!meta) {
      throw new NotFoundException('Archive has not been initialised');
    }
    const earliest = oldest._min.takenAt;
    const startedAt =
      earliest && earliest < meta.startedAt ? earliest : meta.startedAt;
    return {
      startedAt: startedAt.toISOString(),
      visitCount: meta.visitCount,
      fragmentCount,
      likeCount,
      chapterCount,
    };
  }

  async recordVisit(principal: Principal): Promise<ArchiveView> {
    await this.prisma.db.archiveMeta.update({
      where: { id: ARCHIVE_ID },
      data: { visitCount: { increment: 1 } },
    });
    return this.get(principal);
  }
}

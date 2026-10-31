import { ConflictException, Injectable } from '@nestjs/common';
import type { ChapterView } from '@repo/dto';
import type { CreateChapterBody } from '@repo/dto/validation';
import type { Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';
import { fragmentSelect, toFragmentView } from '../fragments/fragment.view.js';
import { voterKeyOf } from '../likes/voter-key.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { emptyChapterStats, toChapterView } from './chapter.view.js';

export const PREVIEW_SIZE = 5;

@Injectable()
export class ChaptersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(principal: Principal): Promise<ChapterView[]> {
    const { db } = this.prisma;
    const visibility = { in: visibleTo(principal) };
    const select = fragmentSelect(voterKeyOf(principal));
    const [chapters, stats] = await Promise.all([
      db.chapter.findMany({ orderBy: [{ position: 'asc' }, { name: 'asc' }] }),
      db.fragment.groupBy({
        by: ['chapterId'],
        where: { visibility, chapterId: { not: null } },
        _count: { _all: true },
        _min: { takenAt: true },
        _max: { takenAt: true },
      }),
    ]);
    const statsByChapter = new Map(stats.map((row) => [row.chapterId, row]));
    return Promise.all(
      chapters.map(async (chapter) => {
        const where = { chapterId: chapter.id, visibility };
        const [likeCount, preview] = await Promise.all([
          db.like.count({ where: { fragment: where } }),
          db.fragment.findMany({
            where,
            orderBy: [{ takenAt: 'desc' }, { id: 'desc' }],
            select,
            take: PREVIEW_SIZE,
          }),
        ]);
        const row = statsByChapter.get(chapter.id);
        return toChapterView(chapter, {
          fragmentCount: row?._count._all ?? 0,
          likeCount,
          firstTakenAt: row?._min.takenAt?.toISOString() ?? null,
          lastTakenAt: row?._max.takenAt?.toISOString() ?? null,
          preview: preview.map(toFragmentView),
        });
      }),
    );
  }

  async create(body: CreateChapterBody): Promise<ChapterView> {
    const { db } = this.prisma;
    const existing = await db.chapter.findFirst({
      where: { name: { equals: body.name, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Chapter already exists');
    }
    const last = await db.chapter.aggregate({ _max: { position: true } });
    const chapter = await db.chapter.create({
      data: { name: body.name, position: (last._max.position ?? -1) + 1 },
    });
    return toChapterView(chapter, emptyChapterStats());
  }
}

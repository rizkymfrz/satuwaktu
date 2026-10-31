import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Visibility } from '@repo/db';
import type {
  FragmentNeighborsView,
  FragmentPage,
  FragmentView,
  OnThisDayView,
} from '@repo/dto';
import type {
  CreateFragmentBody,
  ListFragmentsQuery,
  UpdateFragmentBody,
} from '@repo/dto/validation';
import type { OwnerPrincipal, Principal } from '../auth/principal.js';
import { visibleTo } from '../auth/visibility.js';
import { voterKeyOf } from '../likes/voter-key.js';
import { MediaService } from '../media/media.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { toLocationData, toSongData } from './fragment.input.js';
import { fragmentSelect, toFragmentView } from './fragment.view.js';
import {
  buildFragmentWhere,
  buildNeighborWhere,
  type NeighborDirection,
} from './fragment.where.js';
import { findOnThisDay, type OnThisDayMemory } from './on-this-day.query.js';

@Injectable()
export class FragmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  async list(
    query: ListFragmentsQuery,
    principal: Principal,
  ): Promise<FragmentPage> {
    const { cursor, limit } = query;
    const records = await this.prisma.db.fragment.findMany({
      where: buildFragmentWhere(query, principal),
      orderBy: [{ takenAt: 'desc' }, { id: 'desc' }],
      select: fragmentSelect(voterKeyOf(principal)),
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const hasMore = records.length > limit;
    const page = hasMore ? records.slice(0, limit) : records;
    return {
      items: page.map(toFragmentView),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    };
  }

  async onThisDay(
    principal: Principal,
    now = new Date(),
  ): Promise<OnThisDayView> {
    const found = await this.findOnThisDay(now, visibleTo(principal));
    if (!found) {
      return { memory: null };
    }
    return { memory: await this.get(found.id, principal) };
  }

  findOnThisDay(
    now: Date,
    visibilities: Visibility[],
  ): Promise<OnThisDayMemory | null> {
    return findOnThisDay(this.prisma.db, now, visibilities);
  }

  async get(id: string, principal: Principal): Promise<FragmentView> {
    const record = await this.prisma.db.fragment.findFirst({
      where: { id, visibility: { in: visibleTo(principal) } },
      select: fragmentSelect(voterKeyOf(principal)),
    });
    if (!record) {
      throw new NotFoundException('Fragment not found');
    }
    return toFragmentView(record);
  }

  async neighbors(
    id: string,
    principal: Principal,
  ): Promise<FragmentNeighborsView> {
    const current = await this.prisma.db.fragment.findFirst({
      where: { id, visibility: { in: visibleTo(principal) } },
      select: { id: true, takenAt: true },
    });
    if (!current) {
      throw new NotFoundException('Fragment not found');
    }
    const select = fragmentSelect(voterKeyOf(principal));
    const find = async (direction: NeighborDirection) => {
      const record = await this.prisma.db.fragment.findFirst({
        where: buildNeighborWhere(current, direction, principal),
        orderBy:
          direction === 'older'
            ? [{ takenAt: 'desc' }, { id: 'desc' }]
            : [{ takenAt: 'asc' }, { id: 'asc' }],
        select,
      });
      return record ? toFragmentView(record) : null;
    };
    const [older, newer] = await Promise.all([find('older'), find('newer')]);
    return { older, newer };
  }

  async create(
    body: CreateFragmentBody,
    principal: OwnerPrincipal,
  ): Promise<FragmentView> {
    const caption = body.caption ?? '';
    if (!body.photoUrl && !caption) {
      throw new BadRequestException('Provide a photo or a caption');
    }
    await this.assertChapter(body.chapterId);
    const photo = body.photoUrl
      ? await this.media.inspect(body.photoUrl)
      : null;
    const visibility =
      body.visibility ?? (await this.defaultVisibility(principal.accountId));
    const record = await this.prisma.db.fragment.create({
      data: {
        caption,
        takenAt: body.takenAt ? new Date(body.takenAt) : new Date(),
        visibility,
        pinned: body.pinned ?? false,
        photoUrl: body.photoUrl ?? null,
        photoWidth: photo?.width ?? null,
        photoHeight: photo?.height ?? null,
        ...toLocationData(body.location),
        ...toSongData(body.song),
        chapterId: body.chapterId ?? null,
        uploaderId: principal.accountId,
      },
      select: { id: true },
    });
    return this.get(record.id, principal);
  }

  async update(
    id: string,
    body: UpdateFragmentBody,
    principal: OwnerPrincipal,
  ): Promise<FragmentView> {
    const existing = await this.prisma.db.fragment.findUnique({
      where: { id },
      select: { caption: true, photoUrl: true },
    });
    if (!existing) {
      throw new NotFoundException('Fragment not found');
    }
    const caption = body.caption ?? existing.caption;
    const photoUrl = body.photoUrl ?? existing.photoUrl;
    if (!photoUrl && !caption) {
      throw new BadRequestException('Provide a photo or a caption');
    }
    await this.assertChapter(body.chapterId);
    const replacingPhoto =
      body.photoUrl !== undefined && body.photoUrl !== existing.photoUrl;
    const photo =
      replacingPhoto && body.photoUrl
        ? await this.media.inspect(body.photoUrl)
        : null;
    const record = await this.prisma.db.fragment.update({
      where: { id },
      data: {
        ...(body.caption !== undefined ? { caption: body.caption } : {}),
        ...(body.takenAt !== undefined
          ? { takenAt: new Date(body.takenAt) }
          : {}),
        ...(body.visibility !== undefined
          ? { visibility: body.visibility }
          : {}),
        ...(body.pinned !== undefined ? { pinned: body.pinned } : {}),
        ...(body.chapterId !== undefined ? { chapterId: body.chapterId } : {}),
        ...(photo
          ? {
              photoUrl: body.photoUrl,
              photoWidth: photo.width,
              photoHeight: photo.height,
            }
          : {}),
        ...toLocationData(body.location),
        ...toSongData(body.song),
      },
      select: { id: true },
    });
    if (replacingPhoto) {
      await this.media.remove(existing.photoUrl);
    }
    return this.get(record.id, principal);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.db.fragment.findUnique({
      where: { id },
      select: { photoUrl: true },
    });
    if (!existing) {
      throw new NotFoundException('Fragment not found');
    }
    await this.prisma.db.fragment.delete({ where: { id } });
    await this.media.remove(existing.photoUrl);
  }

  private async assertChapter(chapterId: string | null | undefined) {
    if (!chapterId) {
      return;
    }
    const chapter = await this.prisma.db.chapter.findUnique({
      where: { id: chapterId },
      select: { id: true },
    });
    if (!chapter) {
      throw new BadRequestException('Unknown chapter');
    }
  }

  private async defaultVisibility(accountId: string): Promise<Visibility> {
    const settings = await this.prisma.db.accountSettings.findUnique({
      where: { accountId },
      select: { defaultVisibility: true },
    });
    return settings?.defaultVisibility ?? Visibility.PUBLIC;
  }
}

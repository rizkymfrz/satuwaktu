import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateFragmenDto,
  QueryFragmenDto,
  UpdateFragmenDto,
} from "@satuwaktu/dto";
import { PrismaService } from "../prisma/prisma.service";

const FRAGMEN_INCLUDE = {
  author: { select: { id: true, name: true } },
  chapter: true,
  media: { orderBy: { order: "asc" as const } },
  _count: { select: { resonansis: true, titipanKata: true } },
};

@Injectable()
export class FragmenService {
  constructor(private prisma: PrismaService) {}

  findAll = (query: QueryFragmenDto) => {
    const {
      page = 1,
      limit = 20,
      type,
      mood,
      chapterId,
      isDraft,
      isPrivate,
    } = query;
    return this.prisma.fragmen.findMany({
      where: {
        isPrivate: isPrivate ?? false,
        isDraft: isDraft ?? false,
        ...(type && { type }),
        ...(mood && { mood }),
        ...(chapterId && { chapterId }),
      },
      include: FRAGMEN_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
  };

  findOne = async (id: string) => {
    const fragmen = await this.prisma.fragmen.findUnique({
      where: { id },
      include: FRAGMEN_INCLUDE,
    });
    if (!fragmen) throw new NotFoundException("Fragmen tidak ditemukan");
    return fragmen;
  };

  create = (dto: CreateFragmenDto, authorId: string) => {
    return this.prisma.fragmen.create({
      data: { ...dto, takenAt: new Date(dto.takenAt), authorId },
    });
  };

  update = async (id: string, dto: UpdateFragmenDto, userId: string) => {
    const fragmen = await this.prisma.fragmen.findUnique({ where: { id } });
    if (!fragmen) throw new NotFoundException("Fragmen tidak ditemukan");
    if (fragmen.authorId !== userId)
      throw new ForbiddenException("Bukan milik kamu");
    return this.prisma.fragmen.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.takenAt && { takenAt: new Date(dto.takenAt) }),
      },
    });
  };

  remove = async (id: string, userId: string) => {
    const fragmen = await this.prisma.fragmen.findUnique({ where: { id } });
    if (!fragmen) throw new NotFoundException("Fragmen tidak ditemukan");
    if (fragmen.authorId !== userId)
      throw new ForbiddenException("Bukan milik kamu");
    return this.prisma.fragmen.delete({ where: { id } });
  };
}

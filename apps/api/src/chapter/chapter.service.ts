import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChapterDto, UpdateChapterDto } from "@satuwaktu/dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  findAll = () => {
    return this.prisma.chapter.findMany({ orderBy: { order: "asc" } });
  };

  findOne = async (id: string) => {
    const chapter = await this.prisma.chapter.findUnique({ where: { id } });
    if (!chapter) throw new NotFoundException("Chapter tidak ditemukan");
    return chapter;
  };

  create = (dto: CreateChapterDto) => {
    return this.prisma.chapter.create({ data: dto });
  };

  update = async (id: string, dto: UpdateChapterDto) => {
    await this.findOne(id);
    return this.prisma.chapter.update({ where: { id }, data: dto });
  };

  findBySlug = async (slug: string) => {
    const chapter = await this.prisma.chapter.findUnique({ where: { slug } });
    if (!chapter) throw new NotFoundException("Chapter tidak ditemukan");
    return chapter;
  };

  remove = async (id: string) => {
    await this.findOne(id);
    return this.prisma.chapter.delete({ where: { id } });
  };
}

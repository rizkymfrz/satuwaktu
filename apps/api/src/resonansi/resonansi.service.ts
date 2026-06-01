import { Injectable } from "@nestjs/common";
import { CreateResonansiDto } from "@satuwaktu/dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResonansiService {
  constructor(private prisma: PrismaService) {}

  getCounts = async (fragmenId: string) => {
    const [BEEN_HERE, BEING_HERE, MISS_THIS] = await Promise.all([
      this.prisma.resonansi.count({ where: { fragmenId, type: "BEEN_HERE" } }),
      this.prisma.resonansi.count({
        where: { fragmenId, type: "BEING_HERE" },
      }),
      this.prisma.resonansi.count({ where: { fragmenId, type: "MISS_THIS" } }),
    ]);
    return {
      BEEN_HERE,
      BEING_HERE,
      MISS_THIS,
      total: BEEN_HERE + BEING_HERE + MISS_THIS,
    };
  };

  toggle = async (fragmenId: string, dto: CreateResonansiDto) => {
    const existing = await this.prisma.resonansi.findUnique({
      where: {
        fragmenId_visitorToken: {
          fragmenId,
          visitorToken: dto.visitorToken,
        },
      },
    });

    if (existing) {
      if (existing.type === dto.type) {
        await this.prisma.resonansi.delete({ where: { id: existing.id } });
        return { toggled: false };
      }
      await this.prisma.resonansi.update({
        where: { id: existing.id },
        data: { type: dto.type },
      });
      return { toggled: true };
    }

    await this.prisma.resonansi.create({ data: { fragmenId, ...dto } });
    return { toggled: true };
  };
}

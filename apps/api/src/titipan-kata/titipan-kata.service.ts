import { Injectable } from "@nestjs/common";
import { CreateTitipanKataDto } from "@satuwaktu/dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TitipanKataService {
  constructor(private prisma: PrismaService) {}

  findAll = (fragmenId: string) => {
    return this.prisma.titipanKata.findMany({
      where: { fragmenId },
      orderBy: { createdAt: "desc" },
    });
  };

  create = (fragmenId: string, dto: CreateTitipanKataDto) => {
    return this.prisma.titipanKata.create({ data: { fragmenId, ...dto } });
  };
}

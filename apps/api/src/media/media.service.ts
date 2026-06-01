import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { Injectable, NotFoundException } from "@nestjs/common";
import { imageSizeFromFile } from "image-size/fromFile";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  upload = async (fragmenId: string, file: Express.Multer.File) => {
    let dimensions: { width?: number; height?: number } = {};

    try {
      if (file.mimetype.startsWith("image/")) {
        const result = await imageSizeFromFile(file.path);
        dimensions = { width: result.width, height: result.height };
      }
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }

    return this.prisma.media.create({
      data: {
        fragmenId,
        url: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        order: 0,
      },
    });
  };

  delete = async (id: string) => {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException("Media tidak ditemukan");
    const filePath = join(
      process.cwd(),
      "uploads",
      media.url.replace("/uploads/", ""),
    );
    if (existsSync(filePath)) unlinkSync(filePath);
    return this.prisma.media.delete({ where: { id } });
  };
}

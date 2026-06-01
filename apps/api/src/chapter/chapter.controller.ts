import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateChapterDto, UpdateChapterDto } from "@satuwaktu/dto";
import { Public } from "../common/decorators/public.decorator";
import { ChapterService } from "./chapter.service";

@Controller({ version: "1", path: "chapters" })
export class ChapterController {
  constructor(private chapter: ChapterService) {}

  @Get()
  @Public()
  findAll() {
    return this.chapter.findAll();
  }

  @Get("slug/:slug")
  @Public()
  findBySlug(@Param("slug") slug: string) {
    return this.chapter.findBySlug(slug);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.chapter.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.chapter.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateChapterDto) {
    return this.chapter.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.chapter.remove(id);
  }
}

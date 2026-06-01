import { Module } from "@nestjs/common";
import { ChapterController } from "./chapter.controller";
import { ChapterService } from "./chapter.service";

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}

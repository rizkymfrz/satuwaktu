import { Module } from "@nestjs/common";
import { ResonansiController } from "./resonansi.controller";
import { ResonansiService } from "./resonansi.service";

@Module({
  controllers: [ResonansiController],
  providers: [ResonansiService],
})
export class ResonansiModule {}

import { Module } from "@nestjs/common";
import { TitipanKataController } from "./titipan-kata.controller";
import { TitipanKataService } from "./titipan-kata.service";

@Module({
  controllers: [TitipanKataController],
  providers: [TitipanKataService],
})
export class TitipanKataModule {}

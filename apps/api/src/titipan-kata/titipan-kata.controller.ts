import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateTitipanKataDto } from "@satuwaktu/dto";
import { Public } from "../common/decorators/public.decorator";
import { TitipanKataService } from "./titipan-kata.service";

@Controller({ version: "1", path: "fragmen" })
export class TitipanKataController {
  constructor(private titipanKata: TitipanKataService) {}

  @Get(":fragmenId/titipan-kata")
  @Public()
  findAll(@Param("fragmenId") fragmenId: string) {
    return this.titipanKata.findAll(fragmenId);
  }

  @Post(":fragmenId/titipan-kata")
  @Public()
  create(
    @Param("fragmenId") fragmenId: string,
    @Body() dto: CreateTitipanKataDto,
  ) {
    return this.titipanKata.create(fragmenId, dto);
  }
}

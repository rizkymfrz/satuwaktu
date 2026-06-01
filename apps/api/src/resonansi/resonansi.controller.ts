import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateResonansiDto } from "@satuwaktu/dto";
import { Public } from "../common/decorators/public.decorator";
import { ResonansiService } from "./resonansi.service";

@Controller({ version: "1", path: "fragmen" })
export class ResonansiController {
  constructor(private resonansi: ResonansiService) {}

  @Get(":fragmenId/resonansi")
  @Public()
  getCounts(@Param("fragmenId") fragmenId: string) {
    return this.resonansi.getCounts(fragmenId);
  }

  @Post(":fragmenId/resonansi")
  @Public()
  toggle(
    @Param("fragmenId") fragmenId: string,
    @Body() dto: CreateResonansiDto,
  ) {
    return this.resonansi.toggle(fragmenId, dto);
  }
}

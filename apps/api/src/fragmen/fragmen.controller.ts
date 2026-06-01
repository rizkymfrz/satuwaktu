import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  CreateFragmenDto,
  QueryFragmenDto,
  UpdateFragmenDto,
} from "@satuwaktu/dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { FragmenService } from "./fragmen.service";

@Controller({ version: "1", path: "fragmen" })
export class FragmenController {
  constructor(private fragmen: FragmenService) {}

  @Get()
  @Public()
  findAll(@Query() query: QueryFragmenDto) {
    return this.fragmen.findAll(query);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.fragmen.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFragmenDto, @CurrentUser() user: { id: string }) {
    return this.fragmen.create(dto, user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateFragmenDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.fragmen.update(id, dto, user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: { id: string }) {
    return this.fragmen.remove(id, user.id);
  }
}

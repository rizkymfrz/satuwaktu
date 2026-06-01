import { Module } from "@nestjs/common";
import { FragmenController } from "./fragmen.controller";
import { FragmenService } from "./fragmen.service";

@Module({
  controllers: [FragmenController],
  providers: [FragmenService],
  exports: [FragmenService],
})
export class FragmenModule {}

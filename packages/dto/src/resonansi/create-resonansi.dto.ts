import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import type { ResonansiType } from "@satuwaktu/types";

export class CreateResonansiDto {
  @IsEnum(["BEEN_HERE", "BEING_HERE", "MISS_THIS"])
  type: ResonansiType;

  @IsString()
  @IsNotEmpty()
  visitorToken: string;
}

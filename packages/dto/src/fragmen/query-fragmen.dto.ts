import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import type { FragmenType, Mood } from "@satuwaktu/types";

export class QueryFragmenDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(["PHOTO", "VIDEO", "TEXT"])
  type?: FragmenType;

  @IsOptional()
  @IsEnum(["HANGAT", "SUNYI", "RIUH", "SENDU", "TERANG"])
  mood?: Mood;

  @IsOptional()
  @IsString()
  chapterId?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === "true")
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === "true")
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === "true")
  @IsBoolean()
  isPinned?: boolean;
}

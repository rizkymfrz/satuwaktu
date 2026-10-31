import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { toBoolean } from "../common/transforms.js";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_SEARCH_LENGTH,
  type ListFragmentsParams,
} from "./fragment.params.js";

export class ListFragmentsQuery implements ListFragmentsParams {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chapterId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  uploaderId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  q?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  hasLocation?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  pinned?: boolean;
}

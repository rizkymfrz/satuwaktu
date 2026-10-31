import { Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import {
  DEFAULT_COMMENT_PAGE_SIZE,
  MAX_COMMENT_PAGE_SIZE,
  type ListCommentsParams,
} from "./comment.params.js";

export class ListCommentsQuery implements ListCommentsParams {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_COMMENT_PAGE_SIZE)
  limit: number = DEFAULT_COMMENT_PAGE_SIZE;
}

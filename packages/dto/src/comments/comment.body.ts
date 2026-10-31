import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { trimmed } from "../common/transforms.js";
import {
  MAX_COMMENT_LENGTH,
  type CreateCommentParams,
  type CreateReplyParams,
} from "./comment.params.js";

export class CreateCommentBody implements CreateCommentParams {
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_COMMENT_LENGTH)
  text!: string;
}

export class CreateReplyBody implements CreateReplyParams {
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_COMMENT_LENGTH)
  text!: string;
}

import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { collapsed } from "../common/transforms.js";
import {
  MAX_CHAPTER_NAME_LENGTH,
  type CreateChapterParams,
} from "./chapter.params.js";

export class CreateChapterBody implements CreateChapterParams {
  @Transform(collapsed)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHAPTER_NAME_LENGTH)
  name!: string;
}

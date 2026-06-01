import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import type { FragmenType, Mood } from "@satuwaktu/types";

export class UpdateFragmenDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsEnum(["PHOTO", "VIDEO", "TEXT"])
  @IsOptional()
  type?: FragmenType;

  @IsEnum(["HANGAT", "SUNYI", "RIUH", "SENDU", "TERANG"])
  @IsOptional()
  mood?: Mood;

  @IsDateString()
  @IsOptional()
  takenAt?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  chapterId?: string;
}

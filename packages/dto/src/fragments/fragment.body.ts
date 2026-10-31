import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsISO8601,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { trimmed } from "../common/transforms.js";
import {
  MAX_CAPTION_LENGTH,
  MAX_PLACE_NAME_LENGTH,
  MAX_SONG_TEXT_LENGTH,
  MAX_SONG_URL_LENGTH,
  type CreateFragmentParams,
  type LocationInput,
  type SongInput,
  type UpdateFragmentParams,
} from "./fragment.params.js";
import { VISIBILITIES, type FragmentVisibility } from "./fragment.view.js";

export class LocationBody implements LocationInput {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(MAX_PLACE_NAME_LENGTH)
  name?: string;
}

const SONG_URL_OPTIONS = { protocols: ["https"], require_protocol: true };

export class SongBody implements SongInput {
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_SONG_TEXT_LENGTH)
  title!: string;

  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(MAX_SONG_TEXT_LENGTH)
  artist?: string;

  @IsUrl(SONG_URL_OPTIONS)
  @MaxLength(MAX_SONG_URL_LENGTH)
  uri!: string;

  @IsOptional()
  @IsUrl(SONG_URL_OPTIONS)
  @MaxLength(MAX_SONG_URL_LENGTH)
  artworkUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  startSec?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  endSec?: number;
}

export class CreateFragmentBody implements CreateFragmentParams {
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(MAX_CAPTION_LENGTH)
  caption?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  takenAt?: string;

  @IsOptional()
  @IsIn(VISIBILITIES)
  visibility?: FragmentVisibility;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chapterId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  photoUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationBody)
  location?: LocationBody | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => SongBody)
  song?: SongBody | null;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}

export class UpdateFragmentBody implements UpdateFragmentParams {
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trimmed)
  @IsString()
  @MaxLength(MAX_CAPTION_LENGTH)
  caption?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsISO8601({ strict: true })
  takenAt?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsIn(VISIBILITIES)
  visibility?: FragmentVisibility;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chapterId?: string | null;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MaxLength(200)
  photoUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationBody)
  location?: LocationBody | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => SongBody)
  song?: SongBody | null;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  pinned?: boolean;
}

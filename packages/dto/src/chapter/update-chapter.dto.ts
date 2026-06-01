import { IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class UpdateChapterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

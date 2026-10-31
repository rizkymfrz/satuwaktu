import { IsBoolean, IsIn, ValidateIf } from "class-validator";
import {
  VISIBILITIES,
  type FragmentVisibility,
} from "../fragments/fragment.view.js";
import type { UpdateSettingsParams } from "./settings.params.js";
import { TEXT_SIZES, type TextSize } from "./settings.view.js";

export class UpdateSettingsBody implements UpdateSettingsParams {
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  notifComment?: boolean;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  notifLike?: boolean;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  notifOnThisDay?: boolean;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  dataSaver?: boolean;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  autoSavePhotos?: boolean;

  @ValidateIf((_, value) => value !== undefined)
  @IsIn(TEXT_SIZES)
  textSize?: TextSize;

  @ValidateIf((_, value) => value !== undefined)
  @IsIn(VISIBILITIES)
  defaultVisibility?: FragmentVisibility;
}

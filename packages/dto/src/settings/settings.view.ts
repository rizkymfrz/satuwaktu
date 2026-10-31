import type { FragmentVisibility } from "../fragments/fragment.view.js";

export const TEXT_SIZES = ["SMALL", "NORMAL", "LARGE"] as const;

export type TextSize = (typeof TEXT_SIZES)[number];

export interface SettingsView {
  notifComment: boolean;
  notifLike: boolean;
  notifOnThisDay: boolean;
  dataSaver: boolean;
  autoSavePhotos: boolean;
  textSize: TextSize;
  defaultVisibility: FragmentVisibility;
}

import type { Fragment } from "@/features/archive/types";

const DEFAULT_RATIO = 4 / 3;
const MIN_RATIO = 1 / 2;
const MAX_RATIO = 2;

function clampRatio(width: number, height: number) {
  if (!width || !height) {
    return DEFAULT_RATIO;
  }
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, width / height));
}

function initialPhotoRatio(editing: Fragment | undefined) {
  return editing ? clampRatio(1, editing.aspect) : DEFAULT_RATIO;
}

export { clampRatio, DEFAULT_RATIO, initialPhotoRatio };

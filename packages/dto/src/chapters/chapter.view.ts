import type { FragmentView } from "../fragments/fragment.view.js";

export interface ChapterView {
  id: string;
  name: string;
  position: number;
  fragmentCount: number;
  likeCount: number;
  firstTakenAt: string | null;
  lastTakenAt: string | null;
  preview: FragmentView[];
}

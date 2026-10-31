import type { ChapterView, FragmentView } from '@repo/dto';

export interface ChapterStats {
  fragmentCount: number;
  likeCount: number;
  firstTakenAt: string | null;
  lastTakenAt: string | null;
  preview: FragmentView[];
}

export function emptyChapterStats(): ChapterStats {
  return {
    fragmentCount: 0,
    likeCount: 0,
    firstTakenAt: null,
    lastTakenAt: null,
    preview: [],
  };
}

export function toChapterView(
  chapter: { id: string; name: string; position: number },
  stats: ChapterStats,
): ChapterView {
  return {
    id: chapter.id,
    name: chapter.name,
    position: chapter.position,
    ...stats,
  };
}

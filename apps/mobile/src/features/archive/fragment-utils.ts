import type { ChapterRef, Fragment } from "@/features/archive/types";

const NO_CHAPTER_ID = "none";
const NO_CHAPTER_NAME = "Tanpa babak";

type ChapterGroup = {
  id: string;
  name: string;
  fragments: Fragment[];
  from: string;
  to: string;
  likes: number;
};

function groupByChapter(
  fragments: Fragment[],
  order: ChapterRef[],
  keepEmpty = false,
) {
  const chapters = [...order, { id: NO_CHAPTER_ID, name: NO_CHAPTER_NAME }];
  return chapters
    .map(({ id, name }) => {
      const items = fragments
        .filter((fragment) =>
          id === NO_CHAPTER_ID
            ? !fragment.chapter
            : fragment.chapter?.id === id,
        )
        .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
      return {
        id,
        name,
        fragments: items,
        from: items[items.length - 1]?.takenAt ?? "",
        to: items[0]?.takenAt ?? "",
        likes: items.reduce((sum, item) => sum + item.likes, 0),
      } satisfies ChapterGroup;
    })
    .filter(
      (group) =>
        group.fragments.length > 0 || (keepEmpty && group.id !== NO_CHAPTER_ID),
    );
}

export { groupByChapter, NO_CHAPTER_ID, NO_CHAPTER_NAME };
export type { ChapterGroup };

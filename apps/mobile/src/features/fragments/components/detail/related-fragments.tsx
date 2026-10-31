import { useMemo } from "react";
import { useFragments } from "@repo/sdk";
import { toFragment } from "@/features/archive/from-api";
import type { ChapterRef } from "@/features/archive/types";
import { RelatedFromChapter } from "@/features/fragments/components/detail/related-from-chapter";

const RELATED_LIMIT = 8;

function RelatedFragments({
  fragmentId,
  chapter,
  onOpen,
}: {
  fragmentId: string;
  chapter: ChapterRef;
  onOpen: (id: string) => void;
}) {
  const { data } = useFragments({
    chapterId: chapter.id,
    limit: RELATED_LIMIT + 1,
  });
  const items = useMemo(
    () =>
      (data?.pages[0]?.items ?? [])
        .filter((item) => item.id !== fragmentId)
        .slice(0, RELATED_LIMIT)
        .map(toFragment),
    [data, fragmentId],
  );
  return <RelatedFromChapter chapter={chapter} items={items} onOpen={onOpen} />;
}

export { RelatedFragments };

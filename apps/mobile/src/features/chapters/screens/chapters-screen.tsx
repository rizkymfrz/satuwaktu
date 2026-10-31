import { useScrollToTop } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { useRef, useState } from "react";
import { type ScrollViewInstance } from "react-native";
import { useChapters } from "@repo/sdk";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { ScreenScroll } from "@/components/layout/screen-scroll";
import { Enter } from "@/components/motion/enter";
import { ChapterCard } from "@/features/chapters/components/chapter-card";
import { ChaptersSkeleton } from "@/features/chapters/components/chapters-skeleton";
import { NewChapterCard } from "@/features/chapters/components/new-chapter-card";
import { NewChapterDialog } from "@/features/chapters/components/new-chapter-dialog";
import { useSession } from "@/features/session/store";

function ChaptersScreen() {
  const query = useChapters();
  const { role } = useSession();
  const [creating, setCreating] = useState(false);
  const ref = useRef<ScrollViewInstance>(null);
  useScrollToTop(ref);
  const chapters = query.data ?? [];
  return (
    <Screen title="Babak">
      <ScreenScroll ref={ref} contentContainerClassName="gap-4 px-4 pb-8 pt-4">
        {role === "owner" ? (
          <NewChapterCard onPress={() => setCreating(true)} />
        ) : null}
        {query.isPending ? (
          <ChaptersSkeleton />
        ) : query.isError ? (
          <QueryError
            message="Tidak bisa memuat babak"
            onRetry={() => query.refetch()}
            className="py-8"
          />
        ) : chapters.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Belum ada babak yang dibuka"
            className="py-8"
          >
            Babak-babak akan berjajar di sini, begitu kalian mulai merangkainya.
          </EmptyState>
        ) : (
          chapters.map((chapter, index) => (
            <Enter key={chapter.id} index={index}>
              <ChapterCard chapter={chapter} />
            </Enter>
          ))
        )}
      </ScreenScroll>
      <NewChapterDialog open={creating} onOpenChange={setCreating} />
    </Screen>
  );
}

export { ChaptersScreen };

import { useLocalSearchParams, useRouter } from "expo-router";
import { CircleHelp } from "lucide-react-native";
import { View } from "react-native";
import { useChapters } from "@repo/sdk";
import { EmptyState } from "@/components/layout/empty-state";
import { MasonryGrid } from "@/components/layout/masonry-grid";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { ScreenScroll } from "@/components/layout/screen-scroll";
import { Enter } from "@/components/motion/enter";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { FragmentTile } from "@/features/archive/components/fragment-tile";
import type { Fragment } from "@/features/archive/types";
import { useFragmentList } from "@/features/archive/use-fragment-list";
import { ChapterSkeleton } from "@/features/chapters/components/chapter-skeleton";
import { ChapterSummary } from "@/features/chapters/components/chapter-summary";

const heightOf = (fragment: Fragment, columnWidth: number) =>
  columnWidth * fragment.aspect;

function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chaptersQuery = useChapters();
  const { query: fragmentsQuery, fragments } = useFragmentList({
    chapterId: id,
  });
  const chapter = chaptersQuery.data?.find((item) => item.id === id);
  const loadMore = () => {
    if (fragmentsQuery.hasNextPage && !fragmentsQuery.isFetchingNextPage) {
      void fragmentsQuery.fetchNextPage();
    }
  };
  if (!chapter) {
    return (
      <Screen title="Babak" back>
        {chaptersQuery.isPending ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Spinner size={28} />
            <TypographyMuted>Memuat babak…</TypographyMuted>
          </View>
        ) : chaptersQuery.isError ? (
          <QueryError
            message="Tidak bisa memuat babak"
            onRetry={() => chaptersQuery.refetch()}
            fill
          />
        ) : (
          <EmptyState fill icon={CircleHelp} title="Babak ini tak ditemukan">
            Mungkin sudah dihapus atau tautannya keliru.
          </EmptyState>
        )}
      </Screen>
    );
  }
  return (
    <Screen title={chapter.name} back>
      <ScreenScroll
        onNearEnd={loadMore}
        contentContainerClassName="gap-4 px-4 pb-8 pt-4"
      >
        <ChapterSummary chapter={chapter} />
        {fragmentsQuery.isPending ? (
          <ChapterSkeleton />
        ) : fragmentsQuery.isError && fragments.length === 0 ? (
          <QueryError
            message="Tidak bisa memuat fragmen"
            onRetry={() => fragmentsQuery.refetch()}
            className="py-8"
          />
        ) : (
          <MasonryGrid
            items={fragments}
            heightOf={heightOf}
            keyOf={(fragment) => fragment.id}
            renderItem={(fragment, columnWidth, slot) => (
              <Enter index={slot}>
                <FragmentTile
                  fragment={fragment}
                  width={columnWidth}
                  onOpen={() =>
                    router.push({
                      pathname: "/fragments/[id]",
                      params: { id: fragment.id },
                    })
                  }
                />
              </Enter>
            )}
          />
        )}
        {fragmentsQuery.isFetchingNextPage ? (
          <View className="items-center">
            <Spinner />
          </View>
        ) : null}
      </ScreenScroll>
    </Screen>
  );
}

export { ChapterDetailScreen };

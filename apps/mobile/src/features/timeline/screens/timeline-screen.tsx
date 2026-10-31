import { useScrollToTop } from "expo-router";
import { History } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { RefreshControl, View, type FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { Enter } from "@/components/motion/enter";
import { RevealContext, useRevealScroll } from "@/components/motion/reveal";
import { Spinner } from "@/components/ui/spinner";
import { useFragmentList } from "@/features/archive/use-fragment-list";
import { TimelineRow } from "@/features/timeline/components/timeline-row";
import { TimelineSkeleton } from "@/features/timeline/components/timeline-skeleton";
import { groupByMonth } from "@/features/timeline/group-by-month";

function TimelineScreen() {
  const { query, fragments } = useFragmentList();
  const ref = useRef<FlatList>(null);
  useScrollToTop(ref);
  const { scrollY, onScroll } = useRevealScroll();
  const [refreshing, setRefreshing] = useState(false);
  const rows = useMemo(
    () => groupByMonth(fragments, query.hasNextPage),
    [fragments, query.hasNextPage],
  );
  const headerIndices = useMemo(
    () => rows.flatMap((row, index) => (row.type === "header" ? [index] : [])),
    [rows],
  );
  const refresh = async () => {
    setRefreshing(true);
    try {
      await query.refetch();
    } finally {
      setRefreshing(false);
    }
  };
  const loadMore = () => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError
    ) {
      void query.fetchNextPage();
    }
  };
  return (
    <Screen title="Linimasa">
      <RevealContext.Provider value={scrollY}>
        <Animated.FlatList
          onScroll={onScroll}
          scrollEventThrottle={16}
          ref={ref}
          initialNumToRender={8}
          windowSize={7}
          maxToRenderPerBatch={6}
          data={rows}
          stickyHeaderIndices={headerIndices}
          keyExtractor={(row) => row.key}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => (
            <Enter index={index}>
              <TimelineRow
                row={item}
                first={index === 0}
                last={index === rows.length - 1 && !query.hasNextPage}
              />
            </Enter>
          )}
          ListEmptyComponent={
            query.isPending ? (
              <TimelineSkeleton />
            ) : query.isError ? (
              <QueryError
                message="Tidak bisa memuat linimasa"
                onRetry={() => query.refetch()}
                className="py-8"
              />
            ) : (
              <EmptyState
                icon={History}
                title="Linimasa masih lengang"
                className="py-8"
              >
                Fragmen akan berjajar di sini, mengikuti waktunya.
              </EmptyState>
            )
          }
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View className="items-center py-4">
                <Spinner />
              </View>
            ) : query.isFetchNextPageError ? (
              <QueryError
                message="Tidak bisa memuat lebih banyak"
                onRetry={() => query.fetchNextPage()}
                className="py-4"
              />
            ) : undefined
          }
          contentContainerClassName="px-4 pb-8 pt-2"
        />
      </RevealContext.Provider>
    </Screen>
  );
}

export { TimelineScreen };

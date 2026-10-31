import { SearchX } from "lucide-react-native";
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Spinner } from "@/components/ui/spinner";
import { FragmentRow } from "@/features/archive/components/fragment-row";
import { useFragmentList } from "@/features/archive/use-fragment-list";

const NEAR_END_PX = 600;

function SearchResults({
  q,
  chapterId,
  onOpenResult,
}: {
  q: string;
  chapterId: string | null;
  onOpenResult: () => void;
}) {
  const { query, fragments: results } = useFragmentList({
    q: q || undefined,
    chapterId: chapterId ?? undefined,
  });
  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  };
  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    if (
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - NEAR_END_PX
    ) {
      loadMore();
    }
  };
  if (query.isPending) {
    return (
      <View className="items-center py-8">
        <Spinner size={28} />
      </View>
    );
  }
  if (query.isError && results.length === 0) {
    return (
      <QueryError
        message="Tidak bisa memuat hasil pencarian"
        onRetry={() => query.refetch()}
        className="px-4 py-8"
      />
    );
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-4 px-4 pb-8"
      scrollEventThrottle={100}
      onScroll={onScroll}
    >
      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="Belum ketemu">
          Coba kata yang lain, atau babak yang berbeda.
        </EmptyState>
      ) : null}
      {results.map((fragment) => (
        <FragmentRow
          key={fragment.id}
          fragment={fragment}
          highlight={q}
          onOpen={onOpenResult}
        />
      ))}
      {query.isFetchingNextPage ? (
        <View className="items-center">
          <Spinner />
        </View>
      ) : null}
    </ScrollView>
  );
}

export { SearchResults };

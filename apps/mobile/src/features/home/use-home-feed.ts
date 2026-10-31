import { useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  archiveKeys,
  fragmentKeys,
  useArchive,
  useChapters,
  useOnThisDay,
  useRecordVisit,
} from "@repo/sdk";
import { toFragment } from "@/features/archive/from-api";
import { useFragmentList } from "@/features/archive/use-fragment-list";
import { buildItems } from "@/features/home/feed";
import type { StatKind } from "@/features/home/types";
import { daysSince } from "@/lib/format";

function useHomeFeed() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [seed, setSeed] = useState(1);
  const [chapter, setChapter] = useState<string | null>(null);
  const filters = { chapterId: chapter ?? undefined };
  const { query: pinnedQuery, fragments: pinned } = useFragmentList({
    ...filters,
    pinned: true,
  });
  const { query: mainQuery, fragments: main } = useFragmentList(filters);
  const chaptersQuery = useChapters();
  const archiveQuery = useArchive();
  const onThisDayQuery = useOnThisDay();
  const { mutate: recordVisit } = useRecordVisit();
  useEffect(() => {
    recordVisit();
  }, [recordVisit]);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setSeed((current) => current + 1);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: fragmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "tabPress" as never,
      (() => {
        if (navigation.isFocused()) {
          void refresh();
        }
      }) as never,
    );
    return unsubscribe;
  }, [navigation, refresh]);
  const fragments = useMemo(() => {
    const pinnedIds = new Set(pinned.map((item) => item.id));
    return [...pinned, ...main.filter((item) => !pinnedIds.has(item.id))];
  }, [pinned, main]);
  const items = useMemo(() => buildItems(fragments, seed), [fragments, seed]);
  const todayMemory = useMemo(() => {
    const memory = onThisDayQuery.data?.memory;
    return memory ? toFragment(memory) : null;
  }, [onThisDayQuery.data]);
  const archive = archiveQuery.data;
  const stats = {
    fragments: archive?.fragmentCount ?? 0,
    likes: archive?.likeCount ?? 0,
    days: archive ? daysSince(archive.startedAt) : 0,
  } satisfies Record<StatKind, number>;
  const loading = mainQuery.isPending || pinnedQuery.isPending;
  const error = mainQuery.isError;
  const selectChapter = (next: string | null) => {
    setChapter(next);
  };
  const loadMore = () => {
    if (mainQuery.hasNextPage && !mainQuery.isFetchingNextPage) {
      void mainQuery.fetchNextPage();
    }
  };
  const hasFragments = fragments.length > 0;
  const archiveEmpty = !loading && !error && !hasFragments && chapter === null;
  const filterEmpty = !loading && !error && !hasFragments && chapter !== null;
  const reachedEnd = hasFragments && !mainQuery.hasNextPage;
  return {
    chapters: chaptersQuery.data ?? [],
    chapter,
    loading,
    error,
    refreshing,
    loadingMore: mainQuery.isFetchingNextPage,
    fragments,
    items,
    stats,
    todayMemory,
    archiveEmpty,
    filterEmpty,
    reachedEnd,
    selectChapter,
    refresh,
    loadMore,
  };
}

export { useHomeFeed };

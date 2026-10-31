import { useRouter, useScrollToTop } from "expo-router";
import { Shuffle } from "lucide-react-native";
import { useRef } from "react";
import { RefreshControl, View, type ScrollViewInstance } from "react-native";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { RevealScrollView } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { ChapterFilter } from "@/features/archive/components/chapter-filter";
import { AppHeader } from "@/features/home/components/app-header";
import { FeedGrid } from "@/features/home/components/feed-grid";
import { FeedSkeleton } from "@/features/home/components/feed-skeleton";
import { TodayMemoryCard } from "@/features/home/components/today-memory-card";
import { VisitCounter } from "@/features/home/components/visit-counter";
import { useHomeFeed } from "@/features/home/use-home-feed";

function HomeScreen() {
  const router = useRouter();
  const feed = useHomeFeed();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const todayMemory = feed.todayMemory;
  useScrollToTop(scrollRef);
  const openFragment = (id: string) =>
    router.push({ pathname: "/fragments/[id]", params: { id } });
  const surprise = () => {
    if (feed.fragments.length === 0) {
      return;
    }
    openFragment(
      feed.fragments[Math.floor(Math.random() * feed.fragments.length)].id,
    );
  };
  return (
    <Screen header={<AppHeader />}>
      {feed.loading ? (
        <FeedSkeleton />
      ) : feed.error ? (
        <QueryError
          message="Tidak bisa memuat arsip"
          onRetry={feed.refresh}
          fill
        />
      ) : (
        <>
          <RevealScrollView
            ref={scrollRef}
            onNearEnd={feed.loadMore}
            refreshControl={
              <RefreshControl
                refreshing={feed.refreshing}
                onRefresh={feed.refresh}
              />
            }
            contentContainerClassName="gap-4 pb-8 pt-4"
          >
            {todayMemory ? (
              <TodayMemoryCard
                fragment={todayMemory}
                onOpen={() => openFragment(todayMemory.id)}
              />
            ) : null}
            {feed.archiveEmpty ? null : (
              <ChapterFilter
                chapters={feed.chapters}
                active={feed.chapter}
                onChange={feed.selectChapter}
              />
            )}
            <FeedGrid
              items={feed.items}
              stats={feed.stats}
              archiveEmpty={feed.archiveEmpty}
              filterEmpty={feed.filterEmpty}
              onOpenFragment={openFragment}
              onResetFilter={() => feed.selectChapter(null)}
            />
            {feed.loadingMore ? (
              <View className="items-center">
                <Spinner />
              </View>
            ) : null}
            {!feed.archiveEmpty && !feed.filterEmpty ? <VisitCounter /> : null}
            {feed.reachedEnd ? (
              <TypographyMuted className="text-center">
                Hanya itu yang tersimpan, sejauh ini.
              </TypographyMuted>
            ) : null}
          </RevealScrollView>
          {feed.archiveEmpty || feed.filterEmpty ? null : (
            <View className="absolute bottom-4 right-4 size-12">
              <Button
                circle
                size="icon-lg"
                shadowSize="md"
                className="size-12 rounded-full"
                accessibilityLabel="Bawa aku ke suatu waktu"
                onPress={surprise}
              >
                <Icon as={Shuffle} size={20} />
              </Button>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

export { HomeScreen };

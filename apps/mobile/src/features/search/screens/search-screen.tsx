import { useNavigation } from "expo-router";
import { Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  View,
  type TextInputInstance,
} from "react-native";
import { MAX_SEARCH_LENGTH } from "@repo/dto";
import { useChapters } from "@repo/sdk";
import { EmptyState } from "@/components/layout/empty-state";
import { Screen } from "@/components/layout/screen";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ChapterFilter } from "@/features/archive/components/chapter-filter";
import { RecentSearches } from "@/features/search/components/recent-searches";
import { SearchResults } from "@/features/search/components/search-results";
import { useRecentSearches } from "@/features/search/use-recent-searches";
import { KeyboardInsetView } from "@/lib/keyboard-reveal";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const DEBOUNCE_MS = 300;

function SearchScreen() {
  const navigation = useNavigation();
  const inputRef = useRef<TextInputInstance>(null);
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState<string | null>(null);
  const chapters = useChapters().data ?? [];
  const recent = useRecentSearches();
  const needle = query.trim();
  const settled = useDebouncedValue(needle, DEBOUNCE_MS);
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "transitionEnd" as never,
      (() => inputRef.current?.focus()) as never,
    );
    return unsubscribe;
  }, [navigation]);
  const searching = needle !== "" || chapterId !== null;
  return (
    <Screen title="Cari" back>
      <View className="gap-4 pb-4 pt-4">
        <View className="px-4">
          <Input
            ref={inputRef}
            autoFocus={Platform.OS === "web"}
            value={query}
            onChangeText={setQuery}
            placeholder="Sepotong cerita atau nama babak"
            accessibilityLabel="Cari fragmen"
            returnKeyType="search"
            maxLength={MAX_SEARCH_LENGTH}
            onSubmitEditing={() => recent.add(needle)}
          />
        </View>
        {chapters.length > 0 ? (
          <ChapterFilter
            chapters={chapters}
            active={chapterId}
            onChange={setChapterId}
          />
        ) : null}
      </View>
      <KeyboardInsetView className="flex-1">
        {!searching ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="gap-4 px-4 pb-8"
          >
            {recent.recent.length > 0 ? (
              <RecentSearches
                terms={recent.recent}
                onSelect={setQuery}
                onRemove={recent.remove}
                onClear={recent.clear}
              />
            ) : (
              <EmptyState icon={Search} title="Cari yang tersimpan">
                Ketik sepotong cerita, atau pilih babak, untuk mulai menelusuri.
              </EmptyState>
            )}
          </ScrollView>
        ) : needle !== settled ? (
          <View className="items-center py-8">
            <Spinner size={28} />
          </View>
        ) : (
          <SearchResults
            q={needle}
            chapterId={chapterId}
            onOpenResult={() => recent.add(needle)}
          />
        )}
      </KeyboardInsetView>
    </Screen>
  );
}

export { SearchScreen };

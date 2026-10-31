import { Music } from "lucide-react-native";
import { View } from "react-native";
import { EmptyState } from "@/components/layout/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import type { Song } from "@/features/archive/types";
import { SongResultItem } from "@/features/fragments/components/song/song-result-item";
import type { SearchState } from "@/features/fragments/use-song-search";

function SongResults({
  search,
  selected,
  onSelect,
}: {
  search: SearchState;
  selected: Song | null;
  onSelect: (song: Song) => void;
}) {
  if (search.status === "idle") {
    return (
      <TypographyMuted>
        Ketik minimal 2 huruf untuk mencari lagu.
      </TypographyMuted>
    );
  }
  if (search.status === "loading") {
    return (
      <View className="items-center gap-2 py-8">
        <Spinner size={28} />
        <TypographyMuted>Mencari lagu…</TypographyMuted>
      </View>
    );
  }
  if (search.status === "error") {
    return (
      <TypographyMuted>
        Pencarian gagal. Periksa koneksi lalu coba lagi.
      </TypographyMuted>
    );
  }
  if (search.songs.length === 0) {
    return (
      <EmptyState compact icon={Music}>
        Belum ada lagu yang menyahut.
      </EmptyState>
    );
  }
  return search.songs.map((song) => {
    const active = selected?.uri === song.uri;
    return (
      <SongResultItem
        key={song.uri}
        song={song}
        active={active}
        onPress={() => {
          if (!active) {
            onSelect(song);
          }
        }}
      />
    );
  });
}

export { SongResults };

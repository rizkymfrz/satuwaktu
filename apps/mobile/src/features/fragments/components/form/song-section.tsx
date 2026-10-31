import { Music, X } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Text } from "@/components/ui/text";
import type { Song } from "@/features/archive/types";
import { formatClock } from "@/lib/format";

function SongSection({
  song,
  onClear,
  onPick,
}: {
  song: Song | null;
  onClear: () => void;
  onPick: () => void;
}) {
  return (
    <View className="gap-4">
      {song ? (
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Icon as={Music} size={18} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{song.title}</ItemTitle>
            <ItemDescription numberOfLines={1}>
              {song.artist} · {formatClock(song.startSec ?? 0)} –{" "}
              {formatClock(song.endSec ?? 30)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="icon-sm"
              variant="destructive"
              accessibilityLabel="Hapus lagu"
              onPress={onClear}
            >
              <Icon as={X} size={16} />
            </Button>
          </ItemActions>
        </Item>
      ) : null}
      <Button shadowSize="md" variant="secondary" onPress={onPick}>
        <Icon as={Music} size={16} />
        <Text>{song ? "Ganti lagu" : "Pilih lagu"}</Text>
      </Button>
    </View>
  );
}

export { SongSection };

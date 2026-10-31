import { Image } from "expo-image";
import { Music } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Song } from "@/features/archive/types";
import { cn } from "@/lib/utils";

function SongResultItem({
  song,
  active,
  onPress,
}: {
  song: Song;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Item
      variant="outline"
      className={cn(active && "bg-primary")}
      accessibilityLabel={`Pilih ${song.title} oleh ${song.artist}`}
      onPress={onPress}
    >
      <ItemMedia variant="image">
        {song.artworkUrl ? (
          <Image
            source={{ uri: song.artworkUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Icon as={Music} size={18} />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{song.title}</ItemTitle>
        <ItemDescription numberOfLines={1}>{song.artist}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { SongResultItem };

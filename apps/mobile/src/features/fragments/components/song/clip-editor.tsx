import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Pause, Play } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import type { Song } from "@/features/archive/types";
import { PREVIEW_SECONDS } from "@/features/fragments/itunes";
import { useClippedLoop } from "@/features/fragments/use-clipped-loop";
import { formatClock } from "@/lib/format";

const MIN_CLIP_SECONDS = 3;

function ClipEditor({
  song,
  onChange,
}: {
  song: Song;
  onChange: (song: Song) => void;
}) {
  const player = useAudioPlayer(song.uri, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const start = song.startSec ?? 0;
  const end = song.endSec ?? PREVIEW_SECONDS;
  const max = status.duration > 0 ? status.duration : PREVIEW_SECONDS;
  useClippedLoop(player, status, start, end);
  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    player.play();
  };
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          accessibilityLabel={status.playing ? "Jeda" : "Putar"}
          disabled={!status.isLoaded}
          onPress={toggle}
        >
          <Icon as={status.playing ? Pause : Play} size={16} />
        </Button>
        <View className="flex-1">
          <TypographySmall numberOfLines={1}>{song.title}</TypographySmall>
          <TypographyMuted numberOfLines={1} className="text-xs">
            {song.artist}
          </TypographyMuted>
        </View>
        <TypographySmall className="text-xs">
          {formatClock(start)} – {formatClock(end)}
        </TypographySmall>
      </View>
      <Slider
        min={0}
        max={max}
        step={0.5}
        value={[start, end]}
        onValueChange={([from, to]) => {
          const safeTo = Math.max(to, from + MIN_CLIP_SECONDS);
          onChange({
            ...song,
            startSec: from,
            endSec: Math.min(safeTo, max),
          });
        }}
        onValueCommit={([from]) => {
          player.seekTo(from).then(() => player.play());
        }}
      />
    </View>
  );
}

export { ClipEditor };

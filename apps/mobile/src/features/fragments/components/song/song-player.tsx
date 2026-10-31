import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Music, Pause, Play } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { ShadowBox } from "@/components/ui/shadow-box";
import { TypographySmall } from "@/components/ui/typography";
import type { Song } from "@/features/archive/types";
import { useClippedLoop } from "@/features/fragments/use-clipped-loop";

function Disc({ spinning }: { spinning: boolean }) {
  const rotation = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));
  useEffect(() => {
    if (spinning) {
      rotation.set(
        withRepeat(
          withTiming(rotation.get() + 360, {
            duration: 3000,
            easing: Easing.linear,
          }),
          -1,
        ),
      );
      return;
    }
    cancelAnimation(rotation);
  }, [spinning, rotation]);
  return (
    <ShadowBox
      circle
      size="sm"
      contentClassName="size-10 items-center justify-center rounded-full"
    >
      <Animated.View
        style={style}
        className="size-10 items-center justify-center rounded-full border-2 border-border bg-secondary"
      >
        <View className="absolute size-8 rounded-full border border-secondary-foreground/25" />
        <View className="absolute size-6 rounded-full border border-secondary-foreground/25" />
        <View className="absolute left-1 top-1 h-1 w-2 -rotate-45 rounded-full bg-secondary-foreground/40" />
      </Animated.View>
      <View className="absolute size-5 items-center justify-center rounded-full border-2 border-border bg-primary">
        <Icon
          as={spinning ? Pause : Play}
          size={10}
          className="text-primary-foreground"
        />
      </View>
    </ShadowBox>
  );
}

function SongPlayer({ song }: { song: Song }) {
  const player = useAudioPlayer(song.uri, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  useClippedLoop(player, status, song.startSec ?? 0, song.endSec);
  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    player.play();
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={status.playing ? "Jeda lagu" : "Putar lagu"}
      disabled={!status.isLoaded}
      onPress={toggle}
      className="absolute inset-x-2 bottom-2 flex-row items-center justify-between gap-2"
    >
      <View className="max-w-[75%] shrink">
        <ShadowBox
          size="sm"
          contentClassName="flex-row items-center gap-2 rounded-md border-2 border-border bg-card px-4 py-1"
        >
          <Icon as={Music} size={12} />
          <TypographySmall
            numberOfLines={1}
            className="shrink font-head text-xs font-normal"
          >
            {song.title} · {song.artist}
          </TypographySmall>
        </ShadowBox>
      </View>
      <Disc spinning={status.playing} />
    </Pressable>
  );
}

export { SongPlayer };

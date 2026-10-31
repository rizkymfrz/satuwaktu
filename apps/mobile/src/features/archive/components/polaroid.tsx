import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Frame } from "@/components/scrapbook/frame";
import { Tape } from "@/components/scrapbook/tape";
import { tiltFor } from "@/components/scrapbook/utils";
import { TypographySmall } from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import type { Fragment } from "@/features/archive/types";

const SPRING = { damping: 12, stiffness: 180 };

function Polaroid({
  fragment,
  caption,
  ratio = 1,
  onPress,
  animated = true,
  accessibilityLabel,
  className,
  overlay,
}: {
  fragment: Fragment;
  caption?: string;
  ratio?: number;
  overlay?: ReactNode;
  onPress?: () => void;
  animated?: boolean;
  accessibilityLabel?: string;
  className?: string;
}) {
  const tilt = tiltFor(fragment.id, 3);
  const rotation = useSharedValue(tilt);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }, { scale: scale.get() }],
  }));
  const lift = (down: boolean) => {
    if (!onPress || !animated) {
      return;
    }
    rotation.set(withSpring(down ? 0 : tilt, SPRING));
    scale.set(withSpring(down ? 1.04 : 1, SPRING));
  };
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={
        accessibilityLabel ??
        `Buka fragmen: ${fragment.caption || "tanpa keterangan"}`
      }
      disabled={!onPress}
      onPress={onPress}
      onPressIn={() => lift(true)}
      onPressOut={() => lift(false)}
      className={className}
    >
      {({ pressed }) => (
        <Animated.View style={animatedStyle}>
          <Frame pressed={pressed} contentClassName="gap-2 p-2">
            <View
              className="overflow-hidden border-2 border-border"
              style={{ aspectRatio: ratio }}
            >
              <FragmentPhoto fragment={fragment} className="absolute inset-0" />
              {overlay}
            </View>
            <View className="h-6 items-center justify-center">
              {caption ? (
                <TypographySmall
                  numberOfLines={1}
                  className="font-head text-xs font-normal"
                >
                  {caption}
                </TypographySmall>
              ) : null}
            </View>
          </Frame>
          <Tape
            seed={fragment.id}
            width={48}
            height={16}
            tilt={-tilt * 2 - 2}
            className="absolute -top-2 self-center"
          />
        </Animated.View>
      )}
    </Pressable>
  );
}

export { Polaroid };

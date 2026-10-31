import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useReveal } from "@/components/motion/reveal";

const STAGGER = 50;
const GROUP = 6;

function Enter({
  index = 0,
  className,
  style,
  children,
}: {
  index?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const { ref, onLayout, progress } = useReveal((index % GROUP) * STAGGER);
  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.get();
    return {
      opacity: interpolate(value, [0, 0.5], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(value, [0, 1], [36, 0]) },
        { scale: interpolate(value, [0, 1], [0.92, 1]) },
      ],
    };
  });
  return (
    <View ref={ref} onLayout={onLayout} collapsable={false}>
      <Animated.View className={className} style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </View>
  );
}

export { Enter };

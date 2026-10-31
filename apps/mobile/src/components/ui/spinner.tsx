import { Loader2 } from "lucide-react-native";
import { useEffect, type ComponentProps } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

function Spinner({
  className,
  size = 16,
  ...props
}: Omit<ComponentProps<typeof Icon>, "as">) {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View role="status" aria-label="Loading" style={style}>
      <Icon as={Loader2} size={size} className={cn(className)} {...props} />
    </Animated.View>
  );
}

export { Spinner };

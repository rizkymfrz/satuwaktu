import type { ComponentProps, ReactNode, RefAttributes } from "react";
import { Platform, Pressable } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NativeOnlyAnimatedView(
  props:
    | (ComponentProps<typeof Animated.View> &
        RefAttributes<typeof Animated.View> & { as?: "View" })
    | (ComponentProps<typeof AnimatedPressable> &
        RefAttributes<typeof AnimatedPressable> & { as: "Pressable" }),
) {
  if (Platform.OS === "web") {
    return <>{props.children as ReactNode}</>;
  } else {
    if (props.as === "Pressable") {
      return <AnimatedPressable {...props} />;
    }
    return <Animated.View {...props} />;
  }
}

export { NativeOnlyAnimatedView };

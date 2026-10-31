import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { tiltFor } from "@/components/scrapbook/utils";

function Tilt({
  seed,
  max = 2,
  className,
  style,
  children,
}: {
  seed: string;
  max?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View
      className={className}
      style={[{ transform: [{ rotate: `${tiltFor(seed, max)}deg` }] }, style]}
    >
      {children}
    </View>
  );
}

export { Tilt };

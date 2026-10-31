import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import type { Fragment } from "@/features/archive/types";
import { cn } from "@/lib/utils";

function FragmentPhoto({
  fragment,
  className,
}: {
  fragment: Pick<Fragment, "photoUrl">;
  className?: string;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn("overflow-hidden", className)}
    >
      {fragment.photoUrl ? (
        <Image
          source={{ uri: fragment.photoUrl }}
          contentFit="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  );
}

export { FragmentPhoto };

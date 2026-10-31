import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Paper } from "@/components/scrapbook/paper";
import { Space } from "@/theme/space";

function PaperHeader({
  seed,
  children,
}: {
  seed: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View className="z-10">
      <Paper
        variant="kraft"
        torn="none"
        seed={seed}
        bleed={{ top: Space.lg, left: Space.md, right: Space.md }}
        contentClassName="px-4 pb-4 pt-0"
      >
        <View
          className="flex-row items-center gap-4"
          style={{ paddingTop: insets.top + Space.lg }}
        >
          {children}
        </View>
      </Paper>
    </View>
  );
}

export { PaperHeader };

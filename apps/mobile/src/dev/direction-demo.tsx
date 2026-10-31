import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  DirectionProvider,
  useDirection,
  type Direction,
} from "@/components/ui/direction";
import { ShadowBox } from "@/components/ui/shadow-box";
import { Text } from "@/components/ui/text";

function DirectionPreview() {
  const dir = useDirection();
  return (
    <View className="gap-3" style={{ direction: dir }}>
      <Text variant="muted">useDirection() → {dir}</Text>
      <View className="flex-row items-center gap-2">
        <ShadowBox
          size="md"
          contentClassName="rounded-md border-2 border-border bg-primary px-3 py-1.5"
        >
          <Text className="text-primary-foreground">Start</Text>
        </ShadowBox>
        <ShadowBox
          size="md"
          contentClassName="rounded-md border-2 border-border bg-card px-3 py-1.5"
        >
          <Text>End</Text>
        </ShadowBox>
      </View>
    </View>
  );
}

function DirectionDemo() {
  const [dir, setDir] = useState<Direction>("ltr");
  return (
    <View className="gap-4">
      <View className="flex-row gap-2">
        <Button
          variant={dir === "ltr" ? "default" : "outline"}
          size="sm"
          onPress={() => setDir("ltr")}
        >
          <Text>LTR</Text>
        </Button>
        <Button
          variant={dir === "rtl" ? "default" : "outline"}
          size="sm"
          onPress={() => setDir("rtl")}
        >
          <Text>RTL</Text>
        </Button>
      </View>
      <DirectionProvider direction={dir}>
        <DirectionPreview />
      </DirectionProvider>
    </View>
  );
}

export { DirectionDemo };

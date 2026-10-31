import { View } from "react-native";
import type { Pin } from "@/components/map/geo";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { formatRange } from "@/lib/format";

function PinDrawerHeader({ pin }: { pin: Pin }) {
  return (
    <View className="gap-1 p-4">
      <TypographyH4 className="font-head">
        {pin.name || "Lokasi tanpa nama"}
      </TypographyH4>
      <TypographyMuted className="text-xs">
        {pin.fragments.length} fragmen ·{" "}
        {formatRange(
          pin.fragments[pin.fragments.length - 1].takenAt,
          pin.fragments[0].takenAt,
        )}
      </TypographyMuted>
    </View>
  );
}

export { PinDrawerHeader };

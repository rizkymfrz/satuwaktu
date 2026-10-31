import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = [
  [200, 150, 220],
  [150, 220, 170],
];

const CHIP_COUNT = 4;

function FeedSkeleton() {
  return (
    <View
      className="gap-4 pt-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat arsip"
    >
      <View className="flex-row gap-4 px-4">
        {Array.from({ length: CHIP_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-8 w-16 rounded-full" />
        ))}
      </View>
      <View className="flex-row gap-4 px-4">
        {COLUMNS.map((heights, column) => (
          <View key={column} className="flex-1 gap-4">
            {heights.map((height, row) => (
              <Skeleton key={row} className="w-full" style={{ height }} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export { FeedSkeleton };

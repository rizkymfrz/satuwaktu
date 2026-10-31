import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = [
  [200, 150, 220],
  [150, 220, 170],
];

function ChapterSkeleton() {
  return (
    <View
      className="gap-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat fragmen"
    >
      <View className="flex-row gap-4">
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

export { ChapterSkeleton };

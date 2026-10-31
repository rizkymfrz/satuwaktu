import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const ITEM_COUNT = 3;

function TimelineSkeleton() {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Memuat linimasa">
      <View className="flex-row items-center gap-2 py-4">
        <View className="w-8 items-center">
          <Skeleton className="size-7 rounded-full" />
        </View>
        <Skeleton className="h-6 w-40" />
      </View>
      {Array.from({ length: ITEM_COUNT }, (_, index) => (
        <View key={index} className="flex-row">
          <View className="w-8 items-center">
            <View className="w-0.5 flex-1 bg-border" />
          </View>
          <View className="flex-1 pb-4 pl-1 pr-2">
            <Skeleton className="h-28 w-full" />
          </View>
        </View>
      ))}
    </View>
  );
}

export { TimelineSkeleton };

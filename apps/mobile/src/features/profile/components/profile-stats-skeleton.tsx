import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const BOX_COUNT = 3;

function ProfileStatsSkeleton() {
  return (
    <View
      className="flex-row gap-4 pr-1"
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat statistik"
    >
      {Array.from({ length: BOX_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-32 flex-1" />
      ))}
    </View>
  );
}

export { ProfileStatsSkeleton };

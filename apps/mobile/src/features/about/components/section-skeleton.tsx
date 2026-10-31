import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton({
  count,
  height,
  horizontal = false,
}: {
  count: number;
  height: number;
  horizontal?: boolean;
}) {
  return (
    <View
      className={horizontal ? "flex-row gap-4 pr-1" : "gap-4 pr-1"}
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat bagian ini"
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className={horizontal ? "flex-1" : "w-full"}
          style={{ height }}
        />
      ))}
    </View>
  );
}

export { SectionSkeleton };

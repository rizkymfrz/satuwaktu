import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

function FragmentSkeleton() {
  return (
    <View
      className="gap-4 p-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat fragmen"
    >
      <Skeleton className="aspect-square w-full" />
      <View className="gap-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </View>
        <Skeleton className="size-12 rounded-full" />
      </View>
      <Skeleton className="h-40 w-full" />
    </View>
  );
}

export { FragmentSkeleton };

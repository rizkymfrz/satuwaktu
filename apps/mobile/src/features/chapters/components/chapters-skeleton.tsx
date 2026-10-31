import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 2;

function ChaptersSkeleton() {
  return (
    <View
      className="gap-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat babak"
    >
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-72 w-full" />
      ))}
    </View>
  );
}

export { ChaptersSkeleton };

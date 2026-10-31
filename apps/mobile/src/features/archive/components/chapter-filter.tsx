import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Toggle } from "@/components/ui/toggle";
import type { ChapterRef } from "@/features/archive/types";

function ChapterFilter({
  chapters,
  active,
  onChange,
}: {
  chapters: ChapterRef[];
  active: string | null;
  onChange: (chapterId: string | null) => void;
}) {
  const options: (ChapterRef | null)[] = [null, ...chapters];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 px-4 pb-1 pr-4"
    >
      {options.map((chapter) => (
        <Toggle
          key={chapter?.id ?? "semua"}
          size="sm"
          circle
          pressed={(chapter?.id ?? null) === active}
          onPressedChange={() => onChange(chapter?.id ?? null)}
          accessibilityLabel={chapter?.name ?? "Semua"}
        >
          <Text>{chapter?.name ?? "Semua"}</Text>
        </Toggle>
      ))}
    </ScrollView>
  );
}

export { ChapterFilter };

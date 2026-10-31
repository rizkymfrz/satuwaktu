import { ScrollView, View } from "react-native";
import { TypographyH4 } from "@/components/ui/typography";
import { Polaroid } from "@/features/archive/components/polaroid";
import type { ChapterRef, Fragment } from "@/features/archive/types";

function RelatedFromChapter({
  chapter,
  items,
  onOpen,
}: {
  chapter: ChapterRef | null;
  items: Fragment[];
  onOpen: (id: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">
        Dari babak {chapter?.name}
      </TypographyH4>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-4 pl-2 pr-8 pt-4"
      >
        {items.map((item) => (
          <Polaroid
            key={item.id}
            fragment={item}
            caption={item.caption || "Tanpa keterangan"}
            className="w-36"
            onPress={() => onOpen(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export { RelatedFromChapter };

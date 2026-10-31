import { ScrollView, View } from "react-native";
import { TypographyH4 } from "@/components/ui/typography";
import type { Fragment } from "@/features/archive/types";
import { UploadCard } from "@/features/profile/components/upload-card";

function RecentUploads({ fragments }: { fragments: Fragment[] }) {
  if (fragments.length === 0) {
    return null;
  }
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">Unggahan terbaru</TypographyH4>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-4 pl-2 pr-8 pt-4"
      >
        {fragments.map((fragment) => (
          <UploadCard key={fragment.id} fragment={fragment} />
        ))}
      </ScrollView>
    </View>
  );
}

export { RecentUploads };

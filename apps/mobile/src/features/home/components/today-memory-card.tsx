import { Pressable, View } from "react-native";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import {
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { FragmentPhoto } from "@/features/archive/components/fragment-photo";
import type { Fragment } from "@/features/archive/types";
import { formatDate } from "@/lib/format";

function TodayMemoryCard({
  fragment,
  onOpen,
}: {
  fragment: Fragment;
  onOpen: () => void;
}) {
  return (
    <View className="gap-2 px-4">
      <TypographyH4 className="font-head">Hari Ini Dulu</TypographyH4>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Buka kenangan hari ini dulu"
        onPress={onOpen}
      >
        {({ pressed }) => (
          <TapedPaper
            tape="left"
            variant="note"
            seed="hari-ini"
            tilt={-1}
            pressed={pressed}
            contentClassName="p-4"
          >
            <View className="flex-row items-center gap-4">
              <FragmentPhoto
                fragment={fragment}
                className="h-28 w-28 border-2 border-border"
              />
              <View className="flex-1 justify-center gap-1">
                <TypographyMuted className="text-xs">
                  {formatDate(fragment.takenAt)}
                </TypographyMuted>
                <TypographySmall numberOfLines={1} className="text-base">
                  {fragment.caption || "Tanpa keterangan"}
                </TypographySmall>
              </View>
            </View>
          </TapedPaper>
        )}
      </Pressable>
    </View>
  );
}

export { TodayMemoryCard };

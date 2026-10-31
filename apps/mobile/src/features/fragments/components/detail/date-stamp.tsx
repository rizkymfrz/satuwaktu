import { View } from "react-native";
import { ShadowBox } from "@/components/ui/shadow-box";
import {
  TypographyH3,
  TypographyMuted,
  TypographySmall,
} from "@/components/ui/typography";
import { formatMonthShort } from "@/lib/format";

function DateStamp({ iso }: { iso: string }) {
  const date = new Date(iso);
  return (
    <ShadowBox
      size="md"
      contentClassName="w-20 overflow-hidden rounded-md border-2 border-border bg-card"
    >
      <View className="items-center border-b-2 border-border bg-primary py-0.5">
        <TypographySmall className="font-head text-xs font-normal uppercase leading-4">
          {formatMonthShort(iso)}
        </TypographySmall>
      </View>
      <View className="items-center py-1">
        <TypographyH3 className="font-head text-3xl leading-9">
          {date.getDate()}
        </TypographyH3>
        <TypographyMuted className="text-xs leading-4">
          {date.getFullYear()}
        </TypographyMuted>
      </View>
    </ShadowBox>
  );
}

export { DateStamp };
